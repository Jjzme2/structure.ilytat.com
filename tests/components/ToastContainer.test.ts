import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastContainer from '../../client/components/ui/ToastContainer.vue'

// Mock the useToast composable
vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    toasts: [
      { id: '1', type: 'error', message: 'Error message' },
      { id: '2', type: 'success', message: 'Success message' },
      { id: '3', type: 'warning', message: 'Warning message' },
      { id: '4', type: 'info', message: 'Info message' }
    ],
    remove: vi.fn()
  })
}))

describe('ToastContainer Accessibility', () => {
  it('should render toasts with correct dynamic ARIA roles and live regions', () => {
    const wrapper = mount(ToastContainer, {
        global: {
            stubs: {
                TransitionGroup: false
            }
        }
    })

    const toasts = wrapper.findAll('.pointer-events-auto')
    expect(toasts).toHaveLength(4)

    // Error toast
    expect(toasts[0].attributes('role')).toBe('alert')
    expect(toasts[0].attributes('aria-live')).toBe('assertive')

    // Success toast
    expect(toasts[1].attributes('role')).toBe('status')
    expect(toasts[1].attributes('aria-live')).toBe('polite')

    // Warning toast
    expect(toasts[2].attributes('role')).toBe('alert')
    expect(toasts[2].attributes('aria-live')).toBe('assertive')

    // Info toast
    expect(toasts[3].attributes('role')).toBe('status')
    expect(toasts[3].attributes('aria-live')).toBe('polite')
  })

  it('should have aria-hidden on decorative icons and aria-label on close buttons', () => {
    const wrapper = mount(ToastContainer, {
        global: {
            stubs: {
                TransitionGroup: false
            }
        }
    })

    const icons = wrapper.findAll('span[aria-hidden="true"]')
    expect(icons).toHaveLength(4)

    const closeButtons = wrapper.findAll('button[aria-label="Close notification"]')
    expect(closeButtons).toHaveLength(4)
  })
})
