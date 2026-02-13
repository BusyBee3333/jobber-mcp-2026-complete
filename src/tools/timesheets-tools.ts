/**
 * Timesheets Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';
import type { TimeEntry } from '../types/jobber.js';

export const timesheetsTools = {
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
      const filters: string[] = [];
      if (args.userId) filters.push(`userId: "${args.userId}"`);
      if (args.visitId) filters.push(`visitId: "${args.visitId}"`);
      if (args.startDate) filters.push(`startDate: "${args.startDate}"`);
      if (args.endDate) filters.push(`endDate: "${args.endDate}"`);

      const filterClause = filters.length > 0 ? `, filter: { ${filters.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListTimeEntries {
          timeEntries(first: ${args.limit}${afterClause}${filterClause}) {
            edges {
              node {
                id
                startAt
                endAt
                duration
                notes
                user {
                  id
                  firstName
                  lastName
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
          }
        }
      `;

      const data = await client.query(query);
      return {
        timeEntries: data.timeEntries.edges.map((e: any) => e.node),
        pageInfo: data.timeEntries.pageInfo,
      };
    },
  },

  get_time_entry: {
    description: 'Get a specific time entry by ID',
    inputSchema: z.object({
      timeEntryId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetTimeEntry($id: ID!) {
          timeEntry(id: $id) {
            id
            startAt
            endAt
            duration
            notes
            user {
              id
              firstName
              lastName
            }
            visit {
              id
              title
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.timeEntryId });
      return { timeEntry: data.timeEntry };
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
            }
            userErrors {
              message
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

  update_time_entry: {
    description: 'Update an existing time entry',
    inputSchema: z.object({
      timeEntryId: z.string(),
      startAt: z.string().optional().describe('ISO 8601 datetime'),
      endAt: z.string().optional().describe('ISO 8601 datetime'),
      notes: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateTimeEntry($id: ID!, $input: TimeEntryUpdateInput!) {
          timeEntryUpdate(id: $id, input: $input) {
            timeEntry {
              id
              startAt
              endAt
              duration
              notes
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input: any = {};
      if (args.startAt) input.startAt = args.startAt;
      if (args.endAt) input.endAt = args.endAt;
      if (args.notes) input.notes = args.notes;

      const data = await client.mutate(mutation, { id: args.timeEntryId, input });

      if (data.timeEntryUpdate.userErrors?.length > 0) {
        throw new Error(`Time entry update failed: ${data.timeEntryUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { timeEntry: data.timeEntryUpdate.timeEntry };
    },
  },

  delete_time_entry: {
    description: 'Delete a time entry',
    inputSchema: z.object({
      timeEntryId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteTimeEntry($id: ID!) {
          timeEntryDelete(id: $id) {
            deletedTimeEntryId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.timeEntryId });

      if (data.timeEntryDelete.userErrors?.length > 0) {
        throw new Error(`Time entry deletion failed: ${data.timeEntryDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedTimeEntryId: data.timeEntryDelete.deletedTimeEntryId };
    },
  },

  stop_time_entry: {
    description: 'Stop a running time entry (set end time to now)',
    inputSchema: z.object({
      timeEntryId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation StopTimeEntry($id: ID!) {
          timeEntryUpdate(id: $id, input: { endAt: "${new Date().toISOString()}" }) {
            timeEntry {
              id
              startAt
              endAt
              duration
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.timeEntryId });

      if (data.timeEntryUpdate.userErrors?.length > 0) {
        throw new Error(`Failed to stop time entry: ${data.timeEntryUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { timeEntry: data.timeEntryUpdate.timeEntry };
    },
  },

  get_user_timesheet: {
    description: 'Get timesheet summary for a user over a date range',
    inputSchema: z.object({
      userId: z.string(),
      startDate: z.string().describe('ISO 8601 date'),
      endDate: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetUserTimesheet($userId: String!, $startDate: String!, $endDate: String!) {
          timeEntries(filter: { userId: $userId, startDate: $startDate, endDate: $endDate }) {
            edges {
              node {
                id
                startAt
                endAt
                duration
                notes
                visit {
                  id
                  title
                }
              }
            }
          }
        }
      `;

      const data = await client.query(query, {
        userId: args.userId,
        startDate: args.startDate,
        endDate: args.endDate,
      });

      const entries = data.timeEntries.edges.map((e: any) => e.node);
      const totalDuration = entries.reduce((sum: number, entry: any) => sum + (entry.duration || 0), 0);

      return {
        userId: args.userId,
        startDate: args.startDate,
        endDate: args.endDate,
        entries,
        totalHours: totalDuration / 3600, // Convert seconds to hours
      };
    },
  },
};
