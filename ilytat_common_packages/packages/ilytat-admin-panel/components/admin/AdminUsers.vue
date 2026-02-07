<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCurrentUser, getCurrentUser } from 'vuefire'

const audit = useActivityLog()
const { success, error, info } = useToast()

interface User {
    uid: string
    email: string
    displayName: string
    role: string
    lastSignInTime: string
    creationTime: string
    disabled: boolean
    forcePasswordReset: boolean
}

const users = ref<User[]>([])
const loading = ref(true)
const inviting = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('member')

const fetchUsers = async () => {
    loading.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        users.value = await $fetch('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (e: any) {
        console.error('Failed to fetch users', e)
    } finally {
        loading.value = false
    }
}

const inviteUser = async () => {
    if (!inviteEmail.value) return
    inviting.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        await $fetch('/api/admin/invite', {
            method: 'POST',
            body: { email: inviteEmail.value, role: inviteRole.value },
            headers: { Authorization: `Bearer ${token}` }
        })
        await audit.log('User Invited', 'admin-users', { email: inviteEmail.value, role: inviteRole.value })
        inviteEmail.value = ''
        fetchUsers()
    } catch (e: any) {
        console.error('Failed to invite user', e)
    } finally {
        inviting.value = false
    }
}

const performUserAction = async (uid: string, email: string, action: 'send-reset-email' | 'force-reset' | 'clear-reset-flag') => {
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        const result = await $fetch<{ success: boolean; message: string; link?: string }>('/api/admin/user-action', {
            method: 'POST',
            body: { uid, action },
            headers: { Authorization: `Bearer ${token}` }
        })

        if (result.success) {
            await audit.log(`User Action: ${action}`, 'admin-users', { targetUid: uid, targetEmail: email })
            success(result.message)
            fetchUsers() // Refresh list
            if (result.link && action === 'send-reset-email') {
                console.log(`Reset link for ${email}: ${result.link}`)
            }
        }
    } catch (e: any) {
        error(`Action failed: ${e.message}`)
    }
}

const toggleUserStatus = async (userObj: User) => {
    const newStatus = !userObj.disabled
    const actionLabel = newStatus ? 'Disable' : 'Enable'
    
    if (!confirm(`Are you sure you want to ${actionLabel} ${userObj.email}?`)) return

    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        const result = await $fetch<{ success: boolean; message: string }>('/api/admin/user-status', {
            method: 'POST',
            body: { uid: userObj.uid, disabled: newStatus },
            headers: { Authorization: `Bearer ${token}` }
        })

        if (result.success) {
            await audit.log(`User ${actionLabel}d`, 'admin-users', { targetUid: userObj.uid, targetEmail: userObj.email })
            success(result.message)
            fetchUsers() // Refresh list
        }
    } catch (e: any) {
        error(`Status update failed: ${e.message}`)
    }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString()
}

onMounted(fetchUsers)
</script>

<template>
    <div class="space-y-8 animate-fade-in">
        <!-- Invite Panel -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 class="text-xl font-bold text-amber-500 mb-4">Invite New User</h2>
            <div class="flex flex-col md:flex-row gap-4">
                <input v-model="inviteEmail" type="email" placeholder="Enter email address..."
                    class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors" />
                <select v-model="inviteRole"
                    class="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none pr-10">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                </select>
                <button @click="inviteUser" :disabled="inviting || !inviteEmail"
                    class="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap">
                    {{ inviting ? 'Wait...' : 'Send Invite' }}
                </button>
            </div>
        </div>

        <!-- Users Table -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-slate-700 bg-slate-900/50">
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active
                            </th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700">
                        <tr v-if="loading" class="animate-pulse">
                            <td colspan="4"
                                class="px-6 py-8 text-center text-slate-500 uppercase tracking-widest text-xs">Awaiting
                                Data...</td>
                        </tr>
                        <tr v-else-if="users.length === 0">
                            <td colspan="4" class="px-6 py-8 text-center text-slate-500">No users found.</td>
                        </tr>
                        <tr v-else v-for="user in users" :key="user.uid"
                            class="group hover:bg-slate-700/30 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-500">
                                        {{ user.email?.[0]?.toUpperCase() || '?' }}
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <div class="font-bold text-white">{{ user.email }}</div>
                                            <span v-if="user.disabled" class="text-[8px] bg-rose-500/20 text-rose-500 px-1 rounded border border-rose-500/30 uppercase">Disabled</span>
                                            <span v-if="user.forcePasswordReset" class="text-[8px] bg-amber-500/20 text-amber-500 px-1 rounded border border-amber-500/30 uppercase">Reset Req'd</span>
                                        </div>
                                        <div class="text-[10px] text-slate-500 font-mono">{{ user.uid }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                    :class="user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-700 text-slate-300'">
                                    {{ user.role }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-xs text-slate-400 font-mono">{{ formatDate(user.lastSignInTime) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="performUserAction(user.uid, user.email, 'send-reset-email')"
                                        title="Send Reset Email"
                                        class="p-1.5 text-slate-500 hover:text-amber-500 transition-colors tooltip">
                                        📧
                                    </button>
                                    <button v-if="user.forcePasswordReset" @click="performUserAction(user.uid, user.email, 'clear-reset-flag')"
                                        title="Clear Reset Flag"
                                        class="p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors tooltip">
                                        ✅
                                    </button>
                                    <button v-else @click="performUserAction(user.uid, user.email, 'force-reset')"
                                        title="Force Password Reset"
                                        class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors tooltip">
                                        🔄
                                    </button>
                                    <button @click="toggleUserStatus(user)"
                                        :title="user.disabled ? 'Enable Account' : 'Disable Account'"
                                        class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded transition-all"
                                        :class="user.disabled 
                                            ? 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10' 
                                            : 'text-slate-500 border-slate-700 hover:text-rose-400 hover:border-rose-400/50'">
                                        {{ user.disabled ? 'Enable' : 'Disable' }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
