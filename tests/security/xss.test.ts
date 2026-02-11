import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../../client/utils/markdown'

describe('Security: XSS Vulnerability Check', () => {
    it('should sanitize dangerous HTML tags', () => {
        const maliciousInput = '<script>alert("xss")</script>'
        const output = renderMarkdown(maliciousInput)

        // Assert that the script tag is REMOVED
        expect(output).not.toContain('<script>')
        // DOMPurify typically removes the content of script tags too, but let's check.
        // If it escapes it, it might be &lt;script&gt;. DOMPurify removes unsafe tags.
        expect(output).not.toContain('<script>')
    })

    it('should sanitize javascript: links', () => {
        const maliciousInput = '[Click me](javascript:alert(1))'
        const output = renderMarkdown(maliciousInput)

        // Assert that the javascript: href is REMOVED or sanitized
        // DOMPurify removes the href attribute entirely or the whole tag if it's unsafe?
        // Usually it removes the unsafe attribute.
        expect(output).toContain('Click me')
        expect(output).not.toContain('href="javascript:alert(1)"')
    })

    it('should allow safe HTML', () => {
        const safeInput = '**Bold** and *Italic*'
        const output = renderMarkdown(safeInput)

        expect(output).toContain('<strong>Bold</strong>')
        expect(output).toContain('<em>Italic</em>')
    })
})
