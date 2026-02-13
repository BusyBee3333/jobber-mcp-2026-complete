/**
 * Clients Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const clientsTools = {
  list_clients: {
    description: 'List all clients with optional filtering',
    inputSchema: z.object({
      isArchived: z.boolean().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filters = args.isArchived !== undefined ? `, filter: { isArchived: ${args.isArchived} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListClients {
          clients(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                ${JobberClient.clientFields}
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
        clients: data.clients.edges.map((e: any) => e.node),
        pageInfo: data.clients.pageInfo,
        totalCount: data.clients.totalCount,
      };
    },
  },

  get_client: {
    description: 'Get a specific client by ID',
    inputSchema: z.object({
      clientId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetClient($id: ID!) {
          client(id: $id) {
            ${JobberClient.clientFields}
          }
        }
      `;

      const data = await client.query(query, { id: args.clientId });
      return { client: data.client };
    },
  },

  create_client: {
    description: 'Create a new client',
    inputSchema: z.object({
      firstName: z.string(),
      lastName: z.string(),
      companyName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      billingAddress: z.object({
        street1: z.string().optional(),
        street2: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      }).optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateClient($input: ClientInput!) {
          clientCreate(input: $input) {
            client {
              ${JobberClient.clientFields}
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        firstName: args.firstName,
        lastName: args.lastName,
        companyName: args.companyName,
        email: args.email,
        phone: args.phone,
        billingAddress: args.billingAddress,
      };

      const data = await client.mutate(mutation, { input });

      if (data.clientCreate.userErrors?.length > 0) {
        throw new Error(`Client creation failed: ${data.clientCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { client: data.clientCreate.client };
    },
  },

  update_client: {
    description: 'Update an existing client',
    inputSchema: z.object({
      clientId: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      companyName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateClient($id: ID!, $input: ClientUpdateInput!) {
          clientUpdate(id: $id, input: $input) {
            client {
              ${JobberClient.clientFields}
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input: any = {};
      if (args.firstName) input.firstName = args.firstName;
      if (args.lastName) input.lastName = args.lastName;
      if (args.companyName) input.companyName = args.companyName;
      if (args.email) input.email = args.email;
      if (args.phone) input.phone = args.phone;

      const data = await client.mutate(mutation, { id: args.clientId, input });

      if (data.clientUpdate.userErrors?.length > 0) {
        throw new Error(`Client update failed: ${data.clientUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { client: data.clientUpdate.client };
    },
  },

  archive_client: {
    description: 'Archive a client',
    inputSchema: z.object({
      clientId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ArchiveClient($id: ID!) {
          clientArchive(id: $id) {
            client {
              ${JobberClient.clientFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.clientId });

      if (data.clientArchive.userErrors?.length > 0) {
        throw new Error(`Client archive failed: ${data.clientArchive.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { client: data.clientArchive.client };
    },
  },

  search_clients: {
    description: 'Search clients by name, email, or company',
    inputSchema: z.object({
      query: z.string().describe('Search query string'),
      limit: z.number().default(50),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query SearchClients($query: String!, $limit: Int!) {
          clients(first: $limit, filter: { search: $query }) {
            edges {
              node {
                ${JobberClient.clientFields}
              }
            }
            totalCount
          }
        }
      `;

      const data = await client.query(query, { query: args.query, limit: args.limit });
      return {
        clients: data.clients.edges.map((e: any) => e.node),
        totalCount: data.clients.totalCount,
      };
    },
  },

  list_client_properties: {
    description: 'List all properties for a specific client',
    inputSchema: z.object({
      clientId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetClientProperties($id: ID!) {
          client(id: $id) {
            properties {
              id
              isDefault
              address {
                street1
                street2
                city
                province
                postalCode
                country
              }
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.clientId });
      return { properties: data.client.properties };
    },
  },
};
