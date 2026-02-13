/**
 * Requests Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const requestsTools = {
  list_requests: {
    description: 'List all client requests',
    inputSchema: z.object({
      status: z.enum(['NEW', 'IN_PROGRESS', 'CONVERTED', 'CLOSED']).optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filters = args.status ? `, filter: { status: ${args.status} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListRequests {
          requests(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                id
                title
                description
                status
                createdAt
                client {
                  ${JobberClient.clientFields}
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
          }
        }
      `;

      const data = await client.query(query);
      return {
        requests: data.requests.edges.map((e: any) => e.node),
        pageInfo: data.requests.pageInfo,
        totalCount: data.requests.totalCount,
      };
    },
  },

  get_request: {
    description: 'Get a specific request by ID',
    inputSchema: z.object({
      requestId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetRequest($id: ID!) {
          request(id: $id) {
            id
            title
            description
            status
            createdAt
            client {
              ${JobberClient.clientFields}
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.requestId });
      return { request: data.request };
    },
  },

  create_request: {
    description: 'Create a new client request',
    inputSchema: z.object({
      title: z.string(),
      description: z.string().optional(),
      clientId: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateRequest($input: RequestInput!) {
          requestCreate(input: $input) {
            request {
              id
              title
              description
              status
              createdAt
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        title: args.title,
        description: args.description,
        clientId: args.clientId,
      };

      const data = await client.mutate(mutation, { input });

      if (data.requestCreate.userErrors?.length > 0) {
        throw new Error(`Request creation failed: ${data.requestCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { request: data.requestCreate.request };
    },
  },

  update_request: {
    description: 'Update an existing request',
    inputSchema: z.object({
      requestId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['NEW', 'IN_PROGRESS', 'CONVERTED', 'CLOSED']).optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateRequest($id: ID!, $input: RequestUpdateInput!) {
          requestUpdate(id: $id, input: $input) {
            request {
              id
              title
              description
              status
              createdAt
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input: any = {};
      if (args.title) input.title = args.title;
      if (args.description) input.description = args.description;
      if (args.status) input.status = args.status;

      const data = await client.mutate(mutation, { id: args.requestId, input });

      if (data.requestUpdate.userErrors?.length > 0) {
        throw new Error(`Request update failed: ${data.requestUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { request: data.requestUpdate.request };
    },
  },

  convert_request_to_quote: {
    description: 'Convert a request to a quote',
    inputSchema: z.object({
      requestId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ConvertRequestToQuote($id: ID!) {
          requestConvertToQuote(id: $id) {
            quote {
              ${JobberClient.quoteFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.requestId });

      if (data.requestConvertToQuote.userErrors?.length > 0) {
        throw new Error(`Request conversion to quote failed: ${data.requestConvertToQuote.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { quote: data.requestConvertToQuote.quote };
    },
  },

  convert_request_to_job: {
    description: 'Convert a request directly to a job',
    inputSchema: z.object({
      requestId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ConvertRequestToJob($id: ID!) {
          requestConvertToJob(id: $id) {
            job {
              ${JobberClient.jobFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.requestId });

      if (data.requestConvertToJob.userErrors?.length > 0) {
        throw new Error(`Request conversion to job failed: ${data.requestConvertToJob.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { job: data.requestConvertToJob.job };
    },
  },
};
