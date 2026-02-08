import type { UserProfile } from '~/types'

const isOpen = ref(false)
const recipient = ref<UserProfile | null>(null)
const initialSubject = ref('')

export const useMessageModal = () => {
    const open = (toUser: UserProfile | null, subject: string = '') => {
        recipient.value = toUser
        initialSubject.value = subject
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
        recipient.value = null
        initialSubject.value = ''
    }

    return {
        isOpen,
        recipient,
        initialSubject,
        open,
        close
    }
}
