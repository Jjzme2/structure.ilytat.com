import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DocumentUpload from '../../client/components/ui/DocumentUpload.vue'
import { ref } from 'vue'

// Mock useR2 with alias path as used in component
vi.mock('~/composables/useR2', () => ({
  useR2: () => ({
    uploadDocument: vi.fn(),
    uploading: ref(false),
    error: ref(null)
  })
}))

describe('DocumentUpload', () => {
  it('renders correctly', () => {
    // Happy DOM environment required
    const wrapper = mount(DocumentUpload)
    expect(wrapper.exists()).toBe(true)
  })

  it('has sr-only class on input', () => {
    const wrapper = mount(DocumentUpload)
    const input = wrapper.find('input[type="file"]')
    expect(input.classes()).toContain('sr-only')
  })

  it('has peer-focus class on label', () => {
      const wrapper = mount(DocumentUpload)
      const label = wrapper.find('label')
      expect(label.classes().join(' ')).toContain('peer-focus:ring-2')
  })
})
