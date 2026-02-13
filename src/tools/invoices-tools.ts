/**
 * Invoices Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const invoicesTools = {
  list_invoices: {
    description: 'List all invoices with optional filtering',
    inputSchema: z.object({
      status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'BAD_DEBT']).optional(),
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
        query ListInvoices {
          invoices(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                ${JobberClient.invoiceFields}
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
        invoices: data.invoices.edges.map((e: any) => e.node),
        pageInfo: data.invoices.pageInfo,
        totalCount: data.invoices.totalCount,
      };
    },
  },

  get_invoice: {
    description: 'Get a specific invoice by ID',
    inputSchema: z.object({
      invoiceId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetInvoice($id: ID!) {
          invoice(id: $id) {
            ${JobberClient.invoiceFields}
          }
        }
      `;

      const data = await client.query(query, { id: args.invoiceId });
      return { invoice: data.invoice };
    },
  },

  create_invoice: {
    description: 'Create a new invoice',
    inputSchema: z.object({
      subject: z.string(),
      clientId: z.string(),
      jobId: z.string().optional(),
      dueDate: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateInvoice($input: InvoiceInput!) {
          invoiceCreate(input: $input) {
            invoice {
              ${JobberClient.invoiceFields}
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        subject: args.subject,
        clientId: args.clientId,
        jobId: args.jobId,
        dueDate: args.dueDate,
      };

      const data = await client.mutate(mutation, { input });

      if (data.invoiceCreate.userErrors?.length > 0) {
        throw new Error(`Invoice creation failed: ${data.invoiceCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { invoice: data.invoiceCreate.invoice };
    },
  },

  send_invoice: {
    description: 'Send an invoice to the client',
    inputSchema: z.object({
      invoiceId: z.string(),
      message: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation SendInvoice($id: ID!, $message: String) {
          invoiceSend(id: $id, message: $message) {
            invoice {
              ${JobberClient.invoiceFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.invoiceId, message: args.message });

      if (data.invoiceSend.userErrors?.length > 0) {
        throw new Error(`Invoice send failed: ${data.invoiceSend.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { invoice: data.invoiceSend.invoice };
    },
  },

  mark_invoice_paid: {
    description: 'Mark an invoice as fully paid',
    inputSchema: z.object({
      invoiceId: z.string(),
      amount: z.number(),
      paymentMethod: z.string().default('OTHER'),
      paidOn: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation MarkInvoicePaid($id: ID!, $input: PaymentInput!) {
          paymentCreate(invoiceId: $id, input: $input) {
            payment {
              id
              amount {
                amount
                currency
              }
              paidOn
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        amount: args.amount,
        paymentMethod: args.paymentMethod,
        paidOn: args.paidOn,
      };

      const data = await client.mutate(mutation, { id: args.invoiceId, input });

      if (data.paymentCreate.userErrors?.length > 0) {
        throw new Error(`Payment failed: ${data.paymentCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { payment: data.paymentCreate.payment };
    },
  },

  list_invoice_payments: {
    description: 'List all payments for a specific invoice',
    inputSchema: z.object({
      invoiceId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetInvoicePayments($id: ID!) {
          invoice(id: $id) {
            payments {
              id
              amount {
                amount
                currency
              }
              paymentMethod
              paidOn
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.invoiceId });
      return { payments: data.invoice.payments };
    },
  },

  create_payment: {
    description: 'Create a payment for an invoice',
    inputSchema: z.object({
      invoiceId: z.string(),
      amount: z.number(),
      paymentMethod: z.string().default('OTHER'),
      paidOn: z.string().describe('ISO 8601 date'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreatePayment($invoiceId: ID!, $input: PaymentInput!) {
          paymentCreate(invoiceId: $invoiceId, input: $input) {
            payment {
              id
              amount {
                amount
                currency
              }
              paymentMethod
              paidOn
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        amount: args.amount,
        paymentMethod: args.paymentMethod,
        paidOn: args.paidOn,
      };

      const data = await client.mutate(mutation, { invoiceId: args.invoiceId, input });

      if (data.paymentCreate.userErrors?.length > 0) {
        throw new Error(`Payment creation failed: ${data.paymentCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { payment: data.paymentCreate.payment };
    },
  },
};
