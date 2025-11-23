<script setup lang="ts">
import OrderControls from './components/OrderControls.vue'
import OrderList from './components/OrderList.vue'
</script>

<template>
  <div class="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">FeedMe</h1>
      <p class="text-muted-foreground">McDonald's Automated Cooking Bot System</p>
    </header>

    <main class="max-w-5xl mx-auto space-y-8">
      <div class="flex gap-2 justify-end">
        <OrderControls />
      </div>
      <OrderList />
    </main>
  </div>
</template>

