<template>
    <div>

      <h1 class="text-3xl">{{page.title}}</h1>
      <h3 class="text-xl">{{page.author}} @ {{page.createdAt}}</h3>

      <div v-if="page.toc"> 
        <h2 class="font-bold">Table of Content</h2>
        <ul 
          class="pl-3"
          v-if="toc && toc.links">
          <li v-for="link in toc.links" :key="link.text">
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ul>
      </div>

      <!--- <button @click="log()"> TOC </button> --->
      <div class="prose">
        <slot />
      </div>
    </div>
</template>

<script setup>
const {  toc, next, prev, page } = useContent(); 

function log() {
  console.log(toc)
}
</script>

