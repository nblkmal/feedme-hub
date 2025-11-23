import { defineStore } from 'pinia'
import { ref } from 'vue'

export type OrderType = 'normal' | 'vip'
export type OrderStatus = 'pending' | 'processing' | 'complete'
export type BotStatus = 'idle' | 'processing'
export type MenuItem = 'Fries' | 'Burger' | 'Fried Chicken'

export interface Order {
  id: number
  type: OrderType
  status: OrderStatus
  createdAt: Date
  processedBy?: number // Bot ID
  customerName: string
  items: MenuItem[]
  preparedAt?: Date
  completedAt?: Date
}

export interface Bot {
  id: number
  status: BotStatus
  currentOrderId?: number
  remainingTime?: number // Seconds
}

export const useFeedMeStore = defineStore('feedMe', () => {
  // State
  const pendingOrders = ref<Order[]>([])
  const completeOrders = ref<Order[]>([])
  const bots = ref<Bot[]>([])
  const nextOrderId = ref(1)
  const nextBotId = ref(1)
  const processingOrders = ref<Order[]>([])

  // Actions
  function addOrder(type: OrderType, customerName: string, items: MenuItem[]) {
    const order: Order = {
      id: nextOrderId.value++,
      type,
      status: 'pending',
      createdAt: new Date(),
      customerName,
      items
    }

    if (type === 'vip') {
      // Insert after the last VIP order
      const lastVipIndex = pendingOrders.value.findLastIndex((o: Order) => o.type === 'vip')
      if (lastVipIndex === -1) {
        // No VIP orders, insert at beginning
        pendingOrders.value.unshift(order)
      } else {
        // Insert after last VIP
        pendingOrders.value.splice(lastVipIndex + 1, 0, order)
      }
    } else {
      // Normal orders go to the end
      pendingOrders.value.push(order)
    }

    tryAssignOrders()
  }

  function addBot() {
    const bot: Bot = {
      id: nextBotId.value++,
      status: 'idle',
    }
    bots.value.push(bot)
    tryAssignOrders()
  }

  function removeBot() {
    if (bots.value.length === 0) return

    const botToRemove = bots.value.pop()

    if (botToRemove && botToRemove.status === 'processing' && botToRemove.currentOrderId) {
      // Find the order
      const orderIndex = processingOrders.value.findIndex(o => o.id === botToRemove.currentOrderId)
      if (orderIndex !== -1) {
        const order = processingOrders.value[orderIndex]
        if (!order) return

        // Remove from processing
        processingOrders.value.splice(orderIndex, 1)
        
        // Reset status
        order.status = 'pending'
        order.processedBy = undefined
        order.preparedAt = undefined // Reset preparedAt since it's back to pending
        
        // Put back in pending (maintain priority)
        if (order.type === 'vip') {
             const lastVipIndex = pendingOrders.value.findLastIndex((o: Order) => o.type === 'vip')
             if (lastVipIndex === -1) {
                pendingOrders.value.unshift(order)
             } else {
                pendingOrders.value.splice(lastVipIndex + 1, 0, order)
             }
        } else {
            if (order.type === 'normal') {
                 const firstNormalIndex = pendingOrders.value.findIndex(o => o.type === 'normal')
                 if (firstNormalIndex === -1) {
                     pendingOrders.value.push(order)
                 } else {
                     pendingOrders.value.splice(firstNormalIndex, 0, order)
                 }
            }
        }
      }
    }
  }
  
  function processOrder(bot: Bot, order: Order) {
    bot.status = 'processing'
    bot.currentOrderId = order.id
    bot.remainingTime = 10
    
    order.status = 'processing'
    order.processedBy = bot.id
    order.preparedAt = new Date()
    
    // Move from pending to processing
    const index = pendingOrders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      pendingOrders.value.splice(index, 1)
      processingOrders.value.push(order)
    }

    // Start countdown
    const interval = setInterval(() => {
      // Check if bot still exists and is processing THIS order
      const currentBot = bots.value.find(b => b.id === bot.id)
      if (!currentBot || currentBot.currentOrderId !== order.id) {
        clearInterval(interval)
        return
      }

      if (currentBot.remainingTime && currentBot.remainingTime > 0) {
        currentBot.remainingTime--
      }
      
      if (currentBot.remainingTime === 0) {
        clearInterval(interval)
        completeOrder(bot, order)
      }
    }, 1000)
  }

  function completeOrder(bot: Bot, order: Order) {
    order.status = 'complete'
    order.completedAt = new Date()
    
    // Move from processing to complete
    const index = processingOrders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      processingOrders.value.splice(index, 1)
      completeOrders.value.push(order)
    }

    bot.status = 'idle'
    bot.currentOrderId = undefined
    bot.remainingTime = undefined
    tryAssignOrders()
  }

  function tryAssignOrders() {
    const idleBots = bots.value.filter(b => b.status === 'idle')
    
    idleBots.forEach(bot => {
      if (pendingOrders.value.length > 0) {
        const order = pendingOrders.value[0]
        if (order) {
             processOrder(bot, order)
        }
      }
    })
  }

  return {
    pendingOrders,
    processingOrders,
    completeOrders,
    bots,
    addOrder,
    addBot,
    removeBot
  }
})
