# Antigravity + Codex + GitHub + Cloudflare

## Architecture

GitHub is the shared source of truth.

- Antigravity edits a local clone on `antigravity/*` branches.
- Codex works on `codex/*` branches or through Codex cloud.
- GitHub pull requests are the handoff and review boundary.
- Cloudflare builds and deploys the merged `main` branch.

Antigravity and Codex are not connected directly. This avoids shared-session conflicts and gives every change a reviewable Git history.

## Repository

- GitHub repository: `hoopwithherbasketball-lab/elitegbb`
- Production application directory: `CONNECTGBB`
- Production branch: `main`
- Cloudflare project/Worker name: `connectgbb`

## Antigravity setup

Install and authenticate the GitHub CLI, then clone the repository:

```powershell
gh auth login
gh repo clone hoopwithherbasketball-lab/elitegbb
cd elitegbb
git switch main
git pull --ff-only
git switch -c antigravity/<task-name>
agy
```

Run Antigravity from the repository root so it loads `AGENTS.md`. Commit and push only the agent's task branch, then open a pull request into `main`.

## Codex setup

Connect the GitHub account and grant Codex access to `hoopwithherbasketball-lab/elitegbb`. Create the Codex environment for this repository. Use `codex/<task-name>` branches and open pull requests into `main`.

This repository already has GitHub access enabled for Codex.

## Cloudflare Git connection

In Cloudflare Workers & Pages:

1. Create or select the `connectgbb` project.
2. Connect the GitHub account `hoopwithherbasketball-lab`.
3. Grant the Cloudflare GitHub app access to `elitegbb`.
4. Select `hoopwithherbasketball-lab/elitegbb`.
5. Set the production branch to `main`.
6. Set the root directory to `CONNECTGBB`.
7. Use `npm run pages:build` as the build command.
8. Use `.open-next` as the build output directory.
9. Keep the Cloudflare project name equal to the `name` in `CONNECTGBB/wrangler.toml`: `connectgbb`.
10. Configure environment variables and secrets in Cloudflare project settings, never in Git.

If Cloudflare chooses Workers Builds instead of Pages, preserve the same repository, branch, and root-directory settings, then use its detected OpenNext configuration. Review the generated configuration pull request before merging it.

## Validation

From the repository root:

```bash
cd CONNECTGBB
npm ci
npm run lint
npm run build
npm run pages:build
```

The GitHub workflow at `.github/workflows/connectgbb-ci.yml` runs these checks on relevant pull requests and on pushes to `main`.

## Branch ownership

Never let Antigravity and Codex edit the same branch concurrently.

Use this handoff:

1. Agent creates its own branch.
2. Agent pushes a reviewable commit.
3. GitHub CI validates the branch.
4. Pull request is reviewed and merged.
5. Cloudflare builds and deploys `main`.
6. The other agent pulls the merged `main` before starting new work.

## Secrets

Keep these outside Git:

- Cloudflare API tokens and account IDs
- Supabase service-role keys
- Stripe secret keys and webhook secrets
- NextAuth secrets
- private OAuth credentials

Use Cloudflare environment settings for runtime values and GitHub Actions secrets only if a future deployment workflow explicitly requires them.
