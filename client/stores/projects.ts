import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Project } from '~/types'
import { useTenant } from '~/composables/useTenant'
import { useActivityLog } from '~/composables/useActivityLog'

export const useProjectsStore = defineStore('projects', () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const audit = useActivityLog()
    const { tenantId } = useTenant()

    // Projects are ALWAYS company-scoped in this implementation
    const collectionPath = computed(() => `companies/${tenantId.value}/projects`)

    const addProject = async (name: string, description?: string) => {
        if (!user.value) return
        const newProject = {
            name,
            description: description || '',
            status: 'active' as const,
            tenantId: tenantId.value,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            members: [user.value.uid]
        }
        const docRef = await addDoc(collection(db, collectionPath.value), newProject)
        audit.log('Project Created', 'projects', { name, projectId: docRef.id })
        return docRef.id
    }

    const updateProject = async (id: string, updates: Partial<Project>) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        })
        audit.log('Project Updated', 'projects', { projectId: id, ...updates })
    }

    const deleteProject = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
        audit.log('Project Deleted', 'projects', { projectId: id })
    }

    return {
        collectionPath,
        addProject,
        updateProject,
        deleteProject
    }
})
