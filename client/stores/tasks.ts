import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Task, TaskStatus, TaskCategory } from '~/types'
import { useActivityLog } from '~/composables/useActivityLog'

export const useTasksStore = defineStore('tasks', () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const audit = useActivityLog()

    // Get today's date in ISO format
    const getTodayISO = () => new Date().toISOString().split('T')[0]

    const scope = useTenant().scope
    const tenantId = useTenant().tenantId

    // Helper to get the correct collection path
    const collectionPath = computed(() => {
        if (!user.value) return 'tasks' // Fallback
        return scope.value === 'personal'
            ? `users/${user.value.uid}/tasks`
            : `companies/${tenantId.value}/tasks`
    })

    const addTask = async (title: string, options?: { description?: string; category?: string; okrId?: string; krId?: string }) => {
        if (!user.value) return
        await addDoc(collection(db, collectionPath.value), {
            title,
            description: options?.description || null,
            status: 'backlog' as TaskStatus,
            category: options?.category || null,
            okrId: options?.okrId || null,
            krId: options?.krId || null,
            focusDate: null,
            focusOrder: null,
            rank: Date.now(), // Simple initial rank
            dueDate: null,
            userId: user.value.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            completedAt: null
        })
        audit.log('Task Created', 'tasks', { title, okrId: options?.okrId, scope: scope.value })
    }

    const updateTaskStatus = async (id: string, status: TaskStatus, newIndex?: number, contextTasks?: Task[]) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        const updates: Record<string, any> = {
            status,
            updatedAt: serverTimestamp()
        }

        // Handle Focus logic
        if (status === 'focus') {
            // If moving TO focus, we need to set the date and order
            // If we have contextTasks (the new list), we can assume the index is correct relative to them?
            // But simpler: just append to end if no index? Or allow reorderFocus to handle it?
            // For drag-and-drop, we usually get "added" event with new index.
            updates.focusDate = getTodayISO()
            if (typeof newIndex === 'number') {
                updates.focusOrder = newIndex + 1
            } else {
                // Append to end logic (needs read, but we can just use large number or let reorder fix it)
                updates.focusOrder = 99
            }
        } else {
            // Clear focus data if moving OUT of focus
            if (updates.status !== 'focus') {
                updates.focusDate = null
                updates.focusOrder = null
            }
        }

        // Set completedAt when marking as done
        if (status === 'done') {
            updates.completedAt = serverTimestamp()
        } else {
            // Only clear if it was previously done? Or always clear if not done?
            // If moving back to backlog/doing, clear it.
            updates.completedAt = null
        }

        // If we provided a newIndex for non-focus columns, we might want to update rank.
        // But rank is relative. 
        // Best approach for DnD: 
        // 1. Update status (and focus props) on the moved item.
        // 2. Then trigger a reorder of the *destination* list to ensure consistency.

        await updateDoc(docRef, updates)
        audit.log('Task Status Updated', 'tasks', { taskId: id, status, scope: scope.value })
    }

    // Generic reorder for any list
    // Updates the 'rank' (or 'focusOrder' for focus column) of all provided tasks to match their array index
    const batchReorderTasks = async (tasks: Task[], status: TaskStatus) => {
        if (!user.value || tasks.length === 0) return

        const batch = writeBatch(db)

        tasks.forEach((task, index) => {
            const docRef = doc(db, collectionPath.value, task.id)
            if (status === 'focus') {
                // For focus, we use focusOrder and ensure focusDate is set (though it should be already)
                batch.update(docRef, {
                    focusOrder: index + 1,
                    status: 'focus', // Ensure status is correct
                    updatedAt: serverTimestamp()
                })
            } else {
                // For others, use rank. Rank can be index * 1000 for space, or just index.
                // Using index is fine if we reorder everyone.
                batch.update(docRef, {
                    rank: index,
                    status: status, // Ensure status is correct of the list they are in
                    updatedAt: serverTimestamp()
                })
            }
        })

        await batch.commit()
    }

    const updateTaskTitle = async (id: string, title: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, { title, updatedAt: serverTimestamp() })
    }

    const updateTaskDescription = async (id: string, description: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, { description, updatedAt: serverTimestamp() })
    }

    const deleteTask = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
        audit.log('Task Deleted', 'tasks', { taskId: id, scope: scope.value })
    }

    const addToFocus = async (id: string, tasks: Task[]) => {
        if (!user.value) return
        const today = getTodayISO()

        // Count current focus tasks for today
        const todayFocusTasks = tasks.filter(t =>
            t.status === 'focus' && t.focusDate === today
        )

        if (todayFocusTasks.length >= 6) {
            throw new Error('Daily focus limit reached (max 6 tasks)')
        }

        const nextOrder = todayFocusTasks.length + 1
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, {
            status: 'focus',
            focusDate: today,
            focusOrder: nextOrder,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Focused', 'tasks', { taskId: id, scope: scope.value })
    }

    const removeFromFocus = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, {
            status: 'backlog',
            focusDate: null,
            focusOrder: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Unfocused', 'tasks', { taskId: id, scope: scope.value })
    }

    // Replaces reorderFocus with generic batchReorderTasks, but keeping for compatibility if needed or just removing.
    // I'll keep the specialized one if I want single-item reorder, but batch is better for drag-drop.
    // I will remove reorderFocus and use batchReorderTasks instead.

    const setCategory = async (id: string, category: string | null) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, { category, updatedAt: serverTimestamp() })
        audit.log('Task Category Set', 'tasks', { taskId: id, category, scope: scope.value })
    }

    const setDueDate = async (id: string, dueDate: string | null) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, { dueDate, updatedAt: serverTimestamp() })
        audit.log('Task Due Date Set', 'tasks', { taskId: id, dueDate, scope: scope.value })
    }

    const archiveTask = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, {
            status: 'archived',
            focusDate: null,
            focusOrder: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Archived', 'tasks', { taskId: id, scope: scope.value })
    }

    const linkToOKR = async (taskId: string, okrId: string, krId: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, taskId)
        await updateDoc(docRef, {
            okrId,
            krId,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Linked to Strategic Objective', 'tasks', { taskId, okrId, krId, scope: scope.value })
    }

    const unlinkFromOKR = async (taskId: string) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, taskId)
        await updateDoc(docRef, {
            okrId: null,
            krId: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Unlinked from Strategic Objective', 'tasks', { taskId, scope: scope.value })
    }

    return {
        scope,
        collectionPath,
        addTask,
        updateTaskStatus,
        batchReorderTasks,
        updateTaskTitle,
        updateTaskDescription,
        deleteTask,
        addToFocus,
        removeFromFocus,
        linkToOKR,
        unlinkFromOKR,
        setCategory,
        setDueDate,
        archiveTask,
        getTodayISO
    }
})
