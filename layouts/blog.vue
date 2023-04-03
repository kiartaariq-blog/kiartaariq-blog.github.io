<template>
    <div>
      <h1>{{page.head.title}}</h1>
      <h3>{{page.author}} @ {{page.createdAt}}</h3>
      <slot />
    </div>
</template>

<script setup>
const { next, prev, page } = useContent(); 
</script>
