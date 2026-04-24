<script lang="ts">
	import { resolve } from '$app/paths';

	let { data, children } = $props();
</script>

<div class="min-h-screen bg-slate-100">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<div>
				<p class="text-sm text-slate-500">Private Panel</p>
				<p class="text-lg font-semibold text-slate-900">
					Welcome, {data.user.firstName || data.user.name}
				</p>
			</div>
			<form method="post" action="/admin/signout">
				<button
					class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
				>
					Sign out
				</button>
			</form>
		</div>
		<nav class="mx-auto flex max-w-6xl gap-4 px-4 pb-4 text-sm font-medium">
			<a href={resolve('/admin')} class="text-slate-700 hover:text-slate-950">Overview</a>
			<a href={resolve('/admin/users')} class="text-slate-700 hover:text-slate-950">Users</a>
			<a href={resolve('/admin/events')} class="text-slate-700 hover:text-slate-950">Events</a>
			<a href={resolve('/admin/profile')} class="text-slate-700 hover:text-slate-950">My profile</a>
			<a href={resolve('/talents')} class="text-slate-700 hover:text-slate-950">Public talents</a>
			<a href={resolve('/events')} class="text-slate-700 hover:text-slate-950">Public events</a>
		</nav>
	</header>

	<main class="mx-auto max-w-6xl px-4 py-6">
		{@render children()}
	</main>
</div>
