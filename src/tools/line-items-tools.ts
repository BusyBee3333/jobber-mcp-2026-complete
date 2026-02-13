/**
 * Line Items Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';
import type { LineItem } from '../types/jobber.js';

export const lineItemsTools = {
  create_job_line_item: {
    description: 'Add a line item to a job',
    inputSchema: z.object({
      jobId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number(),
      unitPrice: z.number(),
      productId: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateJobLineItem($input: LineItemInput!) {
          lineItemCreate(input: $input) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        jobId: args.jobId,
        name: args.name,
        description: args.description,
        quantity: args.quantity,
        unitPrice: args.unitPrice,
        productId: args.productId,
      };

      const data = await client.mutate(mutation, { input });

      if (data.lineItemCreate.userErrors?.length > 0) {
        throw new Error(`Line item creation failed: ${data.lineItemCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemCreate.lineItem };
    },
  },

  create_quote_line_item: {
    description: 'Add a line item to a quote',
    inputSchema: z.object({
      quoteId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number(),
      unitPrice: z.number(),
      productId: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateQuoteLineItem($input: LineItemInput!) {
          lineItemCreate(input: $input) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        quoteId: args.quoteId,
        name: args.name,
        description: args.description,
        quantity: args.quantity,
        unitPrice: args.unitPrice,
        productId: args.productId,
      };

      const data = await client.mutate(mutation, { input });

      if (data.lineItemCreate.userErrors?.length > 0) {
        throw new Error(`Line item creation failed: ${data.lineItemCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemCreate.lineItem };
    },
  },

  create_invoice_line_item: {
    description: 'Add a line item to an invoice',
    inputSchema: z.object({
      invoiceId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number(),
      unitPrice: z.number(),
      productId: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateInvoiceLineItem($input: LineItemInput!) {
          lineItemCreate(input: $input) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        invoiceId: args.invoiceId,
        name: args.name,
        description: args.description,
        quantity: args.quantity,
        unitPrice: args.unitPrice,
        productId: args.productId,
      };

      const data = await client.mutate(mutation, { input });

      if (data.lineItemCreate.userErrors?.length > 0) {
        throw new Error(`Line item creation failed: ${data.lineItemCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemCreate.lineItem };
    },
  },

  update_line_item: {
    description: 'Update an existing line item',
    inputSchema: z.object({
      lineItemId: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      quantity: z.number().optional(),
      unitPrice: z.number().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateLineItem($id: ID!, $input: LineItemUpdateInput!) {
          lineItemUpdate(id: $id, input: $input) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input: any = {};
      if (args.name) input.name = args.name;
      if (args.description) input.description = args.description;
      if (args.quantity) input.quantity = args.quantity;
      if (args.unitPrice) input.unitPrice = args.unitPrice;

      const data = await client.mutate(mutation, { id: args.lineItemId, input });

      if (data.lineItemUpdate.userErrors?.length > 0) {
        throw new Error(`Line item update failed: ${data.lineItemUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemUpdate.lineItem };
    },
  },

  delete_line_item: {
    description: 'Delete a line item',
    inputSchema: z.object({
      lineItemId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteLineItem($id: ID!) {
          lineItemDelete(id: $id) {
            deletedLineItemId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.lineItemId });

      if (data.lineItemDelete.userErrors?.length > 0) {
        throw new Error(`Line item deletion failed: ${data.lineItemDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedLineItemId: data.lineItemDelete.deletedLineItemId };
    },
  },

  duplicate_line_item: {
    description: 'Duplicate a line item on the same parent (job/quote/invoice)',
    inputSchema: z.object({
      lineItemId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DuplicateLineItem($id: ID!) {
          lineItemDuplicate(id: $id) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.lineItemId });

      if (data.lineItemDuplicate.userErrors?.length > 0) {
        throw new Error(`Line item duplication failed: ${data.lineItemDuplicate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemDuplicate.lineItem };
    },
  },

  reorder_line_items: {
    description: 'Reorder line items within a job, quote, or invoice',
    inputSchema: z.object({
      parentId: z.string().describe('Job, Quote, or Invoice ID'),
      lineItemIds: z.array(z.string()).describe('Ordered array of line item IDs'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ReorderLineItems($parentId: ID!, $lineItemIds: [ID!]!) {
          lineItemsReorder(parentId: $parentId, lineItemIds: $lineItemIds) {
            lineItems {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, {
        parentId: args.parentId,
        lineItemIds: args.lineItemIds,
      });

      if (data.lineItemsReorder.userErrors?.length > 0) {
        throw new Error(`Line items reorder failed: ${data.lineItemsReorder.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItems: data.lineItemsReorder.lineItems };
    },
  },

  bulk_update_line_items: {
    description: 'Update multiple line items at once',
    inputSchema: z.object({
      updates: z.array(z.object({
        lineItemId: z.string(),
        quantity: z.number().optional(),
        unitPrice: z.number().optional(),
      })),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutations = args.updates.map((update: any, index: number) => {
        const input: any = {};
        if (update.quantity) input.quantity = update.quantity;
        if (update.unitPrice) input.unitPrice = update.unitPrice;

        return `
          update${index}: lineItemUpdate(id: "${update.lineItemId}", input: ${JSON.stringify(input).replace(/"([^"]+)":/g, '$1:')}) {
            lineItem {
              ${JobberClient.lineItemFields}
            }
            userErrors {
              message
            }
          }
        `;
      }).join('\n');

      const mutation = `mutation BulkUpdateLineItems { ${mutations} }`;

      const data = await client.mutate(mutation);

      const results = Object.values(data).map((result: any) => {
        if (result.userErrors?.length > 0) {
          throw new Error(`Bulk update failed: ${result.userErrors.map((e: any) => e.message).join(', ')}`);
        }
        return result.lineItem;
      });

      return { lineItems: results };
    },
  },
};
