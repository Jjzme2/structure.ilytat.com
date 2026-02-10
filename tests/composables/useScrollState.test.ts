import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollState } from '../../client/composables/useScrollState'

// Mock the config module
vi.mock('~/config', () => ({
  config: {
    ui: {
      scrollThreshold: 20
    }
  }
}))

describe('useScrollState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Helper component to test the composable
  const TestComponent = defineComponent({
    setup() {
      return useScrollState()
    },
    template: '<div></div>'
  })

  it('should initialize with isScrolled as false', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.isScrolled).toBe(false)
  })

  it('should update isScrolled to true when scrolled past threshold', () => {
    const wrapper = mount(TestComponent)

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true })
    window.dispatchEvent(new Event('scroll'))

    // Fast-forward timers
    vi.runAllTimers()

    expect(wrapper.vm.isScrolled).toBe(true)
  })

  it('should update isScrolled to false when scrolled back up', () => {
    const wrapper = mount(TestComponent)

    // Scroll down first
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.runAllTimers()
    expect(wrapper.vm.isScrolled).toBe(true)

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.runAllTimers()

    expect(wrapper.vm.isScrolled).toBe(false)
  })
})
