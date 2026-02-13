/**
 * Team Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const teamTools = {
  list_users: {
    description: 'List all users in the organization',
    inputSchema: z.object({
      isActive: z.boolean().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filters = args.isActive !== undefined ? `, filter: { isActive: ${args.isActive} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListUsers {
          users(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                ${JobberClient.userFields}
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
        users: data.users.edges.map((e: any) => e.node),
        pageInfo: data.users.pageInfo,
        totalCount: data.users.totalCount,
      };
    },
  },

  get_user: {
    description: 'Get a specific user by ID',
    inputSchema: z.object({
      userId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetUser($id: ID!) {
          user(id: $id) {
            ${JobberClient.userFields}
          }
        }
      `;

      const data = await client.query(query, { id: args.userId });
      return { user: data.user };
    },
  },

  list_time_entries: {
    description: 'List time entries with optional filtering',
    inputSchema: z.object({
      userId: z.string().optional(),
      visitId: z.string().optional(),
      startDate: z.string().optional().describe('ISO 8601 date'),
      endDate: z.string().optional().describe('ISO 8601 date'),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterConditions: string[] = [];
      if (args.userId) {
        filterConditions.push(`userId: "${args.userId}"`);
      }
      if (args.visitId) {
        filterConditions.push(`visitId: "${args.visitId}"`);
      }
      if (args.startDate) {
        filterConditions.push(`startDate: "${args.startDate}"`);
      }
      if (args.endDate) {
        filterConditions.push(`endDate: "${args.endDate}"`);
      }

      const filters = filterConditions.length > 0 ? `, filter: { ${filterConditions.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListTimeEntries {
          timeEntries(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                id
                startAt
                endAt
                duration
                notes
                user {
                  ${JobberClient.userFields}
                }
                visit {
                  id
                  title
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
        timeEntries: data.timeEntries.edges.map((e: any) => e.node),
        pageInfo: data.timeEntries.pageInfo,
        totalCount: data.timeEntries.totalCount,
      };
    },
  },

  create_time_entry: {
    description: 'Create a new time entry',
    inputSchema: z.object({
      userId: z.string(),
      visitId: z.string().optional(),
      startAt: z.string().describe('ISO 8601 datetime'),
      endAt: z.string().optional().describe('ISO 8601 datetime'),
      notes: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateTimeEntry($input: TimeEntryInput!) {
          timeEntryCreate(input: $input) {
            timeEntry {
              id
              startAt
              endAt
              duration
              notes
              user {
                ${JobberClient.userFields}
              }
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        userId: args.userId,
        visitId: args.visitId,
        startAt: args.startAt,
        endAt: args.endAt,
        notes: args.notes,
      };

      const data = await client.mutate(mutation, { input });

      if (data.timeEntryCreate.userErrors?.length > 0) {
        throw new Error(`Time entry creation failed: ${data.timeEntryCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { timeEntry: data.timeEntryCreate.timeEntry };
    },
  },
};
