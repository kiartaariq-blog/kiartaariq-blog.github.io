<template>
    <div class="p-5">
    <div class="prose">
      <slot />
    </div>
		<div class="my-5" v-for="post in posts" :key="post._path">
			<NuxtLink :to="post._path">
				<h2 class="text-2xl underline">{{ post.title }}</h2>
			</NuxtLink>
			<p>{{ post.description }}</p>
		</div>
    </div>
</template>

<script setup>
const { data: posts } = await useAsyncData("posts", () => {
    return queryContent("/")
		.where({ _path: { $ne: "/" } })  // exclude content/blog/index.md
		.sort({ createdAt: -1 }) // sort by createdAt desc
		.only(['title','image','_path','description']) // only select these fields
        .find();
});
</script>
