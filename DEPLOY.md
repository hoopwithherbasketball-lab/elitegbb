# Deploy to Cloudflare Pages

## Quick Deploy (One Command)
```bash
cd /home/user/webapp && npx wrangler pages deploy
```

## What Gets Deployed
- ✅ API fixes (functions/api/players/index.js)
- ✅ Frontend build (frontend/build)
- ✅ Wrangler configuration
- ❌ Test files (tests/ - excluded automatically)
- ❌ .dev.vars (local only - excluded)

## Verify Secrets Are Set
Before deploying, ensure secrets are configured:

```bash
# Check current secrets
npx wrangler pages secret list

# Set if missing
npx wrangler pages secret put SUPABASE_ANON_KEY
npx wrangler pages secret put JWT_SECRET
```

## Test Production After Deploy
```bash
# Check production API
curl https://elitegbb-app.pages.dev/api/players

# Create test player on production
curl -X POST https://elitegbb-app.pages.dev/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "player_name": "Production Test",
    "dob": "2008-01-15",
    "grad_class": "2026",
    "gender": "Female",
    "school": "Test School",
    "city": "Atlanta",
    "state": "GA",
    "primary_position": "PG",
    "parent_name": "Test Parent",
    "parent_email": "test@example.com",
    "package_selected": "free"
  }'
```

## Deployment Checklist

### P0 — Required before launch
- [ ] Run `backend/community_schema.sql` in Supabase SQL Editor
- [ ] Cloudflare Pages production branch set to `main`
- [ ] Cloudflare Pages root directory is empty (repo root)
- [ ] Build output directory `frontend/build` (from `wrangler.toml`)
- [ ] Functions directory present (`/functions`)
- [ ] Env vars set in Cloudflare Pages (Preview + Production):
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `AWS_SES_REGION`
  - [ ] `AWS_SES_ACCESS_KEY_ID`
  - [ ] `AWS_SES_SECRET_ACCESS_KEY`
  - [ ] `APP_URL`
- [ ] Deploy: `npx wrangler pages deploy`

### P1 — Post-deploy validation
- [ ] Admin login works
- [ ] Coach login works
- [ ] Player login works
- [ ] Stripe checkout + webhook confirmed
- [ ] SES emails deliver (welcome + password reset)

### P2 — Cleanup & monitoring
- [ ] Fix redirect warning for `/* /index.html 200` if present
- [ ] Rotate test credentials if exposed
- [ ] Run `npm audit` and triage high-risk packages

### Existing checks
- [ ] Run local tests: `python3 tests/api/api_test_suite.py`
- [ ] Test production endpoint
- [ ] Verify no SCHEMA_CACHE_ERROR
