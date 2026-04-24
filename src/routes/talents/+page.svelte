<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 py-8">
	<h1 class="text-3xl font-semibold text-slate-900">Talents</h1>
	<p class="mt-2 text-slate-600">Meet the people in the community.</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.talents as talent (talent.id)}
			<article class="rounded-xl bg-white p-4 shadow-sm">
				{#if talent.profilePicturePath}
					<img
						src={talent.profilePicturePath}
						alt={`${talent.firstName} ${talent.lastName}`}
						class="h-24 w-24 rounded-full border border-slate-200 object-cover"
					/>
				{:else}
					<div class="h-24 w-24 rounded-full bg-slate-200"></div>
				{/if}
				<h2 class="mt-3 text-lg font-semibold text-slate-900">
					{talent.firstName}
					{talent.lastName}
				</h2>
				<p class="mt-2 text-sm text-slate-600">{talent.aboutMyself || 'No bio yet.'}</p>
			</article>
		{/each}
	</div>
</div>
