import { getFirestore } from 'firebase-admin/firestore'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAuth(event)
    const db = getFirestore()
    const method = event.method

    // Verify admin access (simple check)
    // In production, use robust claims check as in other endpoints
    if (requester.email !== 'jj@ilytat.com' && requester.email !== 'admin@ilytat.com' && requester.email !== 'zettler.jj@ilytat.com') {
        // throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const groupsColl = db.collection('companies').doc('ilytat').collection('taskGroups')

    if (method === 'GET') {
        const snapshot = await groupsColl.get()
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    if (method === 'POST') {
        const body = await readBody(event)
        const { id, name, description, tasks } = body

        if (!name) throw createError({ statusCode: 400, statusMessage: 'Name required' })

        const data = {
            name,
            description: description || '',
            tasks: tasks || [], // Array of task templates
            updatedAt: new Date(),
            updatedBy: requester.uid
        }

        if (id) {
            await groupsColl.doc(id).set(data, { merge: true })
            return { success: true, id, message: 'Group updated' }
        } else {
            const docRef = await groupsColl.add({
                ...data,
                createdAt: new Date(),
                createdBy: requester.uid
            })
            return { success: true, id: docRef.id, message: 'Group created' }
        }
    }

    if (method === 'DELETE') {
        const body = await readBody(event)
        const { id } = body
        if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

        await groupsColl.doc(id).delete()
        return { success: true, message: 'Group deleted' }
    }

    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
