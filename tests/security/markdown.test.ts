import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../../client/utils/markdown'

describe('Security: Markdown XSS Protection', () => {
  it('should sanitize malicious scripts from markdown', () => {
    const malicious = '<script>alert("xss")</script>'
    const output = renderMarkdown(malicious)
    expect(output).not.toContain('<script>') // Should be sanitized
  })

  it('should sanitize javascript: links', () => {
      const malicious = '[Click me](javascript:alert("xss"))'
      const output = renderMarkdown(malicious)
      expect(output).not.toContain('javascript:')
  })

  it('should allow safe html', () => {
      const safe = '**Bold**'
      const output = renderMarkdown(safe)
      expect(output).toContain('<strong>Bold</strong>')
  })
})
