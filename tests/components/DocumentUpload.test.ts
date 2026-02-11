import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DocumentUpload from '../../client/components/ui/DocumentUpload.vue'
import { ref } from 'vue'

// Mock useR2
vi.mock('~/composables/useR2', () => ({
  useR2: () => ({
    uploadDocument: vi.fn(),
    uploading: ref(false),
    error: ref(null)
  })
}))

describe('DocumentUpload', () => {
  it('has accessible file input', () => {
    const wrapper = mount(DocumentUpload)
    const input = wrapper.find('input[type="file"]')

    // Check if input exists
    expect(input.exists()).toBe(true)

    // Check if input is accessible (not hidden, but sr-only)
    // Initially this will fail because it has 'hidden' class
    expect(input.classes()).toContain('sr-only')
    expect(input.classes()).not.toContain('hidden')

    // Check label for focus styles
    const label = wrapper.find('label')
    // We check for partial class match or specific classes
    const classes = label.classes()
    const hasFocusRing = classes.some(c => c.startsWith('peer-focus:ring'))
    expect(hasFocusRing).toBe(true)
  })
})
