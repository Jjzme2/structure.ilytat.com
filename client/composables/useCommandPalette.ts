import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { CommandItem } from '~/types'

const isOpen = ref(false)
const searchQuery = ref('')
const commands = ref<CommandItem[]>([])

export const useCommandPalette = () => {
    const router = useRouter()

    const open = () => {
        isOpen.value = true
        searchQuery.value = ''
    }

    const close = () => {
        isOpen.value = false
        searchQuery.value = ''
    }

    const toggle = () => {
        if (isOpen.value) close()
        else open()
    }

    const register = (command: CommandItem) => {
        // Prevent duplicates
        if (!commands.value.some(c => c.id === command.id)) {
            commands.value.push(command)
        }
    }

    const filteredCommands = computed(() => {
        if (!searchQuery.value) return commands.value

        const query = searchQuery.value.toLowerCase()
        return commands.value.filter(cmd =>
            cmd.label.toLowerCase().includes(query) ||
            cmd.keywords.some(k => k.toLowerCase().includes(query))
        )
    })

    // Group commands by section
    const groupedCommands = computed(() => {
        const groups: Record<string, CommandItem[]> = {}
        filteredCommands.value.forEach(cmd => {
            if (!groups[cmd.section]) {
                groups[cmd.section] = []
            }
            groups[cmd.section]?.push(cmd)
        })
        return groups
    })

    return {
        isOpen,
        searchQuery,
        open,
        close,
        toggle,
        register,
        filteredCommands,
        groupedCommands
    }
}
