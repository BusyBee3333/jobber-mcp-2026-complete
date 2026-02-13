/**
 * Forms Tools for Jobber MCP Server
 */

import { z } from 'zod';
import { JobberClient } from '../clients/jobber.js';

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'signature';
  required: boolean;
  options?: string[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  jobId?: string;
  visitId?: string;
  submittedBy: string;
  submittedAt: string;
  data: Record<string, any>;
}

export const formsTools = {
  list_forms: {
    description: 'List all custom forms',
    inputSchema: z.object({
      isActive: z.boolean().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filterClause = args.isActive !== undefined ? `, filter: { isActive: ${args.isActive} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListForms {
          forms(first: ${args.limit}${afterClause}${filterClause}) {
            edges {
              node {
                id
                name
                description
                isActive
                createdAt
                updatedAt
                fields {
                  id
                  label
                  type
                  required
                  options
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
        forms: data.forms.edges.map((e: any) => e.node),
        pageInfo: data.forms.pageInfo,
      };
    },
  },

  get_form: {
    description: 'Get a specific form by ID',
    inputSchema: z.object({
      formId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetForm($id: ID!) {
          form(id: $id) {
            id
            name
            description
            isActive
            createdAt
            updatedAt
            fields {
              id
              label
              type
              required
              options
            }
          }
        }
      `;

      const data = await client.query(query, { id: args.formId });
      return { form: data.form };
    },
  },

  create_form: {
    description: 'Create a new custom form',
    inputSchema: z.object({
      name: z.string(),
      description: z.string().optional(),
      fields: z.array(z.object({
        label: z.string(),
        type: z.enum(['text', 'textarea', 'number', 'date', 'checkbox', 'select', 'signature']),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
      })),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation CreateForm($input: FormInput!) {
          formCreate(input: $input) {
            form {
              id
              name
              description
              isActive
              fields {
                id
                label
                type
                required
                options
              }
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        name: args.name,
        description: args.description,
        fields: args.fields,
      };

      const data = await client.mutate(mutation, { input });

      if (data.formCreate.userErrors?.length > 0) {
        throw new Error(`Form creation failed: ${data.formCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { form: data.formCreate.form };
    },
  },

  update_form: {
    description: 'Update an existing form',
    inputSchema: z.object({
      formId: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation UpdateForm($id: ID!, $input: FormUpdateInput!) {
          formUpdate(id: $id, input: $input) {
            form {
              id
              name
              description
              isActive
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
      if (args.isActive !== undefined) input.isActive = args.isActive;

      const data = await client.mutate(mutation, { id: args.formId, input });

      if (data.formUpdate.userErrors?.length > 0) {
        throw new Error(`Form update failed: ${data.formUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { form: data.formUpdate.form };
    },
  },

  delete_form: {
    description: 'Delete a form',
    inputSchema: z.object({
      formId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation DeleteForm($id: ID!) {
          formDelete(id: $id) {
            deletedFormId
            userErrors {
              message
            }
          }
        }
      `;

      const data = await client.mutate(mutation, { id: args.formId });

      if (data.formDelete.userErrors?.length > 0) {
        throw new Error(`Form deletion failed: ${data.formDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { deletedFormId: data.formDelete.deletedFormId };
    },
  },

  submit_form: {
    description: 'Submit a form with data',
    inputSchema: z.object({
      formId: z.string(),
      jobId: z.string().optional(),
      visitId: z.string().optional(),
      data: z.record(z.any()),
    }),
    execute: async (client: JobberClient, args: any) => {
      const mutation = `
        mutation SubmitForm($input: FormSubmissionInput!) {
          formSubmissionCreate(input: $input) {
            formSubmission {
              id
              formId
              submittedAt
              data
            }
            userErrors {
              message
            }
          }
        }
      `;

      const input = {
        formId: args.formId,
        jobId: args.jobId,
        visitId: args.visitId,
        data: args.data,
      };

      const data = await client.mutate(mutation, { input });

      if (data.formSubmissionCreate.userErrors?.length > 0) {
        throw new Error(`Form submission failed: ${data.formSubmissionCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return { formSubmission: data.formSubmissionCreate.formSubmission };
    },
  },

  list_form_submissions: {
    description: 'List submissions for a form',
    inputSchema: z.object({
      formId: z.string().optional(),
      jobId: z.string().optional(),
      visitId: z.string().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const filters: string[] = [];
      if (args.formId) filters.push(`formId: "${args.formId}"`);
      if (args.jobId) filters.push(`jobId: "${args.jobId}"`);
      if (args.visitId) filters.push(`visitId: "${args.visitId}"`);

      const filterClause = filters.length > 0 ? `, filter: { ${filters.join(', ')} }` : '';
      const afterClause = args.cursor ? `, after: "${args.cursor}"` : '';

      const query = `
        query ListFormSubmissions {
          formSubmissions(first: ${args.limit}${afterClause}${filterClause}) {
            edges {
              node {
                id
                formId
                jobId
                visitId
                submittedAt
                data
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
        submissions: data.formSubmissions.edges.map((e: any) => e.node),
        pageInfo: data.formSubmissions.pageInfo,
      };
    },
  },

  get_form_submission: {
    description: 'Get a specific form submission',
    inputSchema: z.object({
      submissionId: z.string(),
    }),
    execute: async (client: JobberClient, args: any) => {
      const query = `
        query GetFormSubmission($id: ID!) {
          formSubmission(id: $id) {
            id
            formId
            jobId
            visitId
            submittedAt
            data
          }
        }
      `;

      const data = await client.query(query, { id: args.submissionId });
      return { submission: data.formSubmission };
    },
  },
};
