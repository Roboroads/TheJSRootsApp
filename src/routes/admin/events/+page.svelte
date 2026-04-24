<script lang="ts">
	let { data, form } = $props();

	const attendeesForEvent = (eventId: number) => {
		return data.attendees.filter((attendee) => attendee.eventId === eventId);
	};

	const isSelf = (userId: string) => userId === data.currentUser.id;

	const canRemove = (userId: string) => data.currentUser.isAdmin || isSelf(userId);
</script>

<h1 class="text-2xl font-semibold text-slate-900">Events</h1>
<p class="mt-2 text-slate-600">
	Users can mark themselves present. Admins can CRUD events and manage any attendee.
</p>

{#if form?.message}
	<p class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
{/if}

<div class="mt-6 space-y-4">
	{#each data.events as evt (evt.id)}
		<article class="rounded-xl bg-white p-4 shadow-sm">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 class="text-lg font-semibold text-slate-900">{evt.title}</h2>
					<p class="mt-1 text-sm text-slate-600">{evt.description}</p>
					<p class="mt-2 text-xs text-slate-500">
						{new Date(evt.startsAt).toLocaleString()} - {new Date(evt.endsAt).toLocaleString()}
					</p>
				</div>
				<form method="post" action="?/attend" class="flex gap-2">
					<input type="hidden" name="eventId" value={evt.id} />
					<button
						class="rounded bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600"
					>
						I'm attending
					</button>
				</form>
			</div>

			<div class="mt-3 rounded-md bg-slate-50 p-3 text-sm">
				<p class="font-medium text-slate-700">Attendees</p>
				<ul class="mt-2 space-y-1 text-slate-600">
					{#each attendeesForEvent(evt.id) as attendee (attendee.userId)}
						<li class="flex items-center justify-between gap-2">
							<span>{attendee.firstName} {attendee.lastName} ({attendee.email})</span>
							{#if canRemove(attendee.userId)}
								<form method="post" action="?/unattend">
									<input type="hidden" name="eventId" value={evt.id} />
									<input type="hidden" name="userId" value={attendee.userId} />
									<button class="rounded bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
										>Remove</button
									>
								</form>
							{/if}
						</li>
					{/each}
					{#if !attendeesForEvent(evt.id).length}
						<li>No attendees yet.</li>
					{/if}
				</ul>
			</div>
		</article>
	{/each}
</div>

{#if data.currentUser.isAdmin}
	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		<section class="rounded-xl bg-white p-4 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">Create event</h2>
			<form method="post" action="?/createEvent" class="mt-4 space-y-3">
				<input
					name="title"
					required
					placeholder="Title"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<textarea
					name="description"
					required
					placeholder="Description"
					class="w-full rounded border border-slate-300 px-3 py-2"
				></textarea>
				<input
					type="datetime-local"
					name="startsAt"
					required
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					type="datetime-local"
					name="endsAt"
					required
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<button class="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
					>Create event</button
				>
			</form>
		</section>

		<section class="rounded-xl bg-white p-4 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">Update or delete event</h2>
			<form method="post" action="?/updateEvent" class="mt-4 space-y-3">
				<select name="id" required class="w-full rounded border border-slate-300 px-3 py-2">
					<option value="">Select event</option>
					{#each data.events as evt (evt.id)}
						<option value={evt.id}>{evt.title}</option>
					{/each}
				</select>
				<input
					name="title"
					required
					placeholder="Title"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<textarea
					name="description"
					required
					placeholder="Description"
					class="w-full rounded border border-slate-300 px-3 py-2"
				></textarea>
				<input
					type="datetime-local"
					name="startsAt"
					required
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					type="datetime-local"
					name="endsAt"
					required
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<button class="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500"
					>Update event</button
				>
			</form>

			<form method="post" action="?/deleteEvent" class="mt-4 flex gap-2">
				<select name="id" required class="w-full rounded border border-slate-300 px-3 py-2">
					<option value="">Select event to delete</option>
					{#each data.events as evt (evt.id)}
						<option value={evt.id}>{evt.title}</option>
					{/each}
				</select>
				<button class="rounded bg-rose-700 px-4 py-2 text-white hover:bg-rose-600">Delete</button>
			</form>
		</section>
	</div>

	<section class="mt-6 rounded-xl bg-white p-4 shadow-sm">
		<h2 class="text-lg font-semibold text-slate-900">Admin attendee management</h2>
		<form method="post" action="?/attend" class="mt-4 grid gap-3 md:grid-cols-3">
			<select name="eventId" required class="rounded border border-slate-300 px-3 py-2">
				<option value="">Event</option>
				{#each data.events as evt (evt.id)}
					<option value={evt.id}>{evt.title}</option>
				{/each}
			</select>
			<select name="userId" required class="rounded border border-slate-300 px-3 py-2">
				<option value="">User</option>
				{#each data.users as usr (usr.id)}
					<option value={usr.id}>{usr.firstName} {usr.lastName} ({usr.email})</option>
				{/each}
			</select>
			<button class="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
				>Add attendee</button
			>
		</form>
	</section>
{/if}
