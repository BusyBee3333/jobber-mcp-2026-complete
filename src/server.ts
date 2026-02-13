/**
 * Jobber MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { JobberClient } from './clients/jobber.js';
import { jobsTools } from './tools/jobs-tools.js';
import { clientsTools } from './tools/clients-tools.js';
import { quotesTools } from './tools/quotes-tools.js';
import { invoicesTools } from './tools/invoices-tools.js';
import { schedulingTools } from './tools/scheduling-tools.js';
import { teamTools } from './tools/team-tools.js';
import { expensesTools } from './tools/expenses-tools.js';
import { productsTools } from './tools/products-tools.js';
import { requestsTools } from './tools/requests-tools.js';
import { reportingTools } from './tools/reporting-tools.js';
import { propertiesTools } from './tools/properties-tools.js';
import { timesheetsTools } from './tools/timesheets-tools.js';
import { lineItemsTools } from './tools/line-items-tools.js';
import { formsTools } from './tools/forms-tools.js';
import { taxesTools } from './tools/taxes-tools.js';

// Combine all tools
const allTools = {
  ...jobsTools,
  ...clientsTools,
  ...quotesTools,
  ...invoicesTools,
  ...schedulingTools,
  ...teamTools,
  ...expensesTools,
  ...productsTools,
  ...requestsTools,
  ...reportingTools,
  ...propertiesTools,
  ...timesheetsTools,
  ...lineItemsTools,
  ...formsTools,
  ...taxesTools,
};

export class JobberServer {
  private server: Server;
  private client: JobberClient;

  constructor() {
    const apiToken = process.env.JOBBER_API_TOKEN;
    if (!apiToken) {
      throw new Error('JOBBER_API_TOKEN environment variable is required');
    }

    this.client = new JobberClient({ apiToken });
    this.server = new Server(
      {
        name: 'jobber-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Object.entries(allTools).map(([name, tool]) => ({
          name,
          description: tool.description,
          inputSchema: tool.inputSchema.shape,
        })),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = allTools[name as keyof typeof allTools];
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
      }

      try {
        // Validate arguments
        const validatedArgs = tool.inputSchema.parse(args);

        // Execute tool
        const result = await tool.execute(this.client, validatedArgs);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new McpError(
            ErrorCode.InternalError,
            `Tool execution failed: ${error.message}`
          );
        }
        throw error;
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Jobber MCP server running on stdio');
  }
}
