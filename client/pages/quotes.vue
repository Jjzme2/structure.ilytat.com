<template>
  <div class="min-h-screen space-y-12 pb-20 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-amber-300 via-orange-500 to-rose-600">
          Inspiration
        </h1>
        <p class="text-slate-400 font-medium">
          {{ showFullCollection ? 'Exploring the complete library of wisdom' : 'Your curated daily selection' }}
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="showFullCollection = !showFullCollection"
          class="relative px-6 py-2.5 rounded-full font-bold transition-all duration-300 overflow-hidden group"
          :class="showFullCollection ? 'bg-slate-800 text-slate-300' : 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]'"
        >
          <span class="relative z-10 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="showFullCollection" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {{ showFullCollection ? 'Daily Set' : 'Full Collection' }}
          </span>
          <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>

        <button 
          @click="showAddForm = !showAddForm"
          class="h-11 w-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-amber-500 hover:border-amber-500/50 transition-all duration-300 group"
          :class="{ 'rotate-45 border-rose-500/50 text-rose-500': showAddForm }"
        >
          <svg class="w-6 h-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add/Edit Quote Form -->
    <Transition name="slide-down">
      <div v-if="showAddForm || editingQuote" class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div class="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-bold text-white">{{ editingQuote ? 'Update Wisdom' : 'Share Wisdom' }}</h2>
              <button @click="cancelEdit" type="button" class="text-slate-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <textarea
                v-model="form.text"
                rows="3"
                class="block w-full rounded-2xl bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500/20 sm:text-lg p-5 resize-none transition-all duration-300"
                placeholder="Type something that moves the soul..."
                required
              ></textarea>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <input
                  v-model="form.author"
                  type="text"
                  class="flex-grow rounded-2xl bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500/20 p-4 transition-all duration-300"
                  placeholder="The Author"
                />
                <button
                  type="submit"
                  :disabled="submitting || !form.text.trim()"
                  class="px-8 py-4 rounded-2xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-300"
                >
                  {{ editingQuote ? 'Update' : 'Add to Library' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Quotes Display -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div 
        v-for="quote in displayedQuotes" 
        :key="quote.id" 
        class="group relative"
      >
        <div class="absolute -inset-0.5 bg-gradient-to-br from-slate-800 to-slate-700 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
        <div class="relative h-full flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-[2rem] p-8 transition-all duration-500 overflow-hidden">
          <!-- Quote Icon decoration -->
          <div class="absolute -top-4 -left-4 text-slate-800/30 group-hover:text-amber-500/10 transition-colors duration-500">
            <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017L13.017 21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017L5.017 21H6.017Z" />
            </svg>
          </div>

          <blockquote class="relative z-10 flex-grow">
            <p class="text-2xl font-serif text-slate-200 leading-relaxed italic">
              {{ quote.text }}
            </p>
          </blockquote>

          <div class="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-slate-800/50">
            <cite class="not-italic">
              <span class="block text-sm font-bold text-amber-500 uppercase tracking-widest">{{ quote.author || 'Anonymous' }}</span>
              <span class="block text-xs text-slate-500 mt-1">Source: {{ quote.source || 'The Collective Memory' }}</span>
            </cite>
            
            <div class="flex gap-2">
              <button 
                @click="startEdit(quote)"
                class="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all duration-300"
                title="Refine Wisdom"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="deleteQuote(quote.id)"
                class="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-300"
                title="Discard Wisdom"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayedQuotes.length === 0" class="text-center py-24 group">
      <div class="inline-flex items-center justify-center p-8 rounded-full bg-slate-800/20 border-2 border-dashed border-slate-700 group-hover:border-amber-500/30 transition-all duration-500 mb-6">
        <svg class="w-12 h-12 text-slate-600 group-hover:text-amber-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p class="text-xl font-medium text-slate-500">The library is currently vast and empty.</p>
      <p class="text-slate-600 mt-2">Begin your collection by clicking the plus icon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuotesStore } from '~/stores/quotes'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'
import type { Quote } from '~/types'

const user = useCurrentUser()
const db = useFirestore()
const store = useQuotesStore()

const showFullCollection = ref(false)
const showAddForm = ref(false)
const editingQuote = ref<Quote | null>(null)
const submitting = ref(false)

const form = reactive({
  text: '',
  author: ''
})

// Fetch quotes for current user
const quotesQuery = computed(() => {
    if (!user.value) return null
    return query(
        collection(db, 'quotes'),
        where('userId', '==', user.value.uid)
    )
})

const userQuotes = useCollection<Quote>(quotesQuery)

// Logic for daily set (pick 3 quotes randomly based on the day)
const displayedQuotes = computed(() => {
    const all = userQuotes.value || []
    if (showFullCollection.value || all.length <= 3) return all

    // Simple deterministic random based on day
    const now = new Date()
    const isoDate = now.toISOString().split('T')[0]
    const seed = (isoDate || '').split('-').join('')
    const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000
        return x - Math.floor(x)
    }

    const shuffled = [...all].sort((a, b) => {
        const hashA = seededRandom(parseInt(seed) + (a.id?.length || 0))
        const hashB = seededRandom(parseInt(seed) + (b.id?.length || 0))
        return hashA - hashB
    })

    return shuffled.slice(0, 3)
})

const startEdit = (quote: Quote) => {
  editingQuote.value = quote
  form.text = quote.text
  form.author = quote.author
  showAddForm.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  editingQuote.value = null
  form.text = ''
  form.author = ''
}

const handleSubmit = async () => {
    if (!form.text.trim()) return
    submitting.value = true
    try {
        if (editingQuote.value) {
            await store.updateQuote(editingQuote.value.id, {
                text: form.text,
                author: form.author
            })
            editingQuote.value = null
        } else {
            await store.addQuote(form.text, form.author)
        }
        form.text = ''
        form.author = ''
        showAddForm.value = false
    } catch (e) {
        console.error(e)
    } finally {
        submitting.value = false
    }
}

const deleteQuote = async (id: string) => {
    if(confirm('Are you sure you want to discard this piece of wisdom?')) {
        await store.deleteQuote(id)
    }
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
