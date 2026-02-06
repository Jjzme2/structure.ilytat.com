import { signOut, type Auth } from 'firebase/auth'

class AuthService {
    private auth: Auth | null = null

    constructor(auth: Auth | null) {
        this.auth = auth
    }

    /**
     * Sign out the current user
     */
    async logout(): Promise<void> {
        if (!this.auth) return
        try {
            await signOut(this.auth)
        } catch (e) {
            console.error('AuthService: Logout failed', e)
            throw e
        }
    }
}

export const useAuthService = (auth: Auth | null) => new AuthService(auth)
