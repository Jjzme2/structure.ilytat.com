import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, where, type Firestore } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { ActivityItem } from '~/types'

class ActivityService {
    private db: Firestore | null = null

    constructor(db: Firestore | null) {
        this.db = db
    }

    /**
     * Log a significant user action
     */
    async log(user: User | null, action: string, module: string, metadata: Record<string, any> = {}): Promise<void> {
        if (!user || !this.db) {
            console.warn('ActivityService: No authenticated user or DB, skipping log.')
            return
        }

        try {
            await addDoc(collection(this.db, 'activities'), {
                action,
                module,
                userId: user.uid,
                timestamp: serverTimestamp(),
                metadata
            })
        } catch (e) {
            console.error('ActivityService: Failed to log action', e)
            throw e
        }
    }

    /**
     * Fetch recent activity for the current user
     */
    async fetchRecent(user: User | null, count: number = 20): Promise<ActivityItem[]> {
        if (!user || !this.db) return []

        try {
            const q = query(
                collection(this.db, 'activities'),
                where('userId', '==', user.uid),
                orderBy('timestamp', 'desc'),
                limit(count)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ActivityItem))
        } catch (e) {
            console.error('ActivityService: Failed to fetch history', e)
            return []
        }
    }

    /**
     * Fetch recent activity across all users (Admin only)
     */
    async fetchAllRecent(count: number = 50): Promise<ActivityItem[]> {
        if (!this.db) return []

        try {
            const q = query(
                collection(this.db, 'activities'),
                orderBy('timestamp', 'desc'),
                limit(count)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ActivityItem))
        } catch (e) {
            console.error('ActivityService: Failed to fetch audit logs', e)
            return []
        }
    }
}

export const useActivityService = (db: Firestore) => new ActivityService(db)
