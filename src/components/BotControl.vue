<script setup lang="ts">
import { useFeedMeStore } from '@/stores/feedMe'
import { Button } from '@/components/ui/button'

const store = useFeedMeStore()
</script>

<template>
  <div class="flex justify-between items-center gap-2 bg-gray-100 rounded-md p-2">
    <small class="pl-2 font-semibold">Bot Control</small>
    <div class="flex gap-2">
      <Button @click="store.addBot()" class="bg-white text-black hover:bg-gray-200">
        + Bot
      </Button>
      <Button @click="store.removeBot()" variant="destructive" :disabled="store.bots.length === 0">
        - Bot
      </Button>
    </div>
  </div>
</template>
