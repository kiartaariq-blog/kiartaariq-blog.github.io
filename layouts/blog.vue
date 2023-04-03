<template>
    <div>
      <NuxtLink to="/blog">
        <p class="underline">Home</p>
      </NuxtLink>
      <h1 class="text-3xl">{{page.title}}</h1>
      <h3 class="text-xl">{{page.author}} @ {{page.createdAt}}</h3>

      <div class="prose">
        <slot />
      </div>
    </div>
</template>

<script setup>
const { next, prev, page } = useContent(); 
</script>
