import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import postgres from 'postgres';

const email = 'admin@example.com';
const password = 'admin';

const databaseUrl = process.env.DATABASE_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;
const origin = process.env.ORIGIN ?? 'http://localhost:5173';

if (!databaseUrl) {
	throw new Error('DATABASE_URL is required to run the admin seeder.');
}

if (!authSecret) {
	throw new Error('BETTER_AUTH_SECRET is required to run the admin seeder.');
}

const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	firstName: text('first_name').notNull().default(''),
	lastName: text('last_name').notNull().default(''),
	email: text('email').notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	isAdmin: boolean('is_admin').notNull().default(false),
	aboutMyself: text('about_myself').notNull().default(''),
	profilePicturePath: text('profile_picture_path').notNull().default(''),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull()
});

const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

const schema = { user, session, account, verification };
const client = postgres(databaseUrl);
const db = drizzle(client, { schema });

const auth = betterAuth({
	baseURL: origin,
	secret: authSecret,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 5
	}
});

try {
	const existing = await client`select id from "user" where email = ${email} limit 1`;
	if (existing.length > 0) {
		await client`delete from "user" where email = ${email}`;
	}

	await auth.api.signUpEmail({
		body: {
			email,
			password,
			name: 'Admin User',
			callbackURL: '/admin'
		}
	});

	await client`
		update "user"
		set
			is_admin = true,
			first_name = 'Admin',
			last_name = 'User',
			about_myself = 'Seeded administrator account',
			profile_picture_path = ''
		where email = ${email}
	`;

	console.log('Admin user seeded: admin@example.com / admin');
} finally {
	await client.end({ timeout: 5 });
}
