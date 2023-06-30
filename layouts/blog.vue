<template>
    <head>
    <!-- Other meta tags and head content here -->
    <meta name="google-site-verification" content="2koi5rkebY-RyuRXC71QRFhRAlOKft3MfX6eMdQAjwg" />
    <!-- Other head content here -->
    </head>
    <body>
        <!-- Rest of your HTML content -->
    </body>
    <div>

      <h1 class="text-3xl">{{page.title}}</h1>
      <h3 class="text-xl">{{page.author}} @ {{page.createdAt}}</h3>

      <div v-if="page.toc"> 
        <h2 class="font-black">Table of Content</h2>
        <ul 
          class="pl-3 font-thin"
          v-if="toc && toc.links">
          <li v-for="link in toc.links" :key="link.text">
            <a :href="`#${link.id}`">{{ link.text }}</a>

            <ul class="pl-3">
              <li v-for="child in link.children" :key="child.id">
                <a :href="`#${child.id}`">{{ child.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="prose">
        <slot />
      </div>
    </div>
</template>

<script setup>
const {  toc, next, prev, page } = useContent(); 
</script>

