/**
 * Taxes Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export interface Tax {
  id: string;
  name: string;
  rate: number;
  isActive: boolean;
  isCompound: boolean;
}

export const taxesTools = {
  list_taxes: {
    description: 'List all tax rates',
    inputSchema: z.object({
      isActive: z.boolean().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterClause = args.isActive !== undefined ? `, filter: { isActive: ${args.isActive} }` : '';

      const query = `
        query ListTaxes {
          taxes(first: 100${filterClause}) {
            edges {
              node {
                id
                name
                rate
                isActive
                isCompound
              }
            }
          }
        }
      `;

      const data = await client.query(query);
      return { taxes: data.taxes.edges.map((e: any) => e.node) };
    },
  },

  get_tax: {
    description: 'Get a specific tax rate by ID',
    inputSchema: z.object({
      taxId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetTax($id: ID!) {
          tax(id: $id) {
            id
            name
            rate
            isActive
            isCompound
          }
        }
      `;

      const data = await client.query(query, { id: args.taxId });
      return { tax: data.tax };
    },
  },

  create_tax: {
    description: 'Create a new tax rate',
    inputSchema: z.object({
      name: z.string(),
      rate: z.number().describe('Tax rate as decimal (e.g., 0.13 for 13%)'),
      isCompound: z.boolean().default(false),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateTax($input: TaxInput!) {
          taxCreate(input: $input) {
            tax {
              id
              name
              rate
              isActive
              isCompound
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        name: args.name,
        rate: args.rate,
        isCompound: args.isCompound,
      };

      const data = await client.mutate(mutation, { input });

      if (data.taxCreate.userErrors?.length > 0) {
        throw new Error(`Tax creation failed: ${data.taxCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { tax: data.taxCreate.tax };
    },
  },

  update_tax: {
    description: 'Update an existing tax rate',
    inputSchema: z.object({
      taxId: z.string(),
      name: z.string().optional(),
      rate: z.number().optional(),
      isActive: z.boolean().optional(),
      isCompound: z.boolean().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateTax($id: ID!, $input: TaxUpdateInput!) {
          taxUpdate(id: $id, input: $input) {
            tax {
              id
              name
              rate
              isActive
              isCompound
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input: any = {};
      if (args.name) input.name = args.name;
      if (args.rate !== undefined) input.rate = args.rate;
      if (args.isActive !== undefined) input.isActive = args.isActive;
      if (args.isCompound !== undefined) input.isCompound = args.isCompound;

      const data = await client.mutate(mutation, { id: args.taxId, input });

      if (data.taxUpdate.userErrors?.length > 0) {
        throw new Error(`Tax update failed: ${data.taxUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { tax: data.taxUpdate.tax };
    },
  },

  delete_tax: {
    description: 'Delete a tax rate',
    inputSchema: z.object({
      taxId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteTax($id: ID!) {
          taxDelete(id: $id) {
            deletedTaxId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.taxId });

      if (data.taxDelete.userErrors?.length > 0) {
        throw new Error(`Tax deletion failed: ${data.taxDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedTaxId: data.taxDelete.deletedTaxId };
    },
  },

  apply_tax_to_line_item: {
    description: 'Apply a tax to a line item',
    inputSchema: z.object({
      lineItemId: z.string(),
      taxId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation ApplyTaxToLineItem($lineItemId: ID!, $taxId: ID!) {
          lineItemTaxApply(lineItemId: $lineItemId, taxId: $taxId) {
            lineItem {
              id
              taxes {
                id
                name
                rate
              }
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, {
        lineItemId: args.lineItemId,
        taxId: args.taxId,
      });

      if (data.lineItemTaxApply.userErrors?.length > 0) {
        throw new Error(`Tax application failed: ${data.lineItemTaxApply.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemTaxApply.lineItem };
    },
  },

  remove_tax_from_line_item: {
    description: 'Remove a tax from a line item',
    inputSchema: z.object({
      lineItemId: z.string(),
      taxId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation RemoveTaxFromLineItem($lineItemId: ID!, $taxId: ID!) {
          lineItemTaxRemove(lineItemId: $lineItemId, taxId: $taxId) {
            lineItem {
              id
              taxes {
                id
                name
                rate
              }
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, {
        lineItemId: args.lineItemId,
        taxId: args.taxId,
      });

      if (data.lineItemTaxRemove.userErrors?.length > 0) {
        throw new Error(`Tax removal failed: ${data.lineItemTaxRemove.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { lineItem: data.lineItemTaxRemove.lineItem };
    },
  },

  calculate_tax_total: {
    description: 'Calculate total tax amount for an invoice or quote',
    inputSchema: z.object({
      parentId: z.string().describe('Invoice or Quote ID'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query CalculateTaxTotal($id: ID!) {
          invoiceOrQuote(id: $id) {
            lineItems {
              total {
                amount
                currency
              }
              taxes {
                id
                name
                rate
              }
            }
            taxTotal {
              amount
              currency
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.parentId });
      return {
        taxTotal: data.invoiceOrQuote.taxTotal,
        breakdown: data.invoiceOrQuote.lineItems.map((item: any) => ({
          lineItemTotal: item.total,
          taxes: item.taxes,
        })),
      };
    },
  },
};
