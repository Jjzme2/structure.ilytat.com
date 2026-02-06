
export interface QuickLaunchItem {
    label: string
    icon: string
    path: string
    newTab?: boolean
}

export const memberQuickLaunch: QuickLaunchItem[] = [
    {
        label: 'My Tasks',
        icon: 'check-circle',
        path: '/tasks'
    },
    {
        label: 'Calendar',
        icon: 'calendar',
        path: '/dates'
    },
    {
        label: 'Submit Request',
        icon: 'plus-circle',
        path: '/requests/new'
    }
]

export const adminQuickLaunch: QuickLaunchItem[] = [
    {
        label: 'Admin Dashboard',
        icon: 'view-grid',
        path: '/admin'
    },
    {
        label: 'User Management',
        icon: 'users',
        path: '/admin/users'
    },
    {
        label: 'System Settings',
        icon: 'cog',
        path: '/settings/system'
    },
    ...memberQuickLaunch
]

export const externalLinks: QuickLaunchItem[] = [
    {
        label: 'Firebase Console',
        icon: 'fire',
        path: 'https://console.firebase.google.com/project/ilytat-structure/overview',
        newTab: true
    },
    {
        label: 'GitHub Repo',
        icon: 'github',
        path: 'https://github.com/ILYTAT/structure',
        newTab: true
    },
    {
        label: 'EmailJS Dashboard',
        icon: 'mail',
        path: 'https://dashboard.emailjs.com/',
        newTab: true
    },
    {
        label: 'Cloudflare Dashboard',
        icon: 'cloud',
        path: 'https://dash.cloudflare.com/',
        newTab: true
    }
]
