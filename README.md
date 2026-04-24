# The JS Roots App

A full-stack web application for managing users, events, and attendees with a comprehensive admin panel. Built with SvelteKit, better-auth, Drizzle ORM, and PostgreSQL.

## Features

- **User Management**: User profiles with customizable bios, profile pictures, and admin controls
- **Event Management**: Create, edit, and manage events with attendance tracking
- **Attendance Tracking**: Users can RSVP to events; admins can manage attendees
- **Public Directory**: Browse all users and upcoming/past events
- **Admin Panel**: Private dashboard for managing users, events, and personal profile
- **Authentication**: Email/password login with session management via better-auth
- **Docker Ready**: Multi-stage production build and docker-compose for local development
- **CI/CD**: GitHub Actions workflow for automated builds and Azure Container Registry deployment

## Tech Stack

- **Frontend**: SvelteKit 2.57.0 with Svelte 5 (runes), TypeScript 6.0.2
- **Styling**: Tailwind CSS 4.2.2 with forms and typography plugins
- **Authentication**: better-auth ~1.4.21 (emailAndPassword plugin)
- **Database**: PostgreSQL with Drizzle ORM 0.45.2
- **Runtime**: Node.js adapter for production
- **Deployment**: Docker + GitHub Actions + Azure Container Registry

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone and install dependencies**:
   ```sh
   npm install
   ```

2. **Start PostgreSQL and set up environment**:
   ```sh
   docker compose up -d
   ```
   This starts a PostgreSQL container at `localhost:5432` with credentials:
   - Username: `root`
   - Password: `mysecretpassword`
   - Database: `local`

3. **Set up environment variables**:
   Create a `.env.local` file in the project root:
   ```env
   DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"
   BETTER_AUTH_SECRET="your-secret-key-here"
   ```
   You can use any random string for `BETTER_AUTH_SECRET` (e.g., `openssl rand -base64 32`)

4. **Set up the database schema**:
   ```sh
   npm run db:push
   ```
   This applies all migrations to your local PostgreSQL database.

5. **Seed the admin account** (optional but recommended):
   ```sh
   npm run seed:admin
   ```
   This creates an admin account:
   - Email: `admin@example.com`
   - Password: `admin`

### Running Locally

Start the development server:
```sh
npm run dev
```

The app will be available at `http://localhost:5173`.

**With auto-open in browser**:
```sh
npm run dev -- --open
```

### Key npm Scripts

```sh
# Development
npm run dev              # Start dev server
npm run dev -- --open   # Start dev server and open in browser

# Database
npm run db:push         # Apply schema migrations
npm run db:pull         # Pull schema from database
npm run auth:schema     # Generate better-auth schema

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run check           # Type-check TypeScript
npm run format          # Format code with Prettier

# Seeding
npm run seed:admin      # Create admin@example.com / admin account

# Docker
docker compose up       # Start PostgreSQL in background
docker compose down     # Stop PostgreSQL
```

## Features Walkthrough

### Public Pages

- **`/`** - Landing page
- **`/talents`** - Directory of all users with profiles, pictures, and bios
- **`/events`** - List of all events grouped by status (upcoming, present, past) with attendee counts
- **`/events/[id]`** - Event detail page showing full info and list of attendees

### Authentication

- **`/auth/login`** - Email/password login form

### Admin Panel (`/admin`)

Protected routes requiring admin privileges:

- **`/admin`** - Dashboard overview with stats (total users, events, attendees)
- **`/admin/users`** - User management
  - View all users with profile info
  - Create new users (admin only)
  - Edit user details (admin only)
  - Delete users (admin only; cannot self-delete)
  
- **`/admin/events`** - Event management
  - View all events with attendee lists
  - Create new events (admin only)
  - Edit event details (admin only)
  - Delete events (admin only)
  - Manage attendance: admins can add/remove attendees; users can only toggle themselves
  
- **`/admin/profile`** - Personal profile management
  - Edit first name, last name, and bio
  - Upload profile picture (stored in `static/images/profile-pictures/`)
  - Change password

### Admin Seeder

To bootstrap admin accounts, use:
```sh
npm run seed:admin
```

You can also manually create additional admin users:
1. Login as admin
2. Go to `/admin/users` → "Create User"
3. Fill in email and password
4. Check the "Admin" checkbox before saving

