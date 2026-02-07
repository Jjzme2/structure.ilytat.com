export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date | any; // Firestore Timestamp
    updatedAt: Date | any;
    userId: string;
}

export type TaskStatus = 'backlog' | 'focus' | 'doing' | 'done' | 'archived'
export type TaskCategory = string // Relaxed to allow admin-defined categories

export interface Task {
    id: string
    title: string
    description?: string | null

    // Kanban status
    status: TaskStatus

    // Daily 6 Focus
    focusDate?: string | null      // ISO date when added to focus (e.g., "2026-02-05")
    focusOrder?: number | null     // Order within daily focus (1-6)
    rank?: number // Global rank for ordering in other columns (Backlog, Doing, Done)

    // Growth tracking
    category?: TaskCategory | null

    // Time tracking
    createdAt: Date | any
    updatedAt?: Date | any
    dueDate?: string | null
    completedAt?: Date | any | null

    // Strategic Linkage
    okrId?: string | null
    krId?: string | null

    // User
    userId: string
}

export interface ImportantDate {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO string for easy handling
    type: string; // Relaxed to allow custom user types
    userId: string;
    isPublic?: boolean;
}

export interface Quote {
    id: string;
    text: string;
    author: string;
    userId: string;
    source?: string | null;
    tags?: string[];
    notes?: string | null;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role?: 'admin' | 'member'; // Deprecated in favor of roles array, but kept for backward compatibility
    roles?: ('admin' | 'member' | 'viewer')[];
    tenantId?: string; // 'ilytat' or other company IDs
    createdAt: Date | any;
}

export interface Tenant {
    id: string;
    name: string;
    domain?: string;
    createdAt: Date | any;
    settings?: Record<string, any>;
}

// Supply Room Models
export interface Subscription {
    id: string
    name: string
    cost: number
    frequency: 'monthly' | 'yearly'
    renewalDate: string // ISO date
    category?: string
    userId: string
}

export interface Asset {
    id: string
    name: string
    type: 'domain' | 'nfc' | 'hardware' | 'other'
    status: 'active' | 'inactive' | 'expired'
    details?: string
    userId: string
}

// War Room Models
export interface OKR {
    id: string
    objective: string
    keyResults: KeyResult[]
    quarter: number
    year: number
    status: 'planned' | 'active' | 'completed' | 'at-risk'
    userId: string
}

export interface KeyResult {
    id: string
    description: string
    current: number
    target: number
    unit: string
    status: 'pending' | 'in-progress' | 'done'
}

// Ledger Models
export interface Transaction {
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
    category: string
    date: string // ISO date
    userId: string
}

// Audit & Activity Logs
export interface ActivityItem {
    id: string
    action: string    // Human readable action e.g., "Created Task"
    module: string    // System module e.g., "tasks", "finance"
    userId: string
    timestamp: Date | any // Firestore Timestamp
    metadata?: Record<string, any> // Flexible payload for details
}

// Intelligence Briefings
export interface Briefing {
    id: string
    title: string
    date: string // ISO date
    tldr: string
    confidenceScore: number // 0-100
    content: string // Markdown
    source: string // e.g. "Legal AI", "Strategy AI"
    tags: string[]
    tenantId?: string // details if company vs personal, though usually company
    userId?: string
    createdAt: Date | any
}

// Inbox & Messaging
export interface InboxItem {
    id: string
    subject: string
    body: string
    from: string          // "System", "Finance", or User Name
    to: string            // User ID
    timestamp: Date | any // Firestore Timestamp
    read: boolean
    archived: boolean
    type: 'system' | 'message' | 'alert'
    link?: string         // URL to jump to (e.g. /tasks/123)
    priority?: 'low' | 'normal' | 'high'
}

// Command Center
export interface CommandItem {
    id: string
    label: string
    icon: string
    action: () => void
    keywords: string[]
    section: 'Navigation' | 'Actions' | 'Tasks' | 'Search' | 'Quick Links' | 'Apps' | 'System' | 'Themes'
    shortcut?: string[]
    external?: boolean
}

// Task Groups (Templates)
export interface TaskGroup {
    id: string
    name: string
    description: string
    tasks: any[] // structured templates
    updatedAt: Date | any
    createdBy: string
}

