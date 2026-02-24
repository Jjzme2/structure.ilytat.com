import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DocumentUpload from '../../../client/components/ui/DocumentUpload.vue'

// Hoist the mock function
const { useR2Mock } = vi.hoisted(() => {
  return { useR2Mock: vi.fn() }
})

// Mock the module
vi.mock('../../../client/composables/useR2', () => ({
  useR2: useR2Mock
}))

describe('DocumentUpload.vue', () => {
  let uploading: any
  let error: any
  let uploadDocument: any

  beforeEach(() => {
    // Setup reactive state for each test
    uploading = ref(false)
    error = ref(null)
    uploadDocument = vi.fn()

    // Configure the mock to return our reactive state
    useR2Mock.mockReturnValue({
      uploading,
      error,
      uploadDocument
    })
  })

  it('renders with unique ID and label association', () => {
    const wrapper = mount(DocumentUpload)

    const input = wrapper.find('input[type="file"]')
    const label = wrapper.find('label')

    expect(input.exists()).toBe(true)
    expect(label.exists()).toBe(true)

    const id = input.attributes('id')
    expect(id).toBeDefined()
    // We expect the ID to be different from the hardcoded "document-upload" eventually
    // But for now, if I run this test against the CURRENT code, it will match "document-upload".
    // Wait, the plan is to change it. So I should assert what I EXPECT it to be (linked).

    expect(label.attributes('for')).toBe(id)
  })

  it('shows error message with accessible attributes when error exists', async () => {
    const wrapper = mount(DocumentUpload)

    // Simulate error
    error.value = 'File too large'
    await wrapper.vm.$nextTick()

    const errorMsg = wrapper.find('[role="alert"]')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('File too large')

    const input = wrapper.find('input[type="file"]')
    // In current implementation this will fail, which is good (TDD)
    expect(input.attributes('aria-invalid')).toBe('true')

    const describedBy = input.attributes('aria-describedby')
    expect(describedBy).toBeDefined()
    expect(errorMsg.attributes('id')).toBe(describedBy)
  })

  it('does not show error attributes when no error', async () => {
    const wrapper = mount(DocumentUpload)

    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('aria-invalid')).not.toBe('true')

    const errorMsg = wrapper.find('[role="alert"]')
    expect(errorMsg.exists()).toBe(false)
  })

  it('announces uploading state via aria-live', async () => {
    const wrapper = mount(DocumentUpload)

    // Simulate uploading
    uploading.value = true
    await wrapper.vm.$nextTick()

    // This will fail on current implementation
    const liveRegion = wrapper.find('[aria-live="polite"]')
    expect(liveRegion.exists()).toBe(true)
    expect(liveRegion.text()).toContain('Uploading...')
  })
})
