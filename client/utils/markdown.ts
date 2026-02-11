import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Safely renders markdown content to HTML.
 * Sanitizes the output to prevent XSS using DOMPurify.
 *
 * @param content The markdown content to render.
 * @returns The sanitized HTML string.
 */
export const renderMarkdown = (content: string): string => {
    if (!content) return ''
    // Ensure synchronous parsing
    const rawHtml = marked.parse(content, { async: false }) as string
    return DOMPurify.sanitize(rawHtml)
}
