import { useRouter } from '#app'
import { useCommandPalette } from '~/composables/useCommandPalette'
import { useTheme } from '~/composables/useTheme'
import { externalLinks } from '~/config/quicklaunch'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const { register } = useCommandPalette()

    // Navigation Commands
    register({
        id: 'nav-home',
        label: 'Go to Home',
        icon: '🏠',
        section: 'Apps', // Changed to Apps
        keywords: ['home', 'dashboard'],
        action: () => router.push('/')
    })

    register({
        id: 'nav-dashboard',
        label: 'Go to Dashboard',
        icon: '📊',
        section: 'Apps',
        keywords: ['dashboard', 'stats', 'overview'],
        action: () => router.push('/dashboard')
    })

    register({
        id: 'nav-tasks',
        label: 'Go to Action Items',
        icon: '✅',
        section: 'Apps',
        keywords: ['tasks', 'todo', 'kanban'],
        action: () => router.push('/tasks')
    })

    register({
        id: 'nav-dates',
        label: 'Go to Schedule',
        icon: '📅',
        section: 'Apps',
        keywords: ['calendar', 'dates', 'events'],
        action: () => router.push('/dates')
    })

    register({
        id: 'nav-notes',
        label: 'Go to Knowledge',
        icon: '📝',
        section: 'Apps',
        keywords: ['notes', 'docs', 'wiki', 'intelligence'],
        action: () => router.push('/intelligence')
    })

    register({
        id: 'nav-admin',
        label: 'Go to Admin Panel',
        icon: '🛡️',
        section: 'System',
        keywords: ['admin', 'panel', 'management', 'settings'],
        action: () => router.push('/admin'),
        adminOnly: true
    })

    register({
        id: 'nav-ledger',
        label: 'Go to Finance',
        icon: '💰',
        section: 'Apps',
        keywords: ['ledger', 'finance', 'money', 'budget'],
        action: () => router.push('/ledger')
    })

    register({
        id: 'nav-strategy',
        label: 'Go to Strategy',
        icon: '🎯',
        section: 'Apps',
        keywords: ['strategy', 'okr', 'goals', 'vision'],
        action: () => router.push('/strategy')
    })

    register({
        id: 'nav-supply',
        label: 'Go to Asset Registry',
        icon: '📦',
        section: 'Apps',
        keywords: ['supply', 'assets', 'inventory', 'subscriptions'],
        action: () => router.push('/supply')
    })

    register({
        id: 'nav-quotes',
        label: 'Go to Quotes',
        icon: '💬',
        section: 'Apps',
        keywords: ['quotes', 'inspiration', 'wisdom'],
        action: () => router.push('/quotes')
    })

    register({
        id: 'nav-settings',
        label: 'Go to Settings',
        icon: '⚙️',
        section: 'System',
        keywords: ['config', 'preferences', 'profile'],
        action: () => router.push('/settings')
    })

    // External Links
    externalLinks.forEach((link: { label: string; icon: string; path: string }) => { // Added explicit type casting
        const isAdminLink = ['Firebase Console', 'Cloudflare Dashboard', 'EmailJS Dashboard', 'GitHub Repo'].includes(link.label)
        register({
            id: `ext-${link.label.toLowerCase().replace(/\s+/g, '-')}`,
            label: link.label,
            icon: link.icon === 'fire' ? '🔥' :
                link.icon === 'github' ? '🐙' :
                    link.icon === 'mail' ? '📧' :
                        link.icon === 'cloud' ? '☁️' : '🔗',
            section: 'Quick Links', // Changed back to Quick Links
            keywords: ['external', 'link', 'url', link.label.toLowerCase()],
            action: () => window.open(link.path, '_blank'),
            external: true,
            adminOnly: isAdminLink
        })
    })

    // Theme Commands
    const { themes, applyTheme } = useTheme()

    Object.entries(themes).forEach(([key, theme]: [string, any]) => {
        register({
            id: `sys-theme-${key}`,
            label: `Theme: ${theme.name}`,
            icon: '🎨',
            section: 'Themes',
            keywords: ['theme', 'style', 'mode', theme.name.toLowerCase(), theme.category.toLowerCase()],
            action: () => applyTheme(key)
        })
    })

    // Export Commands
    register({
        id: 'export-tasks-json',
        label: 'Export Tasks as JSON',
        icon: '📤',
        section: 'System',
        keywords: ['export', 'tasks', 'json', 'data'],
        action: () => {
            const { exportTasks } = useExport()
            // Note: This requires getting tasks from store or collection. 
            // In a real plugin we'd need to inject or use a global store.
            // For now, these are shortcuts that might need focus context or just navigating to page.
            router.push('/tasks?export=json')
        }
    })

    register({
        id: 'export-schedules-json',
        label: 'Export Schedules as JSON',
        icon: '📤',
        section: 'System',
        keywords: ['export', 'schedules', 'calendar', 'json'],
        action: () => {
            router.push('/dates?export=json')
        }
    })
})
