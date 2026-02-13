/**
 * Scheduling Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const schedulingTools = {
  list_visits: {
    description: 'List all visits with optional date filtering',
    inputSchema: z.object({
      startDate: z.string().optional().describe('ISO 8601 date'),
      endDate: z.string().optional().describe('ISO 8601 date'),
      status: z.enum(['UNSCHEDULED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterConditions: string[] = [];
      if (args.startDate) {
        filterConditions.push(`startDate: "${args.startDate}"`);
      }
      if (args.endDate) {
        filterConditions.push(`endDate: "${args.endDate}"`);
      }
      if (args.status) {
        filterConditions.push(`status: ${args.status}`);
      }

      const filters = filterConditions.length > 0 ? `, filter: { ${filterConditions.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListVisits {
          visits(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                ${JobberClient.visitFields}
                job {
                  id
                  jobNumber
                  title
                }
                assignedUsers {
                  ${JobberClient.userFields}
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
        visits: data.visits.edges.map((e: any) => e.node),
        pageInfo: data.visits.pageInfo,
        totalCount: data.visits.totalCount,
      };
    },
  },

  get_visit: {
    description: 'Get a specific visit by ID',
    inputSchema: z.object({
      visitId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetVisit($id: ID!) {
          visit(id: $id) {
            ${JobberClient.visitFields}
            job {
              id
              jobNumber
              title
            }
            assignedUsers {
              ${JobberClient.userFields}
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.visitId });
      return { visit: data.visit };
    },
  },

  create_visit: {
    description: 'Create a new visit',
    inputSchema: z.object({
      title: z.string(),
      jobId: z.string().optional(),
      startAt: z.string().describe('ISO 8601 datetime'),
      endAt: z.string().describe('ISO 8601 datetime'),
      userIds: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateVisit($input: VisitInput!) {
          visitCreate(input: $input) {
            visit {
              ${JobberClient.visitFields}
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
        jobId: args.jobId,
        startAt: args.startAt,
        endAt: args.endAt,
        userIds: args.userIds,
        notes: args.notes,
      };

      const data = await client.mutate(mutation, { input });

      if (data.visitCreate.userErrors?.length > 0) {
        throw new Error(`Visit creation failed: ${data.visitCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { visit: data.visitCreate.visit };
    },
  },

  update_visit: {
    description: 'Update an existing visit',
    inputSchema: z.object({
      visitId: z.string(),
      title: z.string().optional(),
      startAt: z.string().optional().describe('ISO 8601 datetime'),
      endAt: z.string().optional().describe('ISO 8601 datetime'),
      notes: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateVisit($id: ID!, $input: VisitUpdateInput!) {
          visitUpdate(id: $id, input: $input) {
            visit {
              ${JobberClient.visitFields}
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
      if (args.startAt) input.startAt = args.startAt;
      if (args.endAt) input.endAt = args.endAt;
      if (args.notes) input.notes = args.notes;

      const data = await client.mutate(mutation, { id: args.visitId, input });

      if (data.visitUpdate.userErrors?.length > 0) {
        throw new Error(`Visit update failed: ${data.visitUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { visit: data.visitUpdate.visit };
    },
  },

  complete_visit: {
    description: 'Mark a visit as completed',
    inputSchema: z.object({
      visitId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CompleteVisit($id: ID!) {
          visitComplete(id: $id) {
            visit {
              ${JobberClient.visitFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.visitId });

      if (data.visitComplete.userErrors?.length > 0) {
        throw new Error(`Visit completion failed: ${data.visitComplete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { visit: data.visitComplete.visit };
    },
  },

  list_visit_assignments: {
    description: 'List all user assignments for a specific visit',
    inputSchema: z.object({
      visitId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetVisitAssignments($id: ID!) {
          visit(id: $id) {
            assignedUsers {
              ${JobberClient.userFields}
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.visitId });
      return { assignedUsers: data.visit.assignedUsers };
    },
  },
};
