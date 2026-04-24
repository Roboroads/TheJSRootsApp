<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<main class="min-h-screen bg-gradient-to-b from-slate-100 to-white px-4 py-16">
	<div class="mx-auto max-w-4xl">
		<p class="text-sm font-medium tracking-wider text-slate-500 uppercase">TheJSRoots App</p>
		<h1 class="mt-3 text-4xl font-semibold text-slate-900">Community talents and events</h1>
		<p class="mt-4 max-w-2xl text-slate-700">
			Explore talents and events publicly, or log in to access the private panel for attendance,
			profile management, and administration.
		</p>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			<a
				href={resolve('/auth/login')}
				class="rounded-xl bg-slate-900 px-5 py-4 text-center text-white shadow hover:bg-slate-700"
			>
				Private panel login
			</a>
			<a
				href={resolve('/talents')}
				class="rounded-xl bg-white px-5 py-4 text-center text-slate-900 shadow hover:bg-slate-50"
			>
				Talents
			</a>
			<a
				href={resolve('/events')}
				class="rounded-xl bg-white px-5 py-4 text-center text-slate-900 shadow hover:bg-slate-50"
			>
				Events
			</a>
		</div>
	</div>
</main>
