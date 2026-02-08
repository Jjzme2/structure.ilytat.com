import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useDocument, useFirestore } from 'vuefire'
import type { UserProfile } from '~/types'

export const useUserProfile = () => {
    const user = useCurrentUser()
    const db = useFirestore()

    const profileDocRef = computed(() =>
        user.value ? doc(db, 'users', user.value.uid) : null
    )

    const { data: profile, pending, promise: profilePromise } = useDocument<UserProfile>(profileDocRef)

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user.value || !profileDocRef.value) return

        try {
            await updateDoc(profileDocRef.value, {
                ...data,
                updatedAt: serverTimestamp()
            })
        } catch (e: any) {
            // If document doesn't exist, set it (though it should usually exist on signup)
            if (e.code === 'not-found') {
                await setDoc(profileDocRef.value, {
                    uid: user.value.uid,
                    email: user.value.email,
                    createdAt: serverTimestamp(),
                    ...data
                })
            } else {
                throw e
            }
        }
    }

    // Helper to check roles
    const hasRole = (role: 'admin' | 'member' | 'viewer') => {
        if (!profile.value) return false
        // Check new roles array OR legacy role field
        return profile.value.roles?.includes(role) || profile.value.role === role
    }

    const isAdmin = computed(() => {
        const email = user.value?.email?.trim().toLowerCase()
        const uid = user.value?.uid
        console.log('[DEBUG] isAdmin check:', { email, uid })

        if (email === 'zettler.jj@ilytat.com' || email === 'jj@ilytat.com') return true
        if (uid === 'BoHGcwh2ApNQiJJIgjZWBC9hY8I3') return true

        return hasRole('admin')
    })

    return {
        profile,
        pending,
        profilePromise,
        updateProfile,
        hasRole,
        isAdmin
    }
}
