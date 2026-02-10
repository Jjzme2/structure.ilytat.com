import { ref, onMounted, onUnmounted } from 'vue'
import { config } from '~/config'

export function useScrollState() {
  const isScrolled = ref(false)

  const handleScroll = () => {
    isScrolled.value = window.scrollY > config.ui.scrollThreshold
  }

  // Throttled scroll handler using requestAnimationFrame
  let ticking = false
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial check in case page is already scrolled
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isScrolled }
}
