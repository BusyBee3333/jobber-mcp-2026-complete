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
};
