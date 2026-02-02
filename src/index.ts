#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "jobber";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.getjobber.com/api/graphql";

// ============================================
// GRAPHQL CLIENT
// ============================================
class JobberClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async query(query: string, variables: Record<string, any> = {}) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-JOBBER-GRAPHQL-VERSION": "2024-12-16",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Jobber API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  }
}

// ============================================
// GRAPHQL QUERIES AND MUTATIONS
// ============================================
const QUERIES = {
  listJobs: `
    query ListJobs($first: Int, $after: String) {
      jobs(first: $first, after: $after) {
        nodes {
          id
          title
          jobNumber
          jobStatus
          startAt
          endAt
          client {
            id
            name
          }
          property {
            id
            address {
              street1
              city
              province
              postalCode
            }
          }
          total
          instructions
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  getJob: `
    query GetJob($id: EncodedId!) {
      job(id: $id) {
        id
        title
        jobNumber
        jobStatus
        startAt
        endAt
        client {
          id
          name
          emails {
            address
          }
          phones {
            number
          }
        }
        property {
          id
          address {
            street1
            street2
            city
            province
            postalCode
            country
          }
        }
        lineItems {
          nodes {
            name
            description
            quantity
            unitPrice
            total
          }
        }
        total
        instructions
        createdAt
        updatedAt
      }
    }
  `,
  listQuotes: `
    query ListQuotes($first: Int, $after: String) {
      quotes(first: $first, after: $after) {
        nodes {
          id
          quoteNumber
          quoteStatus
          title
          client {
            id
            name
          }
          amounts {
            subtotal
            total
          }
          createdAt
          sentAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  listInvoices: `
    query ListInvoices($first: Int, $after: String) {
      invoices(first: $first, after: $after) {
        nodes {
          id
          invoiceNumber
          invoiceStatus
          subject
          client {
            id
            name
          }
          amounts {
            subtotal
            total
            depositAmount
            discountAmount
            paymentsTotal
            invoiceBalance
          }
          dueDate
          issuedDate
          createdAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  listClients: `
    query ListClients($first: Int, $after: String, $searchTerm: String) {
      clients(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          id
          name
          firstName
          lastName
          companyName
          isCompany
          emails {
            address
            primary
          }
          phones {
            number
            primary
          }
          billingAddress {
            street1
            city
            province
            postalCode
          }
          createdAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
};

const MUTATIONS = {
  createJob: `
    mutation CreateJob($input: JobCreateInput!) {
      jobCreate(input: $input) {
        job {
          id
          title
          jobNumber
          jobStatus
        }
        userErrors {
          message
          path
        }
      }
    }
  `,
  createQuote: `
    mutation CreateQuote($input: QuoteCreateInput!) {
      quoteCreate(input: $input) {
        quote {
          id
          quoteNumber
          quoteStatus
          title
        }
        userErrors {
          message
          path
        }
      }
    }
  `,
  createClient: `
    mutation CreateClient($input: ClientCreateInput!) {
      clientCreate(input: $input) {
        client {
          id
          name
          firstName
          lastName
        }
        userErrors {
          message
          path
        }
      }
    }
  `,
};

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_jobs",
    description: "List jobs from Jobber with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        first: { type: "number", description: "Number of jobs to return (max 100)" },
        after: { type: "string", description: "Cursor for pagination" },
      },
    },
  },
  {
    name: "get_job",
    description: "Get a specific job by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Job ID (encoded ID format)" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_job",
    description: "Create a new job in Jobber",
    inputSchema: {
      type: "object" as const,
      properties: {
        clientId: { type: "string", description: "Client ID to associate job with" },
        title: { type: "string", description: "Job title" },
        instructions: { type: "string", description: "Job instructions/notes" },
        startAt: { type: "string", description: "Start date/time (ISO 8601)" },
        endAt: { type: "string", description: "End date/time (ISO 8601)" },
        lineItems: {
          type: "array",
          description: "Line items for the job",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              quantity: { type: "number" },
              unitPrice: { type: "number" },
            },
          },
        },
      },
      required: ["clientId", "title"],
    },
  },
  {
    name: "list_quotes",
    description: "List quotes from Jobber with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        first: { type: "number", description: "Number of quotes to return (max 100)" },
        after: { type: "string", description: "Cursor for pagination" },
      },
    },
  },
  {
    name: "create_quote",
    description: "Create a new quote in Jobber",
    inputSchema: {
      type: "object" as const,
      properties: {
        clientId: { type: "string", description: "Client ID to associate quote with" },
        title: { type: "string", description: "Quote title" },
        message: { type: "string", description: "Quote message to client" },
        lineItems: {
          type: "array",
          description: "Line items for the quote",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              quantity: { type: "number" },
              unitPrice: { type: "number" },
            },
          },
        },
      },
      required: ["clientId", "title"],
    },
  },
  {
    name: "list_invoices",
    description: "List invoices from Jobber with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        first: { type: "number", description: "Number of invoices to return (max 100)" },
        after: { type: "string", description: "Cursor for pagination" },
      },
    },
  },
  {
    name: "list_clients",
    description: "List clients from Jobber with optional search",
    inputSchema: {
      type: "object" as const,
      properties: {
        first: { type: "number", description: "Number of clients to return (max 100)" },
        after: { type: "string", description: "Cursor for pagination" },
        searchTerm: { type: "string", description: "Search term to filter clients" },
      },
    },
  },
  {
    name: "create_client",
    description: "Create a new client in Jobber",
    inputSchema: {
      type: "object" as const,
      properties: {
        firstName: { type: "string", description: "Client first name" },
        lastName: { type: "string", description: "Client last name" },
        companyName: { type: "string", description: "Company name (for business clients)" },
        isCompany: { type: "boolean", description: "Whether this is a business client" },
        email: { type: "string", description: "Client email address" },
        phone: { type: "string", description: "Client phone number" },
        street1: { type: "string", description: "Street address" },
        city: { type: "string", description: "City" },
        province: { type: "string", description: "State/Province" },
        postalCode: { type: "string", description: "Postal/ZIP code" },
      },
      required: ["firstName", "lastName"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: JobberClient, name: string, args: any) {
  switch (name) {
    case "list_jobs": {
      const { first = 25, after } = args;
      return await client.query(QUERIES.listJobs, { first, after });
    }
    case "get_job": {
      const { id } = args;
      return await client.query(QUERIES.getJob, { id });
    }
    case "create_job": {
      const { clientId, title, instructions, startAt, endAt, lineItems } = args;
      const input: any = { clientId, title };
      if (instructions) input.instructions = instructions;
      if (startAt) input.startAt = startAt;
      if (endAt) input.endAt = endAt;
      if (lineItems) input.lineItems = lineItems;
      return await client.query(MUTATIONS.createJob, { input });
    }
    case "list_quotes": {
      const { first = 25, after } = args;
      return await client.query(QUERIES.listQuotes, { first, after });
    }
    case "create_quote": {
      const { clientId, title, message, lineItems } = args;
      const input: any = { clientId, title };
      if (message) input.message = message;
      if (lineItems) input.lineItems = lineItems;
      return await client.query(MUTATIONS.createQuote, { input });
    }
    case "list_invoices": {
      const { first = 25, after } = args;
      return await client.query(QUERIES.listInvoices, { first, after });
    }
    case "list_clients": {
      const { first = 25, after, searchTerm } = args;
      return await client.query(QUERIES.listClients, { first, after, searchTerm });
    }
    case "create_client": {
      const { firstName, lastName, companyName, isCompany, email, phone, street1, city, province, postalCode } = args;
      const input: any = { firstName, lastName };
      if (companyName) input.companyName = companyName;
      if (isCompany !== undefined) input.isCompany = isCompany;
      if (email) input.emails = [{ address: email, primary: true }];
      if (phone) input.phones = [{ number: phone, primary: true }];
      if (street1) {
        input.billingAddress = { street1 };
        if (city) input.billingAddress.city = city;
        if (province) input.billingAddress.province = province;
        if (postalCode) input.billingAddress.postalCode = postalCode;
      }
      return await client.query(MUTATIONS.createClient, { input });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const accessToken = process.env.JOBBER_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Error: JOBBER_ACCESS_TOKEN environment variable required");
    console.error("Obtain via OAuth2 flow at https://developer.getjobber.com");
    process.exit(1);
  }

  const client = new JobberClient(accessToken);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
