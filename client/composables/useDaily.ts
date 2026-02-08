import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Quote, Task, ImportantDate } from '~/types'

export interface DailySnapshot {
    quote: Quote | null
    tasks: {
        focusCount: number
        doneCount: number
        topTask: Task | null
    }
    events: ImportantDate[]
    metadata: any | null
}

export const useDaily = () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const dailySnapshot = ref<DailySnapshot | null>(null)
    const loading = ref(false)

    const todayStr = computed(() => new Date().toISOString().split('T')[0])

    const fetchDaily = async () => {
        if (!user.value) return
        loading.value = true

        try {
            const date = todayStr.value

            // Define all queries and refs first
            const dailyRef = doc(db, `users/${user.value.uid}/daily/${date}`)
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('userId', '==', user.value.uid)
            )
            const datesQuery = query(
                collection(db, 'dates'),
                where('userId', '==', user.value.uid),
                where('date', '==', date)
            )
            const metaRef = doc(db, 'metadata', 'system')

            // Fetch everything in parallel
            const [dailySnap, tasksSnap, datesSnap, metaSnap] = await Promise.all([
                getDoc(dailyRef),
                getDocs(tasksQuery),
                getDocs(datesQuery),
                getDoc(metaRef)
            ])

            let selectedQuote: Quote | null = null

            // 1. Handle Daily Quote
            if (dailySnap.exists()) {
                selectedQuote = dailySnap.data() as Quote
            } else {
                // Try fetching user quotes first
                const userQuotesQuery = query(collection(db, 'quotes'), where('userId', '==', user.value.uid))
                const userQuotesSnap = await getDocs(userQuotesQuery)

                let pool: Quote[] = []

                if (!userQuotesSnap.empty) {
                    pool = userQuotesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Quote[]
                } else {
                    // Fallback to system quotes
                    const systemQuotesQuery = query(collection(db, 'quotes'), where('userId', '==', 'system'))
                    const systemQuotesSnap = await getDocs(systemQuotesQuery)
                    if (!systemQuotesSnap.empty) {
                        pool = systemQuotesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Quote[]
                    }
                }

                if (pool.length > 0) {
                    selectedQuote = pool[Math.floor(Math.random() * pool.length)] || null
                    if (selectedQuote) {
                        // Persist selection for the day
                        await setDoc(dailyRef, selectedQuote)
                    }
                }
            }

            // 2. Fetch Tasks Summary
            // OPTIMIZATION: Only fetch today's focus tasks to reduce read operations.
            // We skip fetching 'done' tasks as the done count is currently unused in the dashboard.
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('userId', '==', user.value.uid),
                where('status', '==', 'focus'),
                where('focusDate', '==', date)
            )
            const tasksSnap = await getDocs(tasksQuery)
            const todayTasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Task[]

            const focusTasks = todayTasks
                .sort((a, b) => (a.focusOrder || 0) - (b.focusOrder || 0))
            const doneToday: Task[] = [] // Optimized out

            // 3. Process Today's Events
            const todayEvents = datesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ImportantDate[]

            // 4. Process Metadata
            const systemMeta = metaSnap.exists() ? metaSnap.data() : null

            dailySnapshot.value = {
                quote: selectedQuote,
                tasks: {
                    focusCount: focusTasks.length,
                    doneCount: doneToday.length,
                    topTask: focusTasks[0] || null
                },
                events: todayEvents,
                metadata: systemMeta
            }

        } catch (e: any) {
            console.error('useDaily: Error fetching consolidated snapshot')
            console.error('Code:', e.code)
            console.error('Message:', e.message)
            if (e.code === 'permission-denied') {
                console.warn('Check Firestore Rules for paths: users/UID/daily, tasks, dates, or metadata.')
            }
        } finally {
            loading.value = false
        }
    }

    return {
        dailySnapshot,
        fetchDaily,
        loading,
        todayStr
    }
}
