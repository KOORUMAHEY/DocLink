import { cn, getFridays } from '@/lib/utils'
import { format, addDays } from 'date-fns'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500') // tailwind merge
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base-class', isActive && 'active', isDisabled && 'disabled')).toBe('base-class active')
  })
})

describe('getFridays function', () => {
  it('should return 8 Fridays starting from the next Friday', () => {
    const fridays = getFridays()

    expect(fridays).toHaveLength(8)

    // Check that each item has value and label properties
    fridays.forEach(friday => {
      expect(friday).toHaveProperty('value')
      expect(friday).toHaveProperty('label')
      expect(typeof friday.value).toBe('string')
      expect(typeof friday.label).toBe('string')
    })

    // Check that the first Friday is actually a Friday
    const firstFriday = new Date(fridays[0].value)
    expect(firstFriday.getDay()).toBe(5) // 5 = Friday

    // Check that dates are exactly 7 days apart
    for (let i = 1; i < fridays.length; i++) {
      const current = new Date(fridays[i].value)
      const previous = new Date(fridays[i - 1].value)
      const diffTime = current.getTime() - previous.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      expect(diffDays).toBe(7)
    }
  })

  it('should format labels correctly', () => {
    const fridays = getFridays()
    const firstFriday = new Date(fridays[0].value)

    // The label should match the expected format
    expect(fridays[0].label).toBe(format(firstFriday, 'EEEE, MMMM do'))
  })
})