# EliteGBB / ConnectGBB Agent Instructions

## Source of truth

GitHub is the source of truth for this project. Antigravity and Codex must work from repository branches and exchange work through commits and pull requests. Do not edit the same branch from both agents at the same time.

## Primary application

The production application is `CONNECTGBB/`.

- Framework: Next.js 15 App Router
- Language: TypeScript
- Runtime target: Cloudflare
- Cloudflare adapter: `@opennextjs/cloudflare`
- Cloudflare configuration: `CONNECTGBB/wrangler.toml`
- Worker/project name: `connectgbb`

The root `frontend/` application is legacy. Do not make it the production deployment target unless the task explicitly concerns that application.

## Required workflow

1. Start from an up-to-date `main`.
2. Use one branch per task:
   - Codex: `codex/<task>`
   - Antigravity: `antigravity/<task>`
3. Keep unrelated user changes intact.
4. Run validation from `CONNECTGBB/`:
   - `npm ci`
   - `npm run lint`
   - `npm run build`
   - `npm run pages:build` for Cloudflare packaging
5. Open a pull request into `main`.
6. Merge only after CI passes and the diff is reviewed.

## Cloudflare

Cloudflare deploys merged GitHub code. Keep the Cloudflare Git integration pointed at this repository, with `CONNECTGBB` as the root directory and `main` as the production branch.

Do not commit account tokens, API tokens, service-role keys, signing secrets, or private environment files. Configure deployment values in Cloudflare project settings. Public browser configuration may be committed only when the application already treats it as public.

The Cloudflare project name must remain consistent with the `name` value in `CONNECTGBB/wrangler.toml`.

## Application contracts

Preserve the existing Supabase, authentication, Stripe, messaging, route, and data-access contracts. Do not weaken authorization or row-level security. Do not create duplicate clients or replace established service abstractions without a verified need.

## Coordination

Before editing, inspect the current branch, recent commits, open pull requests, and relevant files. If another agent has active changes in the same area, coordinate through a separate branch or wait for that pull request to merge.

Every final handoff must report:

- branch and pull request
- files changed
- validation commands and results
- deployment-impacting configuration changes
- genuine blockers
