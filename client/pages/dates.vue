<template>
  <div class="min-h-screen space-y-8 pb-20 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1
          class="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
          Schedule
        </h1>
        <p class="text-slate-500 font-medium tracking-wide">Corporate Calendar</p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Export Menu -->
        <div class="relative group/export">
          <button class="flex items-center gap-2 h-12 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-xs font-bold uppercase tracking-wider hidden md:block">Export</span>
          </button>
          <div class="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Export System</span>
            </div>
            <div class="p-2 space-y-1">
              <div v-for="fmt in ['json', 'yaml', 'xml', 'md', 'txt']" :key="fmt"
                class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors group/row">
                <span class="text-xs font-mono font-bold text-slate-400 group-hover/row:text-white">{{ fmt.toUpperCase() }}</span>
                <div class="flex gap-1">
                  <button @click="exportSchedules(fmt as any, 'download')" 
                    class="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                    title="Download">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  <button @click="exportSchedules(fmt as any, 'copy')" 
                    class="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    title="Copy to Clipboard">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="openAddModal(new Date().toISOString().split('T')[0])"
          class="group relative h-12 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <span class="relative z-10 flex items-center gap-2">
            <svg class="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule Event
          </span>
        </button>
      </div>
    </div>

    <!-- Upcoming List (Prioritized View) -->
    <div class="space-y-4">
      <h3 class="flex items-center gap-2 text-lg font-bold text-slate-400">
        <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
        Upcoming Agenda
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="date in upcomingDates.slice(0, 6)" :key="date.id"
          class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-4">
          <div class="h-10 w-10 rounded-lg flex items-center justify-center bg-slate-800 text-xl">
            {{ getEmoji(date.type) }}
          </div>
          <div>
            <div class="font-bold text-slate-200">{{ date.title }}</div>
            <div class="text-xs text-slate-500 font-mono">{{ formatDate(date.date) }} • {{
              getDaysAway(date.date) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Control -->
    <div class="flex items-center justify-between bg-glass border border-glass p-4 rounded-2xl">
      <button @click="changeMonth(-1)"
        class="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 class="text-xl font-bold text-slate-200 min-w-[200px] text-center">
        {{ currentMonthName }} {{ currentYear }}
      </h2>
      <button @click="changeMonth(1)"
        class="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-glass border border-glass rounded-3xl overflow-hidden shadow-2xl">
      <!-- Days Header -->
      <div class="grid grid-cols-7 border-b border-glass bg-slate-900/50">
        <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
          class="py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
          {{ day }}
        </div>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 auto-rows-[120px]">
        <div v-for="(day, idx) in calendarGrid" :key="idx" @click="handleDayClick(day)"
          class="relative border-b border-r border-glass p-2 transition-colors hover:bg-white/5 group cursor-pointer"
          :class="{ 'bg-slate-900/30': !day.isCurrentMonth, 'bg-slate-800/20': day.isToday }">

          <span class="text-sm font-bold block mb-1" :class="day.isToday ? 'text-cyan-400' : 'text-slate-500'">
            {{ day.date.getDate() }}
          </span>

          <!-- Events -->
          <div class="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
            <div v-for="event in day.events" :key="event.id" @click.stop="handleEventClick(event)"
              class="text-[10px] px-2 py-1 rounded-md font-bold truncate transition-all hover:scale-105 cursor-pointer border"
              :class="getEventColor(event)">
              {{ event.title }}
            </div>
          </div>

          <!-- Add Button Overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
            <span class="text-4xl font-black text-cyan-500">+</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interface Controller (Add/Edit Form) -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
          <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            {{ editingDate ? 'Edit Event' : 'Schedule New Event' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Event
                Label</label>
              <input type="text" v-model="form.title"
                class="block w-full rounded-xl bg-slate-800 border-slate-700 text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Event Title" required />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Context / Brief</label>
              <textarea v-model="form.description"
                class="block w-full rounded-xl bg-slate-800 border-slate-700 text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-24 resize-none"
                placeholder="Details for the public or private record..."></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Coordinates</label>
              <input type="date" v-model="form.date"
                class="block w-full rounded-xl bg-slate-800 border-slate-700 text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                required />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Classification</label>
              <select v-model="form.type"
                class="block w-full rounded-xl bg-slate-800 border-slate-700 text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all">
                <option value="event">General Event</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="deadline">Deadline</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div v-if="form.type === 'custom'" class="space-y-2">
              <input type="text" v-model="form.customType"
                class="block w-full rounded-xl bg-slate-800 border-slate-700 text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Custom Type Name" />
            </div>

            <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 group cursor-pointer" @click="form.isPublic = !form.isPublic">
              <div class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900" 
                :class="form.isPublic ? 'bg-cyan-500' : 'bg-slate-700'">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="form.isPublic ? 'translate-x-6' : 'translate-x-1'"></span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-200 uppercase tracking-widest">Public Event</span>
                <span class="text-[10px] text-slate-500">Visible on the HQ Landing Page feed</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeForm"
                class="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors font-bold">Cancel</button>
              <button v-if="editingDate && !editingDate.isDefault" type="button" @click="deleteDate(editingDate.id)"
                class="px-5 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors font-bold">Delete</button>
              <button v-if="!editingDate?.isDefault" type="submit"
                class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:brightness-110 shadow-lg transition-all">
                {{ editingDate ? 'Update' : 'Schedule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>


  </div>
</template>

<script setup lang="ts">
import { useDatesStore } from '~/stores/dates'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'
import { useCorporateCalendar, type CalendarEvent } from '~/composables/useCorporateCalendar'
import { useExport } from '~/composables/useExport'
import type { ImportantDate } from '~/types'

const user = useCurrentUser()
const db = useFirestore()
const store = useDatesStore()
const { exportSchedules: performExport } = useExport()
const { getAllCorporateEvents } = useCorporateCalendar()

const exportSchedules = (format: 'json' | 'yaml' | 'xml' | 'md' | 'txt', mode: 'download' | 'copy' = 'download') => {
  performExport(allEvents.value || [], format, mode)
}

// Calendar State
const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }) || '')

// Form State
const showForm = ref(false)
const editingDate = ref<any>(null)
const form = reactive({
  title: '',
  date: '',
  type: 'event',
  customType: '',
  isPublic: false,
  description: ''
})

// Data Fetching
const userDatesQuery = computed(() => {
  if (!user.value) return null
  return query(collection(db, 'dates'), where('userId', '==', user.value.uid))
})
const userDates = useCollection<ImportantDate>(userDatesQuery)

// Merged Events (Memoized for performance)
const allEvents = computed(() => {
  const corporate = getAllCorporateEvents(currentYear.value)
  // Also fetch prev/next year corporate events for edge cases
  const prevCorp = getAllCorporateEvents(currentYear.value - 1)
  const nextCorp = getAllCorporateEvents(currentYear.value + 1)

  const userEventsMapped = (userDates.value || []).map(d => ({
    ...d,
    id: d.id,
    isDefault: false
  }))

  return [...corporate, ...prevCorp, ...nextCorp, ...userEventsMapped]
})

// Calendar Grid Logic
const calendarGrid = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startOffset = firstDayOfMonth.getDay() // 0 (Sun) - 6 (Sat)
  const daysInMonth = lastDayOfMonth.getDate()

  const days = []

  // Previous Month Padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: isSameDate(d, new Date()),
      events: getEventsForDate(d)
    })
  }

  // Current Month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: isSameDate(d, new Date()),
      events: getEventsForDate(d)
    })
  }

  // Next Month Padding
  const remainingSlots = 42 - days.length // 6 rows * 7 cols
  for (let i = 1; i <= remainingSlots; i++) {
    const d = new Date(year, month + 1, i)
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: isSameDate(d, new Date()),
      events: getEventsForDate(d)
    })
  }

  return days
})

