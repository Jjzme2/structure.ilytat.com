import { collection, query, where, orderBy, limit, addDoc, updateDoc, doc, serverTimestamp, onSnapshot, getDocs, writeBatch } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { InboxItem } from '~/types'

export const useInbox = () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const inbox = ref<InboxItem[]>([])
    const unreadCount = computed(() => inbox.value.filter(m => !m.read).length)

    let unsubscribe: (() => void) | null = null

    /**
     * Start listening to the user's inbox
     */
    const init = () => {
        if (!user.value) return

        const q = query(
            collection(db, `users/${user.value.uid}/inbox`),
            where('archived', '==', false),
            orderBy('timestamp', 'desc'),
            limit(50)
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
            inbox.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as InboxItem))
        })
    }

    /**
     * Send a message to a user (or self)
     */
    const send = async (toUserId: string, message: Omit<InboxItem, 'id' | 'timestamp' | 'read' | 'archived' | 'to'>) => {
        try {
            await addDoc(collection(db, `users/${toUserId}/inbox`), {
                ...message,
                to: toUserId,
                read: false,
                archived: false,
                timestamp: serverTimestamp()
            })
        } catch (e) {
            console.error('Inbox: Failed to send message', e)
            throw e
        }
    }

    /**
     * Mark a message as read
     */
    const markRead = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, `users/${user.value.uid}/inbox`, id)
        await updateDoc(docRef, { read: true })
    }

    /**
     * Archive a message
     */
    const archive = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, `users/${user.value.uid}/inbox`, id)
        await updateDoc(docRef, { archived: true })
    }

    /**
     * Mark all visible messages as read
     */
    const markAllRead = async () => {
        if (!user.value) return

        // Filter for unread messages only
        const unreadMessages = inbox.value.filter(m => !m.read)
        if (unreadMessages.length === 0) return

        // OPTIMIZATION: Use writeBatch to mark all messages as read in a single atomic operation.
        // This reduces N write operations to 1, significantly improving performance and reducing quota usage.
        const batch = writeBatch(db)

        unreadMessages.forEach(m => {
            const docRef = doc(db, `users/${user.value.uid}/inbox`, m.id)
            batch.update(docRef, { read: true })
        })

        try {
            await batch.commit()
            // Optimistically update local state if needed, though onSnapshot should handle it.
        } catch (e) {
            console.error('Inbox: Failed to mark all as read', e)
            throw e
        }
    }

    return {
        inbox,
        unreadCount,
        init,
        send,
        markRead,
        markAllRead,
        archive
    }
}
