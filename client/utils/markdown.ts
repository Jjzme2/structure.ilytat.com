import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Securely renders markdown content to HTML.
 * Uses 'marked' for parsing and 'isomorphic-dompurify' for sanitization.
 *
 * @param content - The markdown string to render
 * @returns Sanitized HTML string
 */
export const renderMarkdown = (content: string): string => {
  if (!content) return ''

  try {
      // Parse markdown to HTML
      // marked.parse is synchronous by default unless async extensions are used
      const rawHtml = marked.parse(content) as string

      // Sanitize the HTML to prevent XSS
      return DOMPurify.sanitize(rawHtml)
  } catch (error) {
      console.error('Error rendering markdown:', error)
      // Return empty string on error to prevent broken UI
      return ''
  }
}
