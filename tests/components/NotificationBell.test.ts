import { mount } from '@vue/test-utils'
import NotificationBell from '../../client/components/layout/NotificationBell.vue'
import { describe, it, expect, vi } from 'vitest'

import { ref } from 'vue'

// Mock the composable
vi.mock('~/composables/useInbox', () => ({
  useInbox: () => ({
    unreadCount: ref(3), // ref-like structure
    init: vi.fn()
  })
}))

describe('NotificationBell.vue', () => {
  it('renders correctly with aria-label', async () => {
    const wrapper = mount(NotificationBell)

    // Check if aria-label is correct
    expect(wrapper.attributes('aria-label')).toBe('Inbox, 3 unread messages')

    // Check if svg has aria-hidden
    const svg = wrapper.find('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')

    // Check if the span with unread count has aria-hidden
    const span = wrapper.find('span')
    expect(span.attributes('aria-hidden')).toBe('true')
  })
})
