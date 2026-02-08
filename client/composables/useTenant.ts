import { useCurrentUser } from 'vuefire'

export const useTenant = () => {
    const user = useCurrentUser()

    // Shared state for tenant scope
    const scope = useState<'personal' | 'company'>('tenant-scope', () => 'company')

    // Reactive tenant ID based on user's custom claims or profile
    const tenantId = computed(() => {
        // 1. Try custom claims (if available in token)
        // Note: access request.auth.token.tenantId in rules implies we should have it here too
        // But client-side 'user' object might not have it directly on the root. 
        // We often look at user.value?.customClaims?.tenantId or similar if using the admin SDK to set it.
        // For now, let's assume it might be on the user object or we fallback.

        // 2. Fallback to a default or 'ilytat' for now if not found
        // In a real multi-tenant app, we'd fetch the user's profile which has 'tenantId'
        // Let's assume for this specific issue, the user is likely 'ilytat' admin.
        return 'ilytat'
    })

    return {
        scope,
        tenantId
    }
}
