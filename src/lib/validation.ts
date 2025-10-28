import { z } from 'zod'
import { ValidationError } from './api-errors'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')

export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
).optional()

export const urlSchema = z.string().url('Invalid URL format').optional()

export const uuidSchema = z.string().uuid('Invalid ID format')

export const dateSchema = z.coerce.date()

export const positiveNumberSchema = z.number().positive('Must be a positive number')

export const percentageSchema = z.number().min(0).max(100, 'Must be between 0 and 100')

// Client validation schemas
export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(255).optional(),
  website: urlSchema,
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  taxId: z.string().max(50).optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  preferredContact: z.enum(['email', 'phone', 'teams']).optional(),
  timezone: z.string().optional(),
  industry: z.string().max(100).optional(),
  companySize: z.enum(['solo', 'small', 'medium', 'enterprise']).optional(),
  source: z.string().max(100).optional(),
  referredBy: z.string().max(255).optional(),
  tags: z.array(z.string()).optional(),
})

export const updateClientSchema = createClientSchema.partial()

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['web-app', 'saas', 'website', 'web-tool', 'custom', 'ecommerce']),
  status: z.enum(['planning', 'in-progress', 'review', 'completed', 'on-hold', 'cancelled']).default('planning'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  clientId: uuidSchema.optional(),
  budget: positiveNumberSchema.optional(),
  actualCost: positiveNumberSchema.optional(),
  revenue: positiveNumberSchema.optional(),
  currency: z.string().length(3).default('GHS'),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  deadline: dateSchema.optional(),
  estimatedHours: positiveNumberSchema.optional(),
  techStack: z.array(z.string()).optional(),
  githubRepo: urlSchema,
  liveUrl: urlSchema,
  stagingUrl: urlSchema,
  hosting: z.string().max(100).optional(),
  domain: z.string().max(255).optional(),
  progress: percentageSchema.default(0),
  notes: z.string().optional(),
  requirements: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

// Quote validation schemas
export const createQuoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  clientId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
  projectType: z.string().max(100).optional(),
  estimatedHours: positiveNumberSchema.optional(),
  timeline: z.string().max(100).optional(),
  techStack: z.array(z.string()).optional(),
  setupFee: positiveNumberSchema.default(0),
  developmentCost: positiveNumberSchema.default(0),
  designCost: positiveNumberSchema.default(0),
  monthlyHosting: positiveNumberSchema.default(0),
  monthlyMaintenance: positiveNumberSchema.default(0),
  subtotal: positiveNumberSchema,
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: positiveNumberSchema,
  status: z.enum(['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired']).default('draft'),
  validUntil: dateSchema.optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
})

export const updateQuoteSchema = createQuoteSchema.partial()

// Invoice validation schemas
export const createInvoiceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  clientId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
  subtotal: positiveNumberSchema,
  tax: z.number().min(0).default(0),
  taxRate: percentageSchema.default(0),
  discount: z.number().min(0).default(0),
  discountType: z.enum(['amount', 'percentage']).default('amount'),
  total: positiveNumberSchema,
  currency: z.string().length(3).default('GHS'),
  items: z.array(z.object({
    description: z.string(),
    quantity: positiveNumberSchema,
    rate: positiveNumberSchema,
    amount: positiveNumberSchema,
  })),
  status: z.enum(['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'refunded']).default('draft'),
  dueDate: dateSchema.optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPeriod: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
})

export const updateInvoiceSchema = createInvoiceSchema.partial()

// Team Member validation schemas
export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(['developer', 'designer', 'project-manager', 'qa', 'devops']),
  title: z.string().max(100).optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: positiveNumberSchema.optional(),
  availability: z.enum(['available', 'busy', 'unavailable']).default('available'),
  bio: z.string().optional(),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()

// Time Entry validation schemas
export const createTimeEntrySchema = z.object({
  description: z.string().min(1, 'Description is required'),
  hours: positiveNumberSchema,
  date: dateSchema.default(() => new Date()),
  billable: z.boolean().default(true),
  hourlyRate: positiveNumberSchema.optional(),
  projectId: uuidSchema.optional(),
  taskId: uuidSchema.optional(),
  memberId: uuidSchema.optional(),
})

export const updateTimeEntrySchema = createTimeEntrySchema.partial()

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'completed', 'blocked']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  estimatedHours: positiveNumberSchema.optional(),
  startDate: dateSchema.optional(),
  dueDate: dateSchema.optional(),
  assignedTo: z.string().max(255).optional(),
  projectId: uuidSchema.optional(),
  tags: z.array(z.string()).optional(),
  checklist: z.array(z.object({
    text: z.string(),
    completed: z.boolean().default(false),
  })).optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

// Document validation schemas
export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['contract', 'proposal', 'design', 'requirement', 'other']),
  fileUrl: z.string().url('Invalid file URL'),
  fileSize: positiveNumberSchema.optional(),
  mimeType: z.string().max(100).optional(),
  isPublic: z.boolean().default(false),
  clientId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
})

export const updateDocumentSchema = createDocumentSchema.partial()

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Search/Filter schema
export const searchSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
})

// Validation helper function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      throw new ValidationError('Validation failed', errors)
    }
    throw error
  }
}

// Validate request body
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return validate(schema, body)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid JSON in request body')
    }
    throw error
  }
}

// Validate query parameters
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries())
  return validate(schema, params)
}
