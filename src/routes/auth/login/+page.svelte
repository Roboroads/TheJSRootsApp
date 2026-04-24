<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="min-h-screen bg-slate-100 px-4 py-16">
	<div class="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
		<h1 class="text-2xl font-semibold text-slate-900">Admin Login</h1>
		<p class="mt-2 text-sm text-slate-600">
			Use your email and password to access the private panel.
		</p>

		<form method="post" action="?/signInEmail" use:enhance class="mt-6 space-y-4">
			<label class="block">
				<span class="text-sm font-medium text-slate-700">Email</span>
				<input
					type="email"
					name="email"
					required
					class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-slate-700">Password</span>
				<input
					type="password"
					name="password"
					required
					class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
				/>
			</label>

			<button
				type="submit"
				class="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
			>
				Sign in
			</button>
		</form>

		{#if form?.message}
			<p class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
		{/if}
	</div>
</div>