// Helpers
const isSameDate = (d1: Date, d2: Date) => {
  return (d1.toISOString().split('T')[0] || '') === (d2.toISOString().split('T')[0] || '')
}

const getEventsForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0] || ''
  return allEvents.value.filter(e => e.date === dateStr)
}

const getEventColor = (event: any) => {
  if (event.isDefault) {
    if (event.type === 'holiday') return 'bg-rose-500/10 border-rose-500/20 text-rose-500'
    if (event.type === 'tax') return 'bg-amber-500/10 border-amber-500/20 text-amber-500'
    return 'bg-blue-500/10 border-blue-500/20 text-blue-500'
  }
  // User events
  if (event.type === 'birthday') return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
  if (event.type === 'anniversary') return 'bg-pink-500/10 border-pink-500/20 text-pink-400'
  return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
}

const getEmoji = (type: string) => {
  switch (type) {
    case 'birthday': return '🧬'
    case 'anniversary': return '💞'
    case 'event': return '📡'
    case 'holiday': return '🎉'
    case 'tax': return '💸'
    case 'corporate': return '🏢'
    case 'deadline': return '⏰'
    default: return '📍'
  }
}

const upcomingDates = computed(() => {
  const today = new Date().toISOString().split('T')[0] || ''
  return allEvents.value
    .filter(d => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
})

const getDaysAway = (dateStr: string) => {
  const diff = Math.ceil((new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// Actions
const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
}

const openAddModal = (dateStr?: string) => {
  editingDate.value = null
  form.title = ''
  form.date = dateStr || (new Date().toISOString().split('T')[0] || '')
  form.type = 'event'
  form.customType = ''
  form.isPublic = false
  form.description = ''
  showForm.value = true
}

const handleDayClick = (day: any) => {
  openAddModal(day.date.toISOString().split('T')[0] || '')
}

const handleEventClick = (event: any) => {
  // If corporate event, maybe show read-only details or just preventing editing?
  // For now, let's allow "viewing" corporate events in the form but disable saving?
  // Or simpler: only edit if !isDefault
  editingDate.value = event
  form.title = event.title
  form.date = event.date
  form.isPublic = !!event.isPublic
  form.description = event.description || ''

  if (['birthday', 'anniversary', 'event', 'deadline'].includes(event.type)) {
    form.type = event.type
    form.customType = ''
  } else if (event.isDefault) {
    // Just show regular type for default events to display logic
    form.type = 'custom'
    form.customType = event.type.toUpperCase()
  } else {
    form.type = 'custom'
    form.customType = event.type
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingDate.value = null
}

const handleSubmit = async () => {
  if (editingDate.value?.isDefault) return // Guard against editing defaults

  const finalType = form.type === 'custom' ? (form.customType || 'event') : form.type
  try {
    if (editingDate.value) {
      console.log('Updating date:', editingDate.value.id, editingDate.value)
      if (!editingDate.value.id) {
        console.error('Missing ID for editingDate:', editingDate.value)
        return
      }
      await store.updateDate(editingDate.value.id, {
        title: form.title,
        date: form.date,
        type: finalType,
        isPublic: form.isPublic,
        description: form.description
      })
    } else {
      await store.addDate(form.title, form.date, finalType, form.isPublic, form.description)
    }
    closeForm()
  } catch (e) {
    console.error(e)
  }
}

const deleteDate = async (id: string) => {
  if (confirm('Delete this event?')) {
    await store.deleteDate(id)
    closeForm()
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}
</style>
