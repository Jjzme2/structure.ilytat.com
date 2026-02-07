import { describe, it, expect } from 'vitest'
import { TaskSchema, BriefingSchema, UserProfileSchema } from '../client/utils/schemas'

describe('Zod Schemas', () => {
    it('validates a valid Task', () => {
        const validTask = {
            id: '123',
            title: 'Test Task',
            status: 'backlog',
            userId: 'user123',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        const result = TaskSchema.safeParse(validTask)
        expect(result.success).toBe(true)
    })

    it('rejects an invalid Task (missing title)', () => {
        const invalidTask = {
            status: 'backlog',
            userId: 'user123',
            createdAt: new Date()
        }
        const result = TaskSchema.safeParse(invalidTask)
        expect(result.success).toBe(false)
    })

    it('validates a Briefing', () => {
        const briefing = {
            title: 'Test Briefing',
            date: new Date().toISOString(),
            tldr: 'Summary',
            confidenceScore: 99,
            content: '# Markdown',
            source: 'AI',
            tags: ['test'],
            tenantId: 'ilytat',
            createdAt: new Date()
        }
        const result = BriefingSchema.safeParse(briefing)
        expect(result.success).toBe(true)
    })

    it('validates User Profile email format', () => {
        const user = {
            uid: '123',
            email: 'not-an-email',
            createdAt: new Date()
        }
        const result = UserProfileSchema.safeParse(user)
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Invalid email')
        }
    })
})
