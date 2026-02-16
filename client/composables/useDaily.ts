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
            // tasksQuery removed as it is redefined later for optimization

            // OPTIMIZATION: Only fetch today's focus tasks to reduce read operations.
            // We skip fetching 'done' tasks as the done count is currently unused in the dashboard.
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('userId', '==', user.value.uid),
                where('status', '==', 'focus'),
                where('focusDate', '==', date)
            )

            const datesQuery = query(
                collection(db, 'dates'),
                where('userId', '==', user.value.uid),
                where('date', '==', date)
            )
            const metaRef = doc(db, 'metadata', 'system')

            // Fetch everything in parallel
            const [dailySnap, datesSnap, metaSnap] = await Promise.all([
                getDoc(dailyRef),
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
            const todayTasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Task[]

            const focusTasks = todayTasksrules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ---------------------------------------------------------------
    // Helper Functions
    // ---------------------------------------------------------------
    
    function isAuth() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuth() && request.auth.uid == userId;
    }

    // Checks if the user belongs to the tenant specified in the document
    function isTenantMember(tenantId) {
      return isAuth() && (
        tenantId == null || 
        request.auth.token.tenantId == tenantId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId
      );
    }

    // Checks if the user is the owner of the document
    function isDocOwner(resource) {
      return isAuth() && resource.data.ownerId == request.auth.uid;
    }

    // Checks if the document is public to the tenant
    function isTenantPublic(resource) {
      return resource.data.access == 'public' && isTenantMember(resource.data.tenantId);
    }
    
    // Checks if the document is universal (read-only for most)
    function isUniversal(resource) {
        return resource.data.type == 'universal' || resource.data.isUniversal == true;
    }

    // Checks if the user is a super admin
    function isSuper() {
      return isAuth() && (
        (request.auth.token.roles.toSet().hasAny(['super']) && request.auth.token.tenantId == 'ilytat-hq') || 
        request.auth.token.email == 'admin@ilytat.com'
      );
    }

    function isAdmin() {
      return isAuth() && (request.auth.token.roles.toSet().hasAny(['admin']) || request.auth.token.role == 'admin');
    }

    // ---------------------------------------------------------------
    // 1. Core Collections (Flattened)
    // ---------------------------------------------------------------

    // Tenants
    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId) || isSuper();
      allow write: if isTenantMember(tenantId) || isSuper(); // Restrict to admin roles later
    }

    // Projects
    match /projects/{projectId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Goals (Flattened)
    match /goals/{goalId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Tasks (Flattened)
    match /tasks/{taskId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Notes (Flattened)
    match /notes/{noteId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Documents
    match /documents/{docId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || (isTenantMember(resource.data.tenantId) && resource.data.access != 'private') || isSuper();
      allow create: if isAuth(); // Creating new docs
    }

    // Quicklinks (Flattened)
    match /quicklinks/{linkId} {
      allow read: if isTenantMember(resource.data.tenantId) || isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isDocOwner(resource) || isSuper();
    }

    // Events (Dates)
    match /events/{eventId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || (isTenantMember(resource.data.tenantId) && resource.data.access != 'private') || isSuper();
      allow create: if isAuth();
    }

    // Quotes
    match /quotes/{quoteId} {
      allow read: if isUniversal(resource) || isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || isSuper(); // Universal quotes are managed by admins (via Admin SDK)
      allow create: if isAuth();
    }

    // ---------------------------------------------------------------
    // 2. Users & Personal
    // ---------------------------------------------------------------
    match /users/{userId} {
      allow read: if isAuth(); 
      allow write: if isOwner(userId) || isSuper();
      

      // Keep inbox nested as it's strictly personal
      match /inbox/{msgId} {
        allow read, write: if isOwner(userId); // Super admin shouldn't read personal inbox by default
      }

      // Finance Subcollections
      match /accounts/{itemId} {
        allow read, write: if isOwner(userId);
      }
      match /transactions/{itemId} {
        allow read, write: if isOwner(userId);
      }
      match /budgets/{itemId} {
        allow read, write: if isOwner(userId);
      }
    }

    // ---------------------------------------------------------------
    // 3. System & Shared
    // ---------------------------------------------------------------
    
    match /messages/{messageId} {
      allow read: if isAuth() && (resource.data.recipientUid == request.auth.uid || resource.data.senderId == request.auth.uid || isSuper());
      allow create: if isAuth();
      allow update, delete: if isSuper();
    }

    match /activity_logs/{logId} {
       allow read: if isAuth();
       allow write: if isAuth(); 
    }

    match /_lifecycle_ping/{docId} {
      allow read: if isAuth();
      allow write: if false; 
    }

    // ---------------------------------------------------------------
    // 4. Collection Groups (Recursive Wildcards)
    // ---------------------------------------------------------------
    // This allows queryAggregation (count) and cross-path queries
    
    match /{path=**}/tasks/{taskId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper(); 
    }

    match /{path=**}/goals/{goalId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    match /{path=**}/projects/{projectId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    match /{path=**}/documents/{docId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
    }
  }
}
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ---------------------------------------------------------------
    // Helper Functions
    // ---------------------------------------------------------------
    
    function isAuth() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuth() && request.auth.uid == userId;
    }

    // Checks if the user belongs to the tenant specified in the document
    function isTenantMember(tenantId) {
      return isAuth() && (
        tenantId == null || 
        request.auth.token.tenantId == tenantId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId
      );
    }

    // Checks if the user is the owner of the document
    function isDocOwner(resource) {
      return isAuth() && resource.data.ownerId == request.auth.uid;
    }

    // Checks if the document is public to the tenant
    function isTenantPublic(resource) {
      return resource.data.access == 'public' && isTenantMember(resource.data.tenantId);
    }
    
    // Checks if the document is universal (read-only for most)
    function isUniversal(resource) {
        return resource.data.type == 'universal' || resource.data.isUniversal == true;
    }

    // Checks if the user is a super admin
    function isSuper() {
      return isAuth() && (
        (request.auth.token.roles.toSet().hasAny(['super']) && request.auth.token.tenantId == 'ilytat-hq') || 
        request.auth.token.email == 'admin@ilytat.com'
      );
    }

    function isAdmin() {
      return isAuth() && (request.auth.token.roles.toSet().hasAny(['admin']) || request.auth.token.role == 'admin');
    }

    // ---------------------------------------------------------------
    // 1. Core Collections (Flattened)
    // ---------------------------------------------------------------

    // Tenants
    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId) || isSuper();
      allow write: if isTenantMember(tenantId) || isSuper(); // Restrict to admin roles later
    }

    // Projects
    match /projects/{projectId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Goals (Flattened)
    match /goals/{goalId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Tasks (Flattened)
    match /tasks/{taskId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Notes (Flattened)
    match /notes/{noteId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    // Documents
    match /documents/{docId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || (isTenantMember(resource.data.tenantId) && resource.data.access != 'private') || isSuper();
      allow create: if isAuth(); // Creating new docs
    }

    // Quicklinks (Flattened)
    match /quicklinks/{linkId} {
      allow read: if isTenantMember(resource.data.tenantId) || isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow create: if isAuth() && isTenantMember(request.resource.data.tenantId);
      allow update, delete: if isTenantMember(resource.data.tenantId) || isDocOwner(resource) || isSuper();
    }

    // Events (Dates)
    match /events/{eventId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || (isTenantMember(resource.data.tenantId) && resource.data.access != 'private') || isSuper();
      allow create: if isAuth();
    }

    // Quotes
    match /quotes/{quoteId} {
      allow read: if isUniversal(resource) || isDocOwner(resource) || isTenantPublic(resource) || isSuper();
      allow write: if isDocOwner(resource) || isSuper(); // Universal quotes are managed by admins (via Admin SDK)
      allow create: if isAuth();
    }

    // ---------------------------------------------------------------
    // 2. Users & Personal
    // ---------------------------------------------------------------
    match /users/{userId} {
      allow read: if isAuth(); 
      allow write: if isOwner(userId) || isSuper();
      

      // Keep inbox nested as it's strictly personal
      match /inbox/{msgId} {
        allow read, write: if isOwner(userId); // Super admin shouldn't read personal inbox by default
      }

      // Finance Subcollections
      match /accounts/{itemId} {
        allow read, write: if isOwner(userId);
      }
      match /transactions/{itemId} {
        allow read, write: if isOwner(userId);
      }
      match /budgets/{itemId} {
        allow read, write: if isOwner(userId);
      }
    }

    // ---------------------------------------------------------------
    // 3. System & Shared
    // ---------------------------------------------------------------
    
    match /messages/{messageId} {
      allow read: if isAuth() && (resource.data.recipientUid == request.auth.uid || resource.data.senderId == request.auth.uid || isSuper());
      allow create: if isAuth();
      allow update, delete: if isSuper();
    }

    match /activity_logs/{logId} {
       allow read: if isAuth();
       allow write: if isAuth(); 
    }

    match /_lifecycle_ping/{docId} {
      allow read: if isAuth();
      allow write: if false; 
    }

    // ---------------------------------------------------------------
    // 4. Collection Groups (Recursive Wildcards)
    // ---------------------------------------------------------------
    // This allows queryAggregation (count) and cross-path queries
    
    match /{path=**}/tasks/{taskId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper(); 
    }

    match /{path=**}/goals/{goalId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    match /{path=**}/projects/{projectId} {
      allow read: if isTenantMember(resource.data.tenantId) || isSuper();
    }

    match /{path=**}/documents/{docId} {
      allow read: if isDocOwner(resource) || isTenantPublic(resource) || isSuper();
    }
  }
}

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
