<script lang="ts">
	let { data, form } = $props();
</script>

<h1 class="text-2xl font-semibold text-slate-900">Users</h1>
<p class="mt-2 text-slate-600">
	All authenticated users can view users. Admins can create, edit and delete users.
</p>

{#if form?.message}
	<p class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
{/if}

<div class="mt-6 rounded-xl bg-white p-4 shadow-sm">
	<h2 class="text-lg font-semibold text-slate-900">User list</h2>
	<div class="mt-4 overflow-x-auto">
		<table class="min-w-full text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-500">
					<th class="px-2 py-2">Name</th>
					<th class="px-2 py-2">Email</th>
					<th class="px-2 py-2">Role</th>
					<th class="px-2 py-2">About</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as usr (usr.id)}
					<tr class="border-b border-slate-100 align-top">
						<td class="px-2 py-3">{usr.firstName} {usr.lastName}</td>
						<td class="px-2 py-3">{usr.email}</td>
						<td class="px-2 py-3">{usr.isAdmin ? 'Admin' : 'User'}</td>
						<td class="px-2 py-3 text-slate-600">{usr.aboutMyself || '-'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if data.currentUser.isAdmin}
	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		<section class="rounded-xl bg-white p-4 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">Create user</h2>
			<form method="post" action="?/createUser" class="mt-4 space-y-3">
				<input
					name="email"
					type="email"
					required
					placeholder="Email"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					name="password"
					type="password"
					required
					placeholder="Temporary password"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					name="firstName"
					placeholder="First name"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					name="lastName"
					placeholder="Last name"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<textarea
					name="aboutMyself"
					placeholder="About myself"
					class="w-full rounded border border-slate-300 px-3 py-2"
				></textarea>
				<label class="flex items-center gap-2 text-sm text-slate-700">
					<input type="checkbox" name="isAdmin" />
					Admin
				</label>
				<button class="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
					>Create user</button
				>
			</form>
		</section>

		<section class="rounded-xl bg-white p-4 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">Update or delete user</h2>
			<form method="post" action="?/updateUser" class="mt-4 space-y-3">
				<select name="id" required class="w-full rounded border border-slate-300 px-3 py-2">
					<option value="">Select user</option>
					{#each data.users as usr (usr.id)}
						<option value={usr.id}>{usr.email}</option>
					{/each}
				</select>
				<input
					name="firstName"
					placeholder="First name"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<input
					name="lastName"
					placeholder="Last name"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
				<textarea
					name="aboutMyself"
					placeholder="About myself"
					class="w-full rounded border border-slate-300 px-3 py-2"
				></textarea>
				<label class="flex items-center gap-2 text-sm text-slate-700">
					<input type="checkbox" name="isAdmin" />
					Admin
				</label>
				<button class="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500"
					>Update user</button
				>
			</form>

			<form method="post" action="?/deleteUser" class="mt-4 flex gap-2">
				<select name="id" required class="w-full rounded border border-slate-300 px-3 py-2">
					<option value="">Select user to delete</option>
					{#each data.users as usr (usr.id)}
						<option value={usr.id}>{usr.email}</option>
					{/each}
				</select>
				<button class="rounded bg-rose-700 px-4 py-2 text-white hover:bg-rose-600">Delete</button>
			</form>
		</section>
	</div>
{/if}
