export const useTenant = () => {
    // Shared state for tenant scope
    const scope = useState<'personal' | 'company'>('tenant-scope', () => 'company')

    // In the future, we can add tenant ID, settings, etc. here
    const tenantId = useState<string>('tenant-id', () => 'ilytat')

    return {
        scope,
        tenantId
    }
}
