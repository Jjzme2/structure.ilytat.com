import {
    transformToJSON,
    transformToYAML,
    transformToXML,
    transformToMarkdown,
    transformToTXT,
    triggerDownload,
    copyToClipboard
} from '~/utils/export'
import { useToast } from '~/composables/useToast'
import type { Task, ImportantDate } from '~/types'

export type ExportFormat = 'json' | 'yaml' | 'xml' | 'md' | 'txt'

export const useExport = () => {
    const { success, error } = useToast()

    const getContent = (data: any[], format: ExportFormat, title: string, rootName: string, itemName: string) => {
        switch (format) {
            case 'json': return transformToJSON(data)
            case 'yaml': return transformToYAML(data)
            case 'xml': return transformToXML(data, rootName, itemName)
            case 'md': return transformToMarkdown(data, title)
            case 'txt': return transformToTXT(data)
            default: return ''
        }
    }

    const getMimeType = (format: ExportFormat) => {
        switch (format) {
            case 'json': return 'application/json'
            case 'yaml': return 'text/yaml'
            case 'xml': return 'application/xml'
            case 'md': return 'text/markdown'
            case 'txt': return 'text/plain'
            default: return 'text/plain'
        }
    }

    const exportTasks = (tasks: Task[], format: ExportFormat, mode: 'download' | 'copy' = 'download') => {
        const filename = `tasks_export_${new Date().toISOString().split('T')[0]}`
        const data = tasks.map(t => ({
            title: t.title,
            description: t.description || '',
            status: t.status,
            category: t.category || '',
            createdAt: t.createdAt,
            completedAt: t.completedAt || ''
        }))

        const content = getContent(data, format, 'Tasks Export', 'Tasks', 'Task')

        if (mode === 'download') {
            triggerDownload(content, `${filename}.${format}`, getMimeType(format))
            success(`Tasks exported as ${format.toUpperCase()}`)
        } else {
            copyToClipboard(content).then(ok => {
                if (ok) success(`${format.toUpperCase()} copied to clipboard`)
                else error('Failed to copy to clipboard')
            })
        }
    }

    const exportSchedules = (dates: any[], format: ExportFormat, mode: 'download' | 'copy' = 'download') => {
        const filename = `schedules_export_${new Date().toISOString().split('T')[0]}`
        const data = dates.map(d => ({
            title: d.title,
            date: d.date,
            type: d.type,
            isDefault: !!d.isDefault
        }))

        const content = getContent(data, format, 'Schedules Export', 'Schedules', 'Event')

        if (mode === 'download') {
            triggerDownload(content, `${filename}.${format}`, getMimeType(format))
            success(`Schedules exported as ${format.toUpperCase()}`)
        } else {
            copyToClipboard(content).then(ok => {
                if (ok) success(`${format.toUpperCase()} copied to clipboard`)
                else error('Failed to copy to clipboard')
            })
        }
    }

    return {
        exportTasks,
        exportSchedules
    }
}
