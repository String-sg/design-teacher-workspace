import { describe, it, expect } from 'vitest'
import { mockForms } from './mock-forms'

describe('mockForms', () => {
  it('has at least one form', () => {
    expect(mockForms.length).toBeGreaterThan(0)
  })

  it('active form has responses', () => {
    const active = mockForms.find((f) => f.status === 'active')
    expect(active).toBeDefined()
    expect(active!.responseCount).toBeGreaterThan(0)
  })

  it('response counts match responses array for detailed form', () => {
    const form = mockForms[0]
    const responded = form.responses.filter((r) => r.responded).length
    expect(responded).toBe(form.responseCount)
  })
})
