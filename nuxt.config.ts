import highlighjs from "highlight.js"
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-content-assets', '@nuxt/content'],
  target: 'static',
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: [
        'remark-highlight.js',
        'remark-math'
      ],
      rehypePlugins: [
        'rehype-mathjax'
      ],
      toc: {
        depth:2,
        searchDepth:4,
      },
      anchorLinks: false,
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

