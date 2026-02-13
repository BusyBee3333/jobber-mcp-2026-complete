/**
 * Products/Services Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export const productsTools = {
  list_products: {
    description: 'List all products and services',
    inputSchema: z.object({
      type: z.enum(['PRODUCT', 'SERVICE']).optional(),
      isArchived: z.boolean().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterConditions: string[] = [];
      if (args.type) {
        filterConditions.push(`type: ${args.type}`);
      }
      if (args.isArchived !== undefined) {
        filterConditions.push(`isArchived: ${args.isArchived}`);
      }

      const filters = filterConditions.length > 0 ? `, filter: { ${filterConditions.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListProducts {
          products(first: ${args.limit}${afterClause}${filters}) {
            edges {
              node {
                id
                name
                description
                unitPrice {
                  amount
                  currency
                }
                type
                isArchived
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
        products: data.products.edges.map((e: any) => e.node),
        pageInfo: data.products.pageInfo,
        totalCount: data.products.totalCount,
      };
    },
  },

  get_product: {
    description: 'Get a specific product or service by ID',
    inputSchema: z.object({
      productId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            id
            name
            description
            unitPrice {
              amount
              currency
            }
            type
            isArchived
          }
        }
      `;

      const data = await client.query(query, { id: args.productId });
      return { product: data.product };
    },
  },

  create_product: {
    description: 'Create a new product or service',
    inputSchema: z.object({
      name: z.string(),
      description: z.string().optional(),
      unitPrice: z.number().optional(),
      type: z.enum(['PRODUCT', 'SERVICE']).default('SERVICE'),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateProduct($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              name
              description
              unitPrice {
                amount
                currency
              }
              type
              isArchived
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input = {
        name: args.name,
        description: args.description,
        unitPrice: args.unitPrice,
        type: args.type,
      };

      const data = await client.mutate(mutation, { input });

      if (data.productCreate.userErrors?.length > 0) {
        throw new Error(`Product creation failed: ${data.productCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { product: data.productCreate.product };
    },
  },

  update_product: {
    description: 'Update an existing product or service',
    inputSchema: z.object({
      productId: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      unitPrice: z.number().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
          productUpdate(id: $id, input: $input) {
            product {
              id
              name
              description
              unitPrice {
                amount
                currency
              }
              type
              isArchived
            }
            userErrors {
              message
              path
            }
          }
        }
      `;

      const input: any = {};
      if (args.name) input.name = args.name;
      if (args.description) input.description = args.description;
      if (args.unitPrice) input.unitPrice = args.unitPrice;

      const data = await client.mutate(mutation, { id: args.productId, input });

      if (data.productUpdate.userErrors?.length > 0) {
        throw new Error(`Product update failed: ${data.productUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { product: data.productUpdate.product };
    },
  },

  delete_product: {
    description: 'Delete (archive) a product or service',
    inputSchema: z.object({
      productId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteProduct($id: ID!) {
          productArchive(id: $id) {
            product {
              id
              name
              isArchived
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.productId });

      if (data.productArchive.userErrors?.length > 0) {
        throw new Error(`Product deletion failed: ${data.productArchive.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { product: data.productArchive.product };
    },
  },
};
