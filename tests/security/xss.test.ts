import { describe, it, expect } from 'vitest'
import { renderSafeMarkdown } from '../../client/utils/markdown'

describe('Security: XSS Prevention', () => {
    it('should sanitize script tags from markdown', () => {
        const malicious = 'Hello <script>alert("xss")</script> World'
        const safe = renderSafeMarkdown(malicious)

        expect(safe).not.toContain('<script>')
        expect(safe).toContain('Hello')
        expect(safe).toContain('World')
    })

    it('should sanitize onclick attributes', () => {
        // Markdown link with javascript: protocol
        const malicious = '[Click me](javascript:alert(1))'
        const safe = renderSafeMarkdown(malicious)

        expect(safe).not.toContain('javascript:')
        // marked/dompurify might remove the href or the whole tag
    })

    it('should sanitize img onerror attributes', () => {
        const rawHtml = '<img src=x onerror=alert(1)>'
        const safe = renderSafeMarkdown(rawHtml)

        expect(safe).not.toContain('onerror')
    })

    it('should allow safe HTML', () => {
        const content = '**Bold** and *Italic*'
        const safe = renderSafeMarkdown(content)

        expect(safe).toContain('<strong>Bold</strong>')
        expect(safe).toContain('<em>Italic</em>')
    })
})
