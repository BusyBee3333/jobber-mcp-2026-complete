/**
 * Quotes Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const quotesTools = {
  list_quotes: {
    description: 'List all quotes with optional filtering',
    inputSchema: z.object({
      status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'CHANGES_REQUESTED', 'CONVERTED', 'EXPIRED']).optional(),
      clientId: z.string().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterConditions: string[] = [];
      if (args.status) {
        filterConditions.push(`status: ${args.status}`);
      }
      if (args.clientId) {
        filterConditions.push(`clientId: "${args.clientId}"`);
      }

      const filters = filterConditions.length > 0 ? `, filter: { ${filterConditions.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListQuotes {
          quotes(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                ${JobberClient.quoteFields}
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
        quotes: data.quotes.edges.map((e: any) => e.node),
        pageInfo: data.quotes.pageInfo,
        totalCount: data.quotes.totalCount,
      };
    },
  },

  get_quote: {
    description: 'Get a specific quote by ID',
    inputSchema: z.object({
      quoteId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetQuote($id: ID!) {
          quote(id: $id) {
            ${JobberClient.quoteFields}
          }
        }
      `;

      const data = await client.query(query, { id: args.quoteId });
      return { quote: data.quote };
    },
  },

  create_quote: {
    description: 'Create a new quote',
    inputSchema: z.object({
      title: z.string(),
      clientId: z.string(),
      propertyId: z.string().optional(),
      lineItems: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        quantity: z.number(),
        unitPrice: z.number().optional(),
        productId: z.string().optional(),
      })).optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateQuote($input: QuoteInput!) {
          quoteCreate(input: $input) {
            quote {
              ${JobberClient.quoteFields}
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
        clientId: args.clientId,
        propertyId: args.propertyId,
        lineItems: args.lineItems,
      };

      const data = await client.mutate(mutation, { input });

      if (data.quoteCreate.userErrors?.length > 0) {
        throw new Error(`Quote creation failed: ${data.quoteCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { quote: data.quoteCreate.quote };
    },
  },

  update_quote: {
    description: 'Update an existing quote',
    inputSchema: z.object({
      quoteId: z.string(),
      title: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateQuote($id: ID!, $input: QuoteUpdateInput!) {
          quoteUpdate(id: $id, input: $input) {
            quote {
              ${JobberClient.quoteFields}
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

      const data = await client.mutate(mutation, { id: args.quoteId, input });

      if (data.quoteUpdate.userErrors?.length > 0) {
        throw new Error(`Quote update failed: ${data.quoteUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { quote: data.quoteUpdate.quote };
    },
  },

  send_quote: {
    description: 'Send a quote to the client',
    inputSchema: z.object({
      quoteId: z.string(),
      message: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation SendQuote($id: ID!, $message: String) {
          quoteSend(id: $id, message: $message) {
            quote {
              ${JobberClient.quoteFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.quoteId, message: args.message });

      if (data.quoteSend.userErrors?.length > 0) {
        throw new Error(`Quote send failed: ${data.quoteSend.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { quote: data.quoteSend.quote };
    },
  },

  approve_quote: {
    description: 'Approve a quote',
    inputSchema: z.object({
      quoteId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ApproveQuote($id: ID!) {
          quoteApprove(id: $id) {
            quote {
              ${JobberClient.quoteFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.quoteId });

      if (data.quoteApprove.userErrors?.length > 0) {
        throw new Error(`Quote approval failed: ${data.quoteApprove.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { quote: data.quoteApprove.quote };
    },
  },

  convert_quote_to_job: {
    description: 'Convert an approved quote to a job',
    inputSchema: z.object({
      quoteId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ConvertQuoteToJob($id: ID!) {
          quoteConvertToJob(id: $id) {
            job {
              ${JobberClient.jobFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.quoteId });

      if (data.quoteConvertToJob.userErrors?.length > 0) {
        throw new Error(`Quote conversion failed: ${data.quoteConvertToJob.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { job: data.quoteConvertToJob.job };
    },
  },

  list_quote_line_items: {
    description: 'List all line items for a specific quote',
    inputSchema: z.object({
      quoteId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetQuoteLineItems($id: ID!) {
          quote(id: $id) {
            lineItems {
              ${JobberClient.lineItemFields}
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.quoteId });
      return { lineItems: data.quote.lineItems };
    },
  },
};
