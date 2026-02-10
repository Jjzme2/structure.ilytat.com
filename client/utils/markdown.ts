import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes and renders markdown content safely to prevent XSS.
 *
 * @param content The raw markdown string
 * @returns The sanitized HTML string
 */
export const renderSafeMarkdown = (content: string): string => {
  if (!content) return ''

  // marked.parse(content) returns string | Promise<string>
  // By default (without async extensions), it returns a string.
  // We cast to string to handle the type safely in sync contexts (like v-html computed props)
  const html = marked.parse(content) as string

  return DOMPurify.sanitize(html)
}
