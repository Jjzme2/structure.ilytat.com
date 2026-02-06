import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Task, TaskStatus, TaskCategory } from '~/types'
import { useActivityLog } from '~/composables/useActivityLog'

export const useTasksStore = defineStore('tasks', () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const audit = useActivityLog()

    // Get today's date in ISO format
    const getTodayISO = () => new Date().toISOString().split('T')[0]

    const addTask = async (title: string, options?: { description?: string; category?: string; okrId?: string; krId?: string }) => {
        if (!user.value) return
        await addDoc(collection(db, 'tasks'), {
            title,
            description: options?.description || null,
            status: 'backlog' as TaskStatus,
            category: options?.category || null,
            okrId: options?.okrId || null,
            krId: options?.krId || null,
            focusDate: null,
            focusOrder: null,
            dueDate: null,
            userId: user.value.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            completedAt: null
        })
        audit.log('Task Created', 'tasks', { title, okrId: options?.okrId })
    }

    const updateTaskStatus = async (id: string, status: TaskStatus) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        const updates: Record<string, any> = {
            status,
            updatedAt: serverTimestamp()
        }

        // Clear focus data when moving out of focus
        if (status !== 'focus') {
            updates.focusDate = null
            updates.focusOrder = null
        }

        // Set completedAt when marking as done
        if (status === 'done') {
            updates.completedAt = serverTimestamp()
        } else {
            updates.completedAt = null
        }

        await updateDoc(docRef, updates)
        audit.log('Task Status Updated', 'tasks', { taskId: id, status })
    }

    const updateTaskTitle = async (id: string, title: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, { title, updatedAt: serverTimestamp() })
    }

    const updateTaskDescription = async (id: string, description: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, { description, updatedAt: serverTimestamp() })
    }

    const deleteTask = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'tasks', id))
        audit.log('Task Deleted', 'tasks', { taskId: id })
    }

    // Daily 6 Focus methods
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
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, {
            status: 'focus',
            focusDate: today,
            focusOrder: nextOrder,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Focused', 'tasks', { taskId: id })
    }

    const removeFromFocus = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, {
            status: 'backlog',
            focusDate: null,
            focusOrder: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Unfocused', 'tasks', { taskId: id })
    }

    const reorderFocus = async (id: string, newOrder: number) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, {
            focusOrder: newOrder,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Focus Reordered', 'tasks', { taskId: id, newOrder })
    }

    const setCategory = async (id: string, category: string | null) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, { category, updatedAt: serverTimestamp() })
        audit.log('Task Category Set', 'tasks', { taskId: id, category })
    }

    const setDueDate = async (id: string, dueDate: string | null) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, { dueDate, updatedAt: serverTimestamp() })
        audit.log('Task Due Date Set', 'tasks', { taskId: id, dueDate })
    }

    const archiveTask = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', id)
        await updateDoc(docRef, {
            status: 'archived',
            focusDate: null,
            focusOrder: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Archived', 'tasks', { taskId: id })
    }

    const linkToOKR = async (taskId: string, okrId: string, krId: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', taskId)
        await updateDoc(docRef, {
            okrId,
            krId,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Linked to Strategic Objective', 'tasks', { taskId, okrId, krId })
    }

    const unlinkFromOKR = async (taskId: string) => {
        if (!user.value) return
        const docRef = doc(db, 'tasks', taskId)
        await updateDoc(docRef, {
            okrId: null,
            krId: null,
            updatedAt: serverTimestamp()
        })
        audit.log('Task Unlinked from Strategic Objective', 'tasks', { taskId })
    }

    return {
        addTask,

        updateTaskStatus,
        updateTaskTitle,
        updateTaskDescription,
        deleteTask,
        addToFocus,
        removeFromFocus,
        reorderFocus,
        linkToOKR,
        unlinkFromOKR,
        setCategory,
        setDueDate,
        archiveTask,
        getTodayISO
    }
})
