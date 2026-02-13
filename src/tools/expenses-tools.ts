/**
 * Expenses Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const expensesTools = {
  list_expenses: {
    description: 'List all expenses with optional filtering',
    inputSchema: z.object({
      userId: z.string().optional(),
      jobId: z.string().optional(),
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
      if (args.jobId) {
        filterConditions.push(`jobId: "${args.jobId}"`);
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
        query ListExpenses {
          expenses(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                id
                description
                amount {
                  amount
                  currency
                }
                category
                date
                receipt
                user {
                  ${JobberClient.userFields}
                }
                job {
                  id
                  jobNumber
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
        expenses: data.expenses.edges.map((e: any) => e.node),
        pageInfo: data.expenses.pageInfo,
        totalCount: data.expenses.totalCount,
      };
    },
  },

  get_expense: {
    description: 'Get a specific expense by ID',
    inputSchema: z.object({
      expenseId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetExpense($id: ID!) {
          expense(id: $id) {
            id
            description
            amount {
              amount
              currency
            }
            category
            date
            receipt
            user {
              ${JobberClient.userFields}
            }
            job {
              id
              jobNumber
              title
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.expenseId });
      return { expense: data.expense };
    },
  },

  create_expense: {
    description: 'Create a new expense',
    inputSchema: z.object({
      description: z.string(),
      amount: z.number(),
      category: z.string().optional(),
      date: z.string().describe('ISO 8601 date'),
      userId: z.string().optional(),
      jobId: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateExpense($input: ExpenseInput!) {
          expenseCreate(input: $input) {
            expense {
              id
              description
              amount {
                amount
                currency
              }
              category
              date
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        description: args.description,
        amount: args.amount,
        category: args.category,
        date: args.date,
        userId: args.userId,
        jobId: args.jobId,
      };

      const data = await client.mutate(mutation, { input });

      if (data.expenseCreate.userErrors?.length > 0) {
        throw new Error(`Expense creation failed: ${data.expenseCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { expense: data.expenseCreate.expense };
    },
  },

  update_expense: {
    description: 'Update an existing expense',
    inputSchema: z.object({
      expenseId: z.string(),
      description: z.string().optional(),
      amount: z.number().optional(),
      category: z.string().optional(),
      date: z.string().optional().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateExpense($id: ID!, $input: ExpenseUpdateInput!) {
          expenseUpdate(id: $id, input: $input) {
            expense {
              id
              description
              amount {
                amount
                currency
              }
              category
              date
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input: any = {};
      if (args.description) input.description = args.description;
      if (args.amount) input.amount = args.amount;
      if (args.category) input.category = args.category;
      if (args.date) input.date = args.date;

      const data = await client.mutate(mutation, { id: args.expenseId, input });

      if (data.expenseUpdate.userErrors?.length > 0) {
        throw new Error(`Expense update failed: ${data.expenseUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { expense: data.expenseUpdate.expense };
    },
  },

  delete_expense: {
    description: 'Delete an expense',
    inputSchema: z.object({
      expenseId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteExpense($id: ID!) {
          expenseDelete(id: $id) {
            deletedExpenseId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.expenseId });

      if (data.expenseDelete.userErrors?.length > 0) {
        throw new Error(`Expense deletion failed: ${data.expenseDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedExpenseId: data.expenseDelete.deletedExpenseId };
    },
  },
};
