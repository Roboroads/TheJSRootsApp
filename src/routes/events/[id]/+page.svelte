<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl px-4 py-8">
	<a href={resolve('/events')} class="text-sm font-medium text-blue-700 hover:text-blue-600"
		>Back to events</a
	>
	<h1 class="mt-3 text-3xl font-semibold text-slate-900">{data.event.title}</h1>
	<p class="mt-2 text-slate-600">{data.event.description}</p>
	<p class="mt-2 text-sm text-slate-500">
		{new Date(data.event.startsAt).toLocaleString()} - {new Date(
			data.event.endsAt
		).toLocaleString()}
	</p>

	<section class="mt-8">
		<h2 class="text-xl font-semibold text-slate-900">Attendees</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2">
			{#each data.attendees as attendee (attendee.userId)}
				<article class="rounded-xl bg-white p-4 shadow-sm">
					{#if attendee.profilePicturePath}
						<img
							src={attendee.profilePicturePath}
							alt={`${attendee.firstName} ${attendee.lastName}`}
							class="h-16 w-16 rounded-full border border-slate-200 object-cover"
						/>
					{/if}
					<h3 class="mt-2 font-semibold text-slate-900">
						{attendee.firstName}
						{attendee.lastName}
					</h3>
					<p class="text-sm text-slate-600">{attendee.aboutMyself || 'No bio available.'}</p>
				</article>
			{/each}
			{#if !data.attendees.length}
				<p class="text-sm text-slate-500">No attendees yet.</p>
			{/if}
		</div>
	</section>
</div>
