import { describe, it, expect } from 'vitest'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

describe('XSS Protection', () => {
  it('should sanitize marked output to prevent XSS', () => {
    // We use a newline to separate markdown from HTML block to ensure markdown parsing happens if possible,
    // but the main goal is XSS prevention.
    const maliciousInput = '**bold**\n<script>alert("xss")</script>'
    const unsafeHtml = marked.parse(maliciousInput) as string
    const safeHtml = DOMPurify.sanitize(unsafeHtml)

    // Unsafe HTML should contain the script
    expect(unsafeHtml).toContain('<script>')

    // Safe HTML should NOT contain the script tag
    expect(safeHtml).not.toContain('<script>')

    // Markdown should be preserved (marked converts **bold** to <strong>bold</strong>)
    // Note: marked wraps output in <p> by default for this input
    expect(safeHtml).toContain('<strong>bold</strong>')
  })

  it('should handle complex XSS vectors', () => {
    const vectors = [
      {
        input: '<img src=x onerror=alert(1)>',
        forbidden: 'onerror'
      },
      {
        input: '<a href="javascript:alert(1)">click me</a>',
        forbidden: 'javascript:'
      }
    ]

    vectors.forEach(({ input, forbidden }) => {
        const unsafeHtml = marked.parse(input) as string
        const safeHtml = DOMPurify.sanitize(unsafeHtml)

        // The safe HTML should not contain the forbidden attribute/protocol
        expect(safeHtml).not.toContain(forbidden)
    })

    // Special case for escaped content
    // marked might escape invalid HTML like <svg/onload..., rendering it harmless but keeping the text.
    // In that case, we check that it is NOT a valid HTML tag.
    const escapedVector = '<svg/onload=alert(1)>'
    const unsafeEscaped = marked.parse(escapedVector) as string
    const safeEscaped = DOMPurify.sanitize(unsafeEscaped)

    // It should NOT contain <svg (unescaped)
    expect(safeEscaped).not.toContain('<svg')
  })
})
