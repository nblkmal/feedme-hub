import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFeedMeStore } from './feedMe'

describe('FeedMe Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('adds normal orders to the end', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger'])
    store.addOrder('normal', 'Jane', ['Fries'])
    
    expect(store.pendingOrders).toHaveLength(2)
    expect(store.pendingOrders[0]!.id).toBe(1)
    expect(store.pendingOrders[1]!.id).toBe(2)
  })

  it('adds VIP orders before normal orders but after existing VIPs', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger']) // ID 1
    store.addOrder('vip', 'VIP1', ['Fried Chicken'])    // ID 2 -> Should be first
    store.addOrder('vip', 'VIP2', ['Burger'])    // ID 3 -> Should be second (after ID 2)
    store.addOrder('normal', 'Jane', ['Fries']) // ID 4 -> Should be last

    expect(store.pendingOrders.map(o => o.id)).toEqual([2, 3, 1, 4])
  })

  it('processes orders when bot is added', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger'])
    
    store.addBot()
    
    expect(store.pendingOrders).toHaveLength(0)
    expect(store.processingOrders).toHaveLength(1)
    expect(store.bots[0]!.status).toBe('processing')
    expect(store.processingOrders[0]!.preparedAt).toBeDefined()
  })

  it('completes order after 10 seconds', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger'])
    store.addBot()
    
    expect(store.processingOrders).toHaveLength(1)
    
    vi.advanceTimersByTime(10000)
    
    expect(store.processingOrders).toHaveLength(0)
    expect(store.completeOrders).toHaveLength(1)
    expect(store.bots[0]!.status).toBe('idle')
    expect(store.completeOrders[0]!.completedAt).toBeDefined()
  })

  it('bot picks up next order after completion', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger'])
    store.addOrder('normal', 'Jane', ['Fries'])
    store.addBot()
    
    // First order picked up
    expect(store.processingOrders[0]!.id).toBe(1)
    
    vi.advanceTimersByTime(10000)
    
    // First complete, second picked up
    expect(store.completeOrders).toHaveLength(1)
    expect(store.processingOrders).toHaveLength(1)
    expect(store.processingOrders[0]!.id).toBe(2)
  })

  it('removes bot and returns order to pending', () => {
    const store = useFeedMeStore()
    store.addOrder('normal', 'John', ['Burger'])
    store.addBot()
    
    expect(store.processingOrders).toHaveLength(1)
    
    store.removeBot()
    
    expect(store.bots).toHaveLength(0)
    expect(store.processingOrders).toHaveLength(0)
    expect(store.pendingOrders).toHaveLength(1)
    expect(store.pendingOrders[0]!.status).toBe('pending')
  })
  
  it('prioritizes returned VIP order correctly', () => {
      const store = useFeedMeStore()
      store.addOrder('normal', 'John', ['Burger']) // ID 1
      store.addOrder('vip', 'VIP1', ['Fried Chicken'])    // ID 2
      
      // Bot 1 picks up VIP (ID 2)
      store.addBot()
      expect(store.processingOrders[0]!.id).toBe(2)
      
      // Remove Bot 1, VIP (ID 2) should go back to pending
      store.removeBot()
      
      // Pending should have [ID 2 (VIP), ID 1 (Normal)]
      expect(store.pendingOrders.map(o => o.id)).toEqual([2, 1])
  })
})
