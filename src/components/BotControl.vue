<script setup lang="ts">
import { useFeedMeStore } from '@/stores/feedMe'
import { Button } from '@/components/ui/button'

const store = useFeedMeStore()
</script>

<template>
  <div class="flex justify-end gap-4">
    <Button @click="store.addBot()" variant="secondary" class="py-0.5">
      + Bot
    </Button>
    <Button @click="store.removeBot()" variant="destructive" :disabled="store.bots.length === 0">
      - Bot
    </Button>
  </div>
</template>
