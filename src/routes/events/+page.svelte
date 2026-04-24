<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 py-8">
	<h1 class="text-3xl font-semibold text-slate-900">Events</h1>
	<p class="mt-2 text-slate-600">Browse past, current and upcoming events.</p>

	<section class="mt-8">
		<h2 class="text-xl font-semibold text-emerald-800">Present</h2>
		<div class="mt-3 space-y-3">
			{#each data.present as evt (evt.id)}
				<a
					href={resolve(`/events/${evt.id}`)}
					class="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md"
				>
					<h3 class="font-semibold text-slate-900">{evt.title}</h3>
					<p class="text-sm text-slate-600">{evt.description}</p>
					<p class="mt-1 text-xs text-slate-500">Attendees: {evt.attendeeCount}</p>
				</a>
			{/each}
			{#if !data.present.length}
				<p class="text-sm text-slate-500">No current events.</p>
			{/if}
		</div>
	</section>

	<section class="mt-8">
		<h2 class="text-xl font-semibold text-blue-800">Upcoming</h2>
		<div class="mt-3 space-y-3">
			{#each data.upcoming as evt (evt.id)}
				<a
					href={resolve(`/events/${evt.id}`)}
					class="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md"
				>
					<h3 class="font-semibold text-slate-900">{evt.title}</h3>
					<p class="text-sm text-slate-600">{evt.description}</p>
					<p class="mt-1 text-xs text-slate-500">Attendees: {evt.attendeeCount}</p>
				</a>
			{/each}
			{#if !data.upcoming.length}
				<p class="text-sm text-slate-500">No upcoming events.</p>
			{/if}
		</div>
	</section>

	<section class="mt-8">
		<h2 class="text-xl font-semibold text-slate-700">Past</h2>
		<div class="mt-3 space-y-3">
			{#each data.past as evt (evt.id)}
				<a
					href={resolve(`/events/${evt.id}`)}
					class="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md"
				>
					<h3 class="font-semibold text-slate-900">{evt.title}</h3>
					<p class="text-sm text-slate-600">{evt.description}</p>
					<p class="mt-1 text-xs text-slate-500">Attendees: {evt.attendeeCount}</p>
				</a>
			{/each}
			{#if !data.past.length}
				<p class="text-sm text-slate-500">No past events yet.</p>
			{/if}
		</div>
	</section>
</div>
