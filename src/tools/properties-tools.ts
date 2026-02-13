/**
 * Properties Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';
import type { Property } from '../types/jobber.js';

export const propertiesTools = {
  list_properties: {
    description: 'List all properties with optional filtering',
    inputSchema: z.object({
      clientId: z.string().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterClause = args.clientId ? `, filter: { clientId: "${args.clientId}" }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListProperties {
          properties(first: ${args.limit}${afterClause}${filterClause}) {
            edges {
              node {
                id
                isDefault
                address {
                  street1
                  street2
                  city
                  province
                  postalCode
                  country
                }
                client {
                  id
                  firstName
                  lastName
                  companyName
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
        properties: data.properties.edges.map((e: any) => e.node),
        pageInfo: data.properties.pageInfo,
      };
    },
  },

  get_property: {
    description: 'Get a specific property by ID',
    inputSchema: z.object({
      propertyId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetProperty($id: ID!) {
          property(id: $id) {
            id
            isDefault
            address {
              street1
              street2
              city
              province
              postalCode
              country
            }
            client {
              id
              firstName
              lastName
              companyName
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.propertyId });
      return { property: data.property };
    },
  },

  create_property: {
    description: 'Create a new property for a client',
    inputSchema: z.object({
      clientId: z.string(),
      street1: z.string(),
      street2: z.string().optional(),
      city: z.string(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      isDefault: z.boolean().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateProperty($input: PropertyInput!) {
          propertyCreate(input: $input) {
            property {
              id
              isDefault
              address {
                street1
                street2
                city
                province
                postalCode
                country
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
        clientId: args.clientId,
        address: {
          street1: args.street1,
          street2: args.street2,
          city: args.city,
          province: args.province,
          postalCode: args.postalCode,
          country: args.country,
        },
        isDefault: args.isDefault,
      };

      const data = await client.mutate(mutation, { input });

      if (data.propertyCreate.userErrors?.length > 0) {
        throw new Error(`Property creation failed: ${data.propertyCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { property: data.propertyCreate.property };
    },
  },

  update_property: {
    description: 'Update an existing property',
    inputSchema: z.object({
      propertyId: z.string(),
      street1: z.string().optional(),
      street2: z.string().optional(),
      city: z.string().optional(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      isDefault: z.boolean().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateProperty($id: ID!, $input: PropertyUpdateInput!) {
          propertyUpdate(id: $id, input: $input) {
            property {
              id
              isDefault
              address {
                street1
                street2
                city
                province
                postalCode
                country
              }
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input: any = {};
      if (args.street1 || args.street2 || args.city || args.province || args.postalCode || args.country) {
        input.address = {
          street1: args.street1,
          street2: args.street2,
          city: args.city,
          province: args.province,
          postalCode: args.postalCode,
          country: args.country,
        };
      }
      if (args.isDefault !== undefined) {
        input.isDefault = args.isDefault;
      }

      const data = await client.mutate(mutation, { id: args.propertyId, input });

      if (data.propertyUpdate.userErrors?.length > 0) {
        throw new Error(`Property update failed: ${data.propertyUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { property: data.propertyUpdate.property };
    },
  },

  delete_property: {
    description: 'Delete a property',
    inputSchema: z.object({
      propertyId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteProperty($id: ID!) {
          propertyDelete(id: $id) {
            deletedPropertyId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.propertyId });

      if (data.propertyDelete.userErrors?.length > 0) {
        throw new Error(`Property deletion failed: ${data.propertyDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedPropertyId: data.propertyDelete.deletedPropertyId };
    },
  },

  set_default_property: {
    description: 'Set a property as the default for a client',
    inputSchema: z.object({
      propertyId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation SetDefaultProperty($id: ID!) {
          propertyUpdate(id: $id, input: { isDefault: true }) {
            property {
              id
              isDefault
            }
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.propertyId });

      if (data.propertyUpdate.userErrors?.length > 0) {
        throw new Error(`Failed to set default property: ${data.propertyUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { property: data.propertyUpdate.property };
    },
  },
};