## Deployment

### Prerequisites for Production Deployment

- Azure Container Registry (ACR) with credentials
- GitHub repository with the project code
- GitHub Secrets configured in your repo

### Setting Up GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add:

1. **`ACR_USERNAME`**: Your Azure Container Registry username
2. **`ACR_PASSWORD`**: Your Azure Container Registry password

### Deployment Process

The GitHub Actions workflow (`.github/workflows/docker-publish.yml`) automatically:
1. Triggers on push to the `main` branch
2. Builds the Docker image with multi-stage production build
3. Logs into your Azure Container Registry
4. Tags the image with `latest` and the commit SHA
5. Pushes to your ACR registry

**To deploy manually**:

1. **Build the Docker image**:
   ```sh
   docker build -t thesjsrootsapp:latest .
   ```

2. **Tag for your registry**:
   ```sh
   docker tag thesjsrootsapp:latest <your-registry>.azurecr.io/thesjsrootsapp:latest
   ```

3. **Push to ACR**:
   ```sh
   docker login -u <username> -p <password> <your-registry>.azurecr.io
   docker push <your-registry>.azurecr.io/thesjsrootsapp:latest
   ```

### Running the Production Container

```sh
docker run -p 3000:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e BETTER_AUTH_SECRET="your-secret" \
  -e NODE_ENV=production \
  <your-registry>.azurecr.io/thesjsrootsapp:latest
```

The app will listen on port 3000. Set `DATABASE_URL` and `BETTER_AUTH_SECRET` to match your production environment.

## Database Schema

### User Table
- `id`: Unique identifier
- `email`: User email (unique, login credential)
- `name`: Display name
- `firstName`, `lastName`: Name parts for profile
- `aboutMyself`: User bio
- `profilePicturePath`: Path to uploaded profile picture in `/static`
- `isAdmin`: Boolean flag for admin privileges
- `createdAt`, `updatedAt`: Timestamps

### Event Table
- `id`: Unique identifier
- `title`: Event name
- `description`: Event details
- `startsAt`, `endsAt`: Event timing
- `createdByUserId`: Admin who created the event
- `createdAt`, `updatedAt`: Timestamps

### Event Attendee Table
- Tracks which users are attending which events
- Unique constraint on (event_id, user_id) to prevent duplicates

## Troubleshooting

### Database Connection Issues

If you get a connection error:
1. Verify PostgreSQL is running: `docker compose ps`
2. Check `DATABASE_URL` in `.env.local`
3. Restart the container: `docker compose restart db`
4. Ensure port 5432 is not in use: `lsof -i :5432`

### Migration Errors

If you see schema mismatch errors:
```sh
npm run db:push      # Sync schema to database
npm run db:pull      # Pull current schema from database
```

### Build Errors

Check for TypeScript and ESLint errors:
```sh
npm run check        # TypeScript type-check
npm run lint         # ESLint validation
npm run build        # Full production build
```

### Admin Seeder Issues

The seeder uses a permissive password config just for bootstrapping. If it fails:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` and `BETTER_AUTH_SECRET` in `.env.local`
3. Review database logs: `docker compose logs db`

## Project Structure

```
src/
  lib/
    server/
      auth.ts              # better-auth configuration
      db/
        auth.schema.ts     # Generated auth tables (user, session, account, verification)
        schema.ts          # Custom event and event_attendee tables
  routes/
    /auth/login            # Login page
    /admin/                # Private admin panel (requires auth + admin flag)
    /talents               # Public user directory
    /events                # Public event listing
    /events/[id]           # Event detail page

static/
  images/
    profile-pictures/      # Uploaded user profile pictures

scripts/
  seed-admin.mjs           # Bootstrap admin account
```

## Development Tips

- **Create mock data**: Modify `scripts/seed-admin.mjs` to add more seed functions
- **Add new routes**: Use SvelteKit conventions in `src/routes/` with `+page.svelte` and `+page.server.ts`
- **Protect routes**: Use `requireAuth()` or `requireAdmin()` guards from `src/lib/server/guards.ts`
- **Query database**: Import from `src/lib/server/db/` for type-safe database access
- **Style with Tailwind**: Use Tailwind classes; typography and forms plugins are available

## License

MIT
