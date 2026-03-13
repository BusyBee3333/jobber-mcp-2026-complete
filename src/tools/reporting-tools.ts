/**
 * Reporting Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const reportingTools = {
  get_revenue_report: {
    description: 'Get revenue report for a date range',
    inputSchema: z.object({
      startDate: z.string().describe('ISO 8601 date'),
      endDate: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetRevenueReport($startDate: String!, $endDate: String!) {
          reports {
            revenue(startDate: $startDate, endDate: $endDate) {
              totalRevenue {
                amount
                currency
              }
              invoicedRevenue {
                amount
                currency
              }
              paidRevenue {
                amount
                currency
              }
              outstandingRevenue {
                amount
                currency
              }
            }
          }
        }
      `;

      const data = await client.query(query, { startDate: args.startDate, endDate: args.endDate });
      return { revenueReport: data.reports.revenue };
    },
  },

  get_job_profit_report: {
    description: 'Get profitability report for jobs in a date range',
    inputSchema: z.object({
      startDate: z.string().describe('ISO 8601 date'),
      endDate: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetJobProfitReport($startDate: String!, $endDate: String!) {
          reports {
            jobProfit(startDate: $startDate, endDate: $endDate) {
              totalRevenue {
                amount
                currency
              }
              totalCosts {
                amount
                currency
              }
              totalProfit {
                amount
                currency
              }
              profitMargin
              jobBreakdown {
                jobId
                jobNumber
                title
                revenue {
                  amount
                  currency
                }
                costs {
                  amount
                  currency
                }
                profit {
                  amount
                  currency
                }
                margin
              }
            }
          }
        }
      `;

      const data = await client.query(query, { startDate: args.startDate, endDate: args.endDate });
      return { jobProfitReport: data.reports.jobProfit };
    },
  },

  get_team_utilization_report: {
    description: 'Get team utilization report for a date range',
    inputSchema: z.object({
      startDate: z.string().describe('ISO 8601 date'),
      endDate: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetTeamUtilizationReport($startDate: String!, $endDate: String!) {
          reports {
            teamUtilization(startDate: $startDate, endDate: $endDate) {
              totalHours
              billableHours
              nonBillableHours
              utilizationRate
              userBreakdown {
                userId
                firstName
                lastName
                totalHours
                billableHours
                nonBillableHours
                utilizationRate
              }
            }
          }
        }
      `;

      const data = await client.query(query, { startDate: args.startDate, endDate: args.endDate });
      return { utilizationReport: data.reports.teamUtilization };
    },
  },

  get_job_report: {
    description: 'Get a comprehensive job report including counts by status for a date range',
    inputSchema: z.object({
      startDate: z.string().describe('ISO 8601 date (start of range)'),
      endDate: z.string().describe('ISO 8601 date (end of range)'),
    }),
    execute: async (client: JobberClient, args: any) => {
      // Fetch jobs summary within the date range
      const query = `
        query GetJobReport($startDate: ISO8601Date!, $endDate: ISO8601Date!) {
          jobs(filter: { createdAt: { gte: $startDate, lte: $endDate } }, first: 1) {
            totalCount
          }
          activeJobs: jobs(filter: { status: ACTIVE, createdAt: { gte: $startDate, lte: $endDate } }, first: 1) {
            totalCount
          }
          completedJobs: jobs(filter: { status: COMPLETED, createdAt: { gte: $startDate, lte: $endDate } }, first: 1) {
            totalCount
          }
          cancelledJobs: jobs(filter: { status: CANCELLED, createdAt: { gte: $startDate, lte: $endDate } }, first: 1) {
            totalCount
          }
        }
      `;

      const data = await client.query(query, { startDate: args.startDate, endDate: args.endDate });
      return {
        jobReport: {
          startDate: args.startDate,
          endDate: args.endDate,
          totalJobs: data.jobs?.totalCount ?? 0,
          activeJobs: data.activeJobs?.totalCount ?? 0,
          completedJobs: data.completedJobs?.totalCount ?? 0,
          cancelledJobs: data.cancelledJobs?.totalCount ?? 0,
        },
      };
    },
  },

  get_client_report: {
    description: 'Get a client report showing new clients, active clients, and revenue by client for a date range',
    inputSchema: z.object({
      startDate: z.string().describe('ISO 8601 date (start of range)'),
      endDate: z.string().describe('ISO 8601 date (end of range)'),
      limit: z.number().default(50).describe('Max number of clients to include'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetClientReport($first: Int!) {
          clients(first: $first) {
            totalCount
            edges {
              node {
                id
                firstName
                lastName
                companyName
                createdAt
                isArchived
                jobs {
                  totalCount
                }
                invoices {
                  totalCount
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const data = await client.query(query, { first: args.limit });
      const clients = data.clients.edges.map((e: any) => e.node);
      
      // Filter clients created within date range
      const start = new Date(args.startDate);
      const end = new Date(args.endDate);
      const newClients = clients.filter((c: any) => {
        const created = new Date(c.createdAt);
        return created >= start && created <= end;
      });

      return {
        clientReport: {
          startDate: args.startDate,
          endDate: args.endDate,
          totalClients: data.clients.totalCount,
          newClientsInRange: newClients.length,
          clients: clients.slice(0, args.limit),
        },
      };
    },
  },
};
