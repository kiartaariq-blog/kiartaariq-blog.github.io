<template>
    <div>
      <div class="prose">
        <slot />
      </div>
      <div v-for="post in posts" :key="post._path">
        <NuxtLink :to="post._path">
          <div class="my-5 p-4 bg-white rounded-lg">
              <h2 class="text-3xl text-slate-800 font-bold" >{{ post.title }}</h2>
              <p class="text-slate-500 font-medium mt-1">{{ post.description }}</p>
              <p class="text-slate-800 font-medium mt-5 mb-2">{{post.createdAt}} by {{post.author}}</p>
              <span v-for="tag in post.tags" :key="tag">
                <span class="mr-2 p-1 text-slate-500 bg-slate-50 font-lg
                rounded">{{tag}}</span>
              </span>
          </div>
        </NuxtLink>
      </div>
    </div>
</template>

<script setup>
const { data: posts } = await useAsyncData("posts", () => {
    return queryContent("/")
		.where({ _path: { $ne: "/blog" } })  // exclude content/blog/index.md
		.sort({ createdAt: -1 }) // sort by createdAt desc
		.only(['title','author', 'createdAt','_path','description', 'tags']) // only select these fields
        .find();
});
</script>
