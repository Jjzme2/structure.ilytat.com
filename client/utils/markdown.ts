import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Safely renders Markdown to HTML by parsing it with `marked` and sanitizing with `DOMPurify`.
 * prevent XSS attacks.
 */
export const renderMarkdown = (content: string): string => {
  if (!content) return ''

  // Parse markdown to HTML
  // marked.parse returns string | Promise<string>. We expect string here.
  const rawHtml = marked.parse(content)

  if (rawHtml instanceof Promise) {
      console.warn('renderMarkdown: marked.parse returned a Promise, but synchronous execution was expected.')
      return ''
  }

  // Sanitize the HTML to remove malicious scripts
  return DOMPurify.sanitize(rawHtml)
}
