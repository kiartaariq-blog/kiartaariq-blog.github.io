<template>
    <div>
    <slot />
		<div v-for="post in posts" :key="post._path">
			<NuxtLink :to="post._path">
				<h2>{{ post.title }}</h2>
			</NuxtLink>
			<p>{{ post.description }}</p>
		</div>
    </div>
</template>

<script setup>
const { data: posts } = await useAsyncData("posts", () => {
    return queryContent("blog/")
		.where({ _path: { $ne: "/blog" } })  // exclude content/blog/index.md
		.sort({ createdAt: -1 }) // sort by createdAt desc
		.only(['title','image','_path','description']) // only select these fields
        .find();
});
</script>
