<script setup lang="ts">
import { useFeedMeStore } from '../stores/feedMe'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import BotControl from './BotControl.vue'
import { Badge } from '@/components/ui/badge'
import { computed } from 'vue'
import { Clock, Bot, CheckCircle } from 'lucide-vue-next'
import OrderControls from './OrderControls.vue'

const store = useFeedMeStore()

const formatTime = (date?: Date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(date)
}

const botSummary = computed(() => {
  const total = store.bots.length
  const processing = store.bots.filter(b => b.status === 'processing').length
  const idle = total - processing
  return { total, processing, idle }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
    <!-- Pending Orders -->
    <Card class="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Clock class="h-5 w-5" />
            <span>PENDING</span>
          </div>
          <Badge variant="outline">{{ store.pendingOrders.length }}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent class="flex-1 overflow-y-auto">
        <TransitionGroup name="list" tag="ul" class="space-y-2 relative">
          <li v-for="order in store.pendingOrders" :key="order.id" 
              class="p-3 border rounded-md flex justify-between items-center bg-card shadow-sm transition-all duration-300">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-lg font-bold">#{{ order.id }}</span>
                    <span class="font-semibold">{{ order.customerName }}</span>
                </div>
                <span class="text-xs text-muted-foreground">{{ order.items.join(', ') }}</span>
                <span class="text-[10px] text-muted-foreground/70">Created: {{ formatTime(order.createdAt) }}</span>
            </div>
            <Badge :variant="order.type === 'vip' ? 'default' : 'secondary'" class="uppercase w-16 justify-center">
              {{ order.type }}
            </Badge>
          </li>
          <li v-if="store.pendingOrders.length === 0" key="empty-pending" class="text-muted-foreground text-center py-4">
            No pending orders. Create order now
          </li>
        </TransitionGroup>
        <div v-if="store.pendingOrders.length === 0" class="flex flex-col justify-center gap-2 px-8">
          <OrderControls />
        </div>
      </CardContent>
    </Card>

    <!-- Processing & Complete Area -->
    <div class="flex flex-col gap-6 h-full overflow-hidden">
      <!-- Bots Status -->
      <Card class="shrink-0">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <Bot class="h-5 w-5" />
              <span>Cooking Bots</span>
            </div>
            <div class="flex gap-2 text-xs font-normal">
              <Badge variant="outline">Total: {{ botSummary.total }}</Badge>
              <Badge variant="secondary">Idle: {{ botSummary.idle }}</Badge>
              <Badge class="bg-green-500 text-white">Cooking: {{ botSummary.processing }}</Badge>
            </div>
          </CardTitle>
          <BotControl />
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
            <div v-for="bot in store.bots" :key="bot.id" 
                 class="p-2 border rounded-md text-center transition-all duration-300"
                 :class="bot.status === 'processing' ? 'bg-green-50 border-green-500 ring-1 ring-green-500/20 dark:bg-green-950/30' : 'bg-muted'">
              <div class="font-bold">Bot {{ bot.id }}</div>
              <div class="text-xs mt-1">
                <div v-if="bot.status === 'processing'" class="flex flex-col gap-1">
                  <span class="text-green-600 dark:text-green-400 font-semibold">Cooking #{{ bot.currentOrderId }}</span>
                  <span class="font-mono text-lg font-bold text-green-600 dark:text-green-400">{{ bot.remainingTime }}s</span>
                </div>
                <span v-else class="text-muted-foreground">IDLE</span>
              </div>
            </div>
            <div v-if="store.bots.length === 0" class="col-span-full text-center text-muted-foreground py-2">
              No bots active
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Complete Orders -->
      <Card class="flex flex-col flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <CheckCircle class="h-5 w-5 text-green-600 dark:text-green-400" />
              <span class="text-green-600 dark:text-green-400 font-semibold">COMPLETE</span>
            </div>
            <Badge variant="outline">{{ store.completeOrders.length }}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="flex-1 overflow-y-auto">
          <TransitionGroup name="list" tag="ul" class="space-y-2 relative">
            <li v-for="order in store.completeOrders.slice().reverse()" :key="order.id" 
                class="p-2 border rounded-md flex justify-between items-center opacity-75 transition-all duration-300">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-lg font-bold">#{{ order.id }}</span>
                    <span class="font-semibold">{{ order.customerName }}</span>
                </div>
                <span class="text-xs text-muted-foreground">{{ order.items.join(', ') }}</span>
                <div class="flex flex-col text-[10px] text-muted-foreground/70">
                  <span>Created: {{ formatTime(order.createdAt) }}</span>
                  <span v-if="order.preparedAt">Prepared: {{ formatTime(order.preparedAt) }}</span>
                  <span v-if="order.completedAt">Completed: {{ formatTime(order.completedAt) }}</span>
                </div>
            </div>
              <Badge :variant="order.type === 'vip' ? 'default' : 'secondary'" class="uppercase w-16 justify-center">
                {{ order.type }}
              </Badge>
            </li>
             <li v-if="store.completeOrders.length === 0" key="empty-complete" class="text-muted-foreground text-center py-4">
              No completed orders
            </li>
          </TransitionGroup>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%; /* Ensure width is maintained during leave */
}
</style>
