<script lang="ts">
	let { data, form } = $props();
</script>

<h1 class="text-2xl font-semibold text-slate-900">My profile</h1>
<p class="mt-2 text-slate-600">Edit your own details, profile picture and password.</p>

{#if form?.message}
	<p class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
{/if}

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<section class="rounded-xl bg-white p-4 shadow-sm">
		<h2 class="text-lg font-semibold text-slate-900">Profile details</h2>
		<form
			method="post"
			action="?/updateProfile"
			enctype="multipart/form-data"
			class="mt-4 space-y-3"
		>
			<input
				name="firstName"
				placeholder="First name"
				value={data.current?.firstName ?? ''}
				class="w-full rounded border border-slate-300 px-3 py-2"
			/>
			<input
				name="lastName"
				placeholder="Last name"
				value={data.current?.lastName ?? ''}
				class="w-full rounded border border-slate-300 px-3 py-2"
			/>
			<textarea
				name="aboutMyself"
				placeholder="About myself"
				class="w-full rounded border border-slate-300 px-3 py-2"
				>{data.current?.aboutMyself ?? ''}</textarea
			>
			<input
				type="file"
				name="profilePicture"
				accept="image/*"
				class="w-full rounded border border-slate-300 px-3 py-2"
			/>
			<button class="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
				>Save profile</button
			>
		</form>

		{#if data.current?.profilePicturePath}
			<img
				src={data.current.profilePicturePath}
				alt="Profile"
				class="mt-4 h-24 w-24 rounded-full border border-slate-200 object-cover"
			/>
		{/if}
	</section>

	<section class="rounded-xl bg-white p-4 shadow-sm">
		<h2 class="text-lg font-semibold text-slate-900">Change password</h2>
		<form method="post" action="?/changePassword" class="mt-4 space-y-3">
			<input
				type="password"
				name="currentPassword"
				required
				placeholder="Current password"
				class="w-full rounded border border-slate-300 px-3 py-2"
			/>
			<input
				type="password"
				name="newPassword"
				required
				placeholder="New password (min 8 chars)"
				class="w-full rounded border border-slate-300 px-3 py-2"
			/>
			<button class="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500"
				>Change password</button
			>
		</form>
	</section>
</div>
