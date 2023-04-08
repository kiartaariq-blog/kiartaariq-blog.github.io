import highlighjs from "highlight.js"
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  target: 'static',
  content: {
    documentDriven: true,
    markdown: {
      toc: {
        depth:1,
        searchDepth:1,
      },
      remarkPlugins: [
        'remark-highlight.js',
        'remark-math'
      ],
      rehypePlugins: [
        'rehype-mathjax'
      ],
    },
  },
  css: [
    '~/assets/css/main.css',
    '~~/assets/css/code-block.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    prerender: {
      routes: ['/blog/']
    }
  }
})

