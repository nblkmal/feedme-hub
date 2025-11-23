<script setup lang="ts">
import OrderControls from './components/OrderControls.vue'
import OrderList from './components/OrderList.vue'
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 font-sans text-foreground relative overflow-hidden">
    <!-- Soft Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
    <div class="absolute inset-0 bg-gradient-to-tr from-cyan-100/60 via-transparent to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-tl from-amber-100/50 via-transparent to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-purple-100/40 to-transparent"></div>
    
    <!-- Dotted SVG Background Pattern -->
    <svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" class="text-cyan-300" />
          <circle cx="22" cy="22" r="1.5" fill="currentColor" class="text-purple-300" />
          <circle cx="32" cy="12" r="1" fill="currentColor" class="text-amber-300" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>

    <!-- Content -->
    <div class="relative z-10">
      <header class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">FeedMe</h1>
        <p class="text-muted-foreground">McDonald's Automated Cooking Bot System</p>
      </header>

      <main class="max-w-5xl mx-auto space-y-8 pb-16">
        <div class="flex gap-2 justify-end">
          <OrderControls />
        </div>
        <OrderList />
      </main>
    </div>
    <Analytics />

    <!-- Fixed Footer -->
    <footer class="fixed bottom-0 left-0 right-0 py-3 text-center text-sm text-muted-foreground bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t z-20">
      Made by Nabil Akmal
    </footer>
  </div>
</template>

