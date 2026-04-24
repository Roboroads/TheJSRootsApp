<script lang="ts">
	let { data } = $props();
</script>

<h1 class="text-2xl font-semibold text-slate-900">Panel overview</h1>
<p class="mt-2 text-slate-600">
	Authenticated users can browse users/events and manage their own attendance/profile.
</p>

<div class="mt-6 grid gap-4 sm:grid-cols-3">
	<div class="rounded-xl bg-white p-4 shadow-sm">
		<p class="text-sm text-slate-500">Users</p>
		<p class="mt-2 text-3xl font-semibold text-slate-900">{data.stats.users}</p>
	</div>
	<div class="rounded-xl bg-white p-4 shadow-sm">
		<p class="text-sm text-slate-500">Events</p>
		<p class="mt-2 text-3xl font-semibold text-slate-900">{data.stats.events}</p>
	</div>
	<div class="rounded-xl bg-white p-4 shadow-sm">
		<p class="text-sm text-slate-500">Attendances</p>
		<p class="mt-2 text-3xl font-semibold text-slate-900">{data.stats.attendances}</p>
	</div>
</div>
