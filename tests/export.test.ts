import { describe, it, expect } from 'vitest'
import { transformToYAML } from '../client/utils/export'

describe('transformToYAML', () => {
    it('should return an empty string for an empty array', () => {
        const data: any[] = []
        expect(transformToYAML(data)).toBe('')
    })

    it('should transform a single object with primitive values', () => {
        const data = [{
            name: 'John Doe',
            age: 30,
            active: true
        }]
        const expected = '---\nname: John Doe\nage: 30\nactive: true\n'
        expect(transformToYAML(data)).toBe(expected)
    })

    it('should transform multiple objects separated by ---', () => {
        const data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
        ]
        const expected = '---\nid: 1\nname: Item 1\n---\nid: 2\nname: Item 2\n'
        expect(transformToYAML(data)).toBe(expected)
    })

    it('should skip null values and nested objects without seconds property', () => {
        const data = [{
            valid: 'yes',
            invalidNull: null,
            invalidObject: { foo: 'bar' }
        }]
        const expected = '---\nvalid: yes\n'
        expect(transformToYAML(data)).toBe(expected)
    })

    it('should convert Firestore-like timestamps (objects with seconds) to ISO strings', () => {
        const timestamp = { seconds: 1672531200 } // 2023-01-01T00:00:00Z
        const data = [{
            createdAt: timestamp
        }]
        const result = transformToYAML(data)
        // Check if it contains the expected ISO string.
        // We use toContain because the exact format might depend on the environment, but toISOString() is usually standard.
        expect(result).toContain('createdAt: 2023-01-01T00:00:00.000Z')
    })

    it('should handle zero, false, and empty string correctly as primitive values', () => {
        const data = [{
            a: 0,
            b: false,
            c: ''
        }]
        const expected = '---\na: 0\nb: false\nc: \n'
        expect(transformToYAML(data)).toBe(expected)
    })
})
