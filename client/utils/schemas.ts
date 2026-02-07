import { z } from 'zod'

// --- Core Shared Types ---

// Firestore Timestamp or Date schema
const DateOrTimestamp = z.union([
    z.date(),
    z.object({ seconds: z.number(), nanoseconds: z.number() }),
    z.string() // For serialized dates
]).nullable().optional()

// --- Collection Schemas ---

// 1. Tasks
export const TaskSchema = z.object({
    id: z.string().optional(), // Optional for creation
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    status: z.enum(['backlog', 'focus', 'doing', 'done', 'archived']),
    displayOrder: z.number().optional(),

    // Daily Focus
    focusDate: z.string().nullable().optional(), // ISO string YYYY-MM-DD
    focusOrder: z.number().nullable().optional(),

    // Growth / Categories
    category: z.string().nullable().optional(),

    // Metadata
    userId: z.string(),
    createdAt: DateOrTimestamp,
    updatedAt: DateOrTimestamp,
    dueDate: z.string().nullable().optional(), // ISO string
    completedAt: DateOrTimestamp,

    // Strategy Links
    okrId: z.string().nullable().optional(),
    krId: z.string().nullable().optional(),
})

// 2. Notes
export const NoteSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    content: z.string(), // HTML or Markdown
    userId: z.string(),
    createdAt: DateOrTimestamp,
    updatedAt: DateOrTimestamp,
})

// 3. Finance (Transactions)
export const TransactionSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    amount: z.number(),
    type: z.enum(['income', 'expense']),
    category: z.string(),
    date: z.string(), // ISO Date
    userId: z.string(),
    tenantId: z.string().optional(), // For company transactions
})

// 4. Strategy (OKRs)
export const KeyResultSchema = z.object({
    id: z.string(),
    description: z.string().min(1),
    current: z.number(),
    target: z.number(),
    unit: z.string(), // e.g., '%', 'USD', 'Users'
    status: z.enum(['pending', 'in-progress', 'done'])
})

export const OKRSchema = z.object({
    id: z.string().optional(),
    objective: z.string().min(1, 'Objective is required'),
    keyResults: z.array(KeyResultSchema),
    quarter: z.number().min(1).max(4),
    year: z.number(), // e.g., 2026
    status: z.enum(['planned', 'active', 'completed', 'at-risk']),
    userId: z.string(),
    tenantId: z.string().optional(),
})

// 5. Assets (Inventory)
export const AssetSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['domain', 'nfc', 'hardware', 'other']),
    status: z.enum(['active', 'inactive', 'expired']),
    details: z.string().optional(),
    userId: z.string(),
    tenantId: z.string().optional()
})

// 6. Subscriptions
export const SubscriptionSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    cost: z.number().min(0),
    frequency: z.enum(['monthly', 'yearly']),
    renewalDate: z.string(), // ISO Date
    category: z.string().optional(),
    userId: z.string(),
    tenantId: z.string().optional()
})

// 7. Intelligence Briefings
export const BriefingSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    date: z.string(),
    tldr: z.string(),
    confidenceScore: z.number().min(0).max(100),
    content: z.string(),
    source: z.string(),
    tags: z.array(z.string()),
    tenantId: z.string(),
    userId: z.string().optional(),
    createdAt: DateOrTimestamp
})

// 8. Task Groups (Templates)
export const TaskGroupSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    tasks: z.array(z.any()), // Refine this later to be a template schema
    updatedAt: DateOrTimestamp,
    createdBy: z.string()
})

// 9. User Profile
export const UserProfileSchema = z.object({
    uid: z.string(),
    email: z.string().email(),
    displayName: z.string().nullable().optional(),
    photoURL: z.string().nullable().optional(),
    roles: z.array(z.enum(['admin', 'member', 'viewer'])).optional(),
    tenantId: z.string().optional(),
    createdAt: DateOrTimestamp
})

// Export Types inferred from Schemas
export type TaskModel = z.infer<typeof TaskSchema>
export type NoteModel = z.infer<typeof NoteSchema>
export type TransactionModel = z.infer<typeof TransactionSchema>
export type OKRModel = z.infer<typeof OKRSchema>
export type BriefingModel = z.infer<typeof BriefingSchema>
export type AssetModel = z.infer<typeof AssetSchema>
export type SubscriptionModel = z.infer<typeof SubscriptionSchema>
export type TaskGroupModel = z.infer<typeof TaskGroupSchema>
export type UserProfileModel = z.infer<typeof UserProfileSchema>
