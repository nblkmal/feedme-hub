<script setup lang="ts">
import { ref } from 'vue'
import { useFeedMeStore, type OrderType, type MenuItem } from '@/stores/feedMe'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, User, Crown } from 'lucide-vue-next'

const store = useFeedMeStore()

const isOpen = ref(false)
const orderType = ref<OrderType>('normal')
const customerName = ref('')
const selectedItems = ref<MenuItem[]>([])

const menuOptions: { value: MenuItem; label: string; description: string }[] = [
  { value: 'Burger', label: 'Burger', description: 'Juicy beef patty with fresh veggies.' },
  { value: 'Fries', label: 'Fries', description: 'Crispy golden potato fries.' },
  { value: 'Fried Chicken', label: 'Fried Chicken', description: 'Crunchy and savory fried chicken.' },
]

function openDialog(type: OrderType) {
  orderType.value = type
  customerName.value = ''
  selectedItems.value = []
  isOpen.value = true
}

function toggleItem(item: MenuItem) {
  const index = selectedItems.value.indexOf(item)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

function submitOrder() {
  if (!customerName.value || selectedItems.value.length === 0) return
  
  store.addOrder(orderType.value, customerName.value, [...selectedItems.value])
  isOpen.value = false
}
</script>

<template>
  <Button @click="openDialog('normal')" variant="outline">
    <User class="mr-2 h-4 w-4" />
    New Normal Order
  </Button>
  <Button @click="openDialog('vip')" variant="default">
    <Crown class="mr-2 h-4 w-4" />
    New VIP Order
  </Button>

  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>New {{ orderType === 'vip' ? 'VIP' : 'Normal' }} Order</DialogTitle>
        <DialogDescription>
          Enter your details and select your menu items.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-6 py-4">
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="customerName" placeholder="John Doe" />
        </div>
        
        <div class="grid gap-2">
          <Label>Menu Selection</Label>
          <div class="grid gap-2">
            <label 
              v-for="option in menuOptions" 
              :key="option.value"
              class="text-sm leading-none font-medium select-none flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent"
              :class="{ 'border-primary bg-primary/5': selectedItems.includes(option.value) }"
              @click.prevent="toggleItem(option.value)"
            >
              <div 
                class="aspect-square size-4 shrink-0 rounded-full border shadow-xs flex items-center justify-center transition-colors"
                :class="selectedItems.includes(option.value) ? 'border-primary bg-primary text-primary-foreground' : 'border-input'"
              >
                <Check v-if="selectedItems.includes(option.value)" class="size-3" />
              </div>
              <div class="grid gap-1 font-normal">
                <div class="font-medium">{{ option.label }}</div>
                <div class="text-muted-foreground text-xs leading-snug text-balance">
                  {{ option.description }}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="submitOrder" :disabled="!customerName || selectedItems.length === 0">
          Submit Order
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
