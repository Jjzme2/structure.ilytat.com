import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../../client/utils/markdown'

describe('renderMarkdown', () => {
  it('should render valid markdown to HTML', () => {
    const markdown = '# Hello World\nThis is a **bold** text.'
    const html = renderMarkdown(markdown)
    expect(html).toContain('<h1>Hello World</h1>')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('should sanitize XSS payloads', () => {
    const markdown = 'Some text <script>alert("XSS")</script>'
    const html = renderMarkdown(markdown)
    expect(html).toContain('Some text')
    expect(html).not.toContain('<script>')
    // DOMPurify might remove the content of script tags or the tag itself
  })

  it('should sanitize javascript: links', () => {
    const markdown = '[Click me](javascript:alert("XSS"))'
    const html = renderMarkdown(markdown)
    // marked renders links as <a href="...">
    // DOMPurify should remove javascript: hrefs
    expect(html).not.toContain('href="javascript:alert(\'XSS\')"')
  })

  it('should handle empty input', () => {
    expect(renderMarkdown('')).toBe('')
    // @ts-expect-error testing runtime behavior with invalid types
    expect(renderMarkdown(null)).toBe('')
    // @ts-expect-error testing runtime behavior with invalid types
    expect(renderMarkdown(undefined)).toBe('')
  })
})
