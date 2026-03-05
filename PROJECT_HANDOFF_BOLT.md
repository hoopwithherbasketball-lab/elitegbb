# Elite GBB Project Handoff Summary
## For bolt.new or Continued Development

---

## 1. Project Overview

**Elite GBB (HoopWithHer)** is a college basketball recruiting platform with three user roles:
- **Admin**: Manage pipeline, coaches, players, projects
- **Coach**: View player profiles, subscribe for access
- **Player**: Create profiles, purchase recruitment packages

**Tech Stack:**
- Frontend: React 19 + React Router + Tailwind CSS + shadcn/ui
- Backend: Cloudflare Functions (serverless)
- Database: Supabase (PostgreSQL)
- Auth: JWT-based custom authentication
- Hosting: Cloudflare Pages
- Build Tool: CRACO (Create React App Config Override)

---

## 2. Project Structure

```
/home/user/webapp/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── AdminLogin.js   # Admin auth
│   │   │   ├── AdminDashboard.js
│   │   │   ├── PipelineBoard.js # FIXED - Kanban board
│   │   │   ├── PlayerDirectory.js
│   │   │   ├── ProjectDetails.js
│   │   │   ├── CoachLogin.js
│   │   │   ├── CoachDashboard.js
│   │   │   ├── PlayerLogin.js
│   │   │   ├── PlayerProfile.js
│   │   │   ├── Landing.js      # Marketing page
│   │   │   ├── IntakeForm.js   # Player signup
│   │   │   └── SuccessPage.js
│   │   ├── components/ui/      # shadcn components
│   │   ├── context/
│   │   │   ├── AuthContext.js  # Admin auth
│   │   │   ├── CoachAuthContext.js
│   │   │   └── PlayerAuthContext.js
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities
│   │   └── App.js              # Router configuration
│   ├── build/                  # Production build output
│   └── .env.production         # Production env vars
│
├── functions/                  # Cloudflare Functions (API)
│   ├── api/
│   │   ├── health.js            # Health check endpoint
│   │   ├── auth/
│   │   │   ├── login.js         # Admin login
│   │   │   ├── me.js            # Get current user
│   │   │   └── setup.js         # Initial setup
│   │   ├── admin/
│   │   │   ├── dashboard/       # Admin stats
│   │   │   ├── pipeline/        # Pipeline board API
│   │   │   ├── players/         # Player management
│   │   │   └── coaches/         # Coach management
│   │   ├── coach/               # Coach APIs
│   │   ├── player/              # Player APIs
│   │   ├── coaches/             # Public coach list
│   │   ├── players/             # Public player list
│   │   └── projects/            # Project APIs
│   ├── utils/
│   │   └── jwt.js               # JWT verification
│   └── _routes.json             # Function routing rules
│
├── backend/                     # Legacy (if any)
├── scripts/                     # Utility scripts
├── wrangler.toml                # Cloudflare config
└── firebase.json                # Firebase config (legacy)
```

---

## 3. Working API Endpoints

### Authentication
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/health` | GET | Health check + user counts | No |
| `/api/auth/login` | POST | Admin login (email/password) | No |
| `/api/auth/me` | GET | Get current user info | Yes (JWT) |
| `/api/auth/setup` | POST | Create initial admin user | No |
| `/api/coach/login` | POST | Coach login | No |
| `/api/player/login` | POST | Player login | No |

### Admin APIs
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/admin/dashboard` | GET | Admin stats | Admin JWT |
| `/api/admin/pipeline` | GET | Pipeline board data | Admin JWT |
| `/api/admin/pipeline` | PATCH | Update project status | Admin JWT |
| `/api/admin/players` | GET | List all players | Admin JWT |
| `/api/admin/coaches` | GET | List all coaches | Admin JWT |

### Public/Coach/Player APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/coaches` | GET | Public coach directory |
| `/api/players` | GET | Public player directory |
| `/api/coach/dashboard` | GET | Coach dashboard data |
| `/api/player/profile` | GET/PUT | Player profile |

---

## 4. Database Schema (Supabase)

### Core Tables

**staff_users** (Admin users)
```sql
- id: uuid (PK)
- email: string (unique)
- name: string
- role: enum ('admin', 'editor')
- is_active: boolean
- created_at: timestamp
```

**coaches** (Coach accounts)
```sql
- id: uuid (PK)
- email: string (unique)
- name: string
- university: string
- is_verified: boolean
- is_active: boolean
- created_at: timestamp
```

**players** (Player profiles)
```sql
- id: uuid (PK)
- email: string (unique)
- player_name: string
- player_key: string (unique, URL-friendly)
- school: string
- primary_position: string
- grad_class: string (e.g., '2025')
- package_selected: enum ('elite_track', 'development', 'consultation')
- payment_status: enum ('pending', 'paid')
- is_active: boolean
- created_at: timestamp
```

**projects** (Pipeline items)
```sql
- id: uuid (PK)
- player_id: uuid (FK → players)
- status: enum ('pending', 'in_progress', 'review', 'completed', 'cancelled')
- created_at: timestamp
- completed_at: timestamp (nullable)
```

### Current Data Status
- ✅ staff_users: 1 admin (admin@hoopwithher.com)
- ✅ coaches: 1 test coach
- ✅ Database connection: Healthy

---

## 5. Environment Variables

### Cloudflare Pages (Production & Preview)
```bash
# Required - Supabase Connection
SUPABASE_URL=https://srrasrbsqajtssqlxoju.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycmFzcmJzcWFqdHNzcWx4b2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NDc5NDIsImV4cCI6MjA4NTIyMzk0Mn0._lp8BQqbN0XXEB_FrlF8ZEgZSdC5IWoVzMkt30LFlOM

# Required - JWT Signing
JWT_SECRET=<generate with: openssl rand -base64 32>

# Optional - Stripe Payments
STRIPE_API_KEY=sk_live_... (if using payments)
```

### Frontend Build (.env.production)
```bash
REACT_APP_BACKEND_URL=https://app.elitegbb.com
REACT_APP_API_URL=/api
REACT_APP_ENV=production
```

### Where to Set These
1. Go to https://dash.cloudflare.com
2. Navigate to: Pages → elitegbb-app → Settings → Environment variables
3. Set in BOTH Production and Preview sections
4. Redeploy after changes

---

## 6. Recent Fixes Applied

### ✅ Fixed: Blank Pipeline Screen
**Problem:** Frontend called `/api/admin/projects` but backend endpoint was `/api/admin/pipeline`. Also status values were mismatched.

**Solution:** Updated `frontend/src/pages/PipelineBoard.js`:
- Changed endpoint from `/api/admin/projects` → `/api/admin/pipeline`
- Updated PATCH request to send `{ project_id, status }`
- Added response flattening: `Object.values(pipelineData).flat()`
- Updated STATUSES array to match backend values

### ✅ Fixed: API Connection Issues
**Problem:** Empty `REACT_APP_BACKEND_URL` in `.env.production`

**Solution:** Set `REACT_APP_BACKEND_URL=https://app.elitegbb.com`

### ✅ Fixed: Supabase Auth
**Problem:** Invalid `SUPABASE_ANON_KEY` in Cloudflare environment

**Solution:** Updated with correct key from Supabase dashboard

---

## 7. Deployment Process

### To Deploy Changes:
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "description of changes"
   git push origin main
   ```

2. **Trigger Cloudflare Build:**
   - Go to https://dash.cloudflare.com → Pages → elitegbb-app
   - Click "Deployments" tab
   - Click "Create new deployment"
   - Select "main" branch
   - Click "Save and Deploy"

3. **Wait for Build:** (~2-3 minutes)
   - Building → Deploying → Active

4. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)
   - Or: DevTools → Network → Disable cache → Reload

### Build Output Location
- Frontend builds to: `frontend/build/`
- Cloudflare serves from: `frontend/build/` (set in wrangler.toml)

---

## 8. Testing & Verification

### Health Check
```bash
curl https://app.elitegbb.com/api/health
```
Should return: `{"status": "healthy", "users": {"staff_users": 1, "coaches": 1}}`

### Login Test
```bash
curl -X POST https://app.elitegbb.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hoopwithher.com","password":"AdminPass123!"}'
```
Should return JWT token and user object.

### Pipeline API Test (with auth)
```bash
# First get token
TOKEN=$(curl -s -X POST https://app.elitegbb.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hoopwithher.com","password":"AdminPass123!"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Then test pipeline
curl https://app.elitegbb.com/api/admin/pipeline \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank screen after login | Old JS bundle cached | Hard refresh (Ctrl+Shift+R) |
| "No routes matched" warning | Missing /login route | Use /admin/login instead |
| API returns HTML not JSON | Wrong endpoint or auth failure | Check endpoint URL and JWT token |
| 401 Unauthorized | Missing/invalid JWT | Check getAuthHeaders() in request |
| Pipeline shows no projects | Empty database or wrong status mapping | Check projects table has data with correct status values |

---

## 10. Key Files for Common Changes

| Task | File(s) |
|------|---------|
| Add new API endpoint | `functions/api/<path>/index.js` |
| Add new page | `frontend/src/pages/<PageName>.js` |
| Add route | `frontend/src/App.js` (add Route component) |
| Change pipeline columns | `frontend/src/pages/PipelineBoard.js` (STATUSES array) |
| Update auth logic | `frontend/src/context/AuthContext.js` |
| Change database query | `functions/api/<endpoint>/index.js` (supabaseQuery function) |
| Environment variables | Cloudflare Dashboard + `frontend/.env.production` |

---

## 11. GitHub Repository

**URL:** https://github.com/lrevell8-arch/elitegbb

**To clone in bolt.new:**
```bash
git clone https://github.com/lrevell8-arch/elitegbb.git
cd elitegbb
npm install  # (in both root and frontend directories)
```

---

## 12. Live URLs

| Environment | URL |
|-------------|-----|
| Production App | https://app.elitegbb.com |
| Admin Login | https://app.elitegbb.com/admin/login |
| Pipeline | https://app.elitegbb.com/admin/pipeline |
| Health API | https://app.elitegbb.com/api/health |

---

## 13. Test Credentials

**Admin Account:**
- Email: `admin@hoopwithher.com`
- Password: `AdminPass123!`

**Coach Account:**
- Email: `coach@university.edu`
- Password: (check database or use reset flow)

---

## 14. Next Steps / Potential Improvements

1. **Add real data:** Create player projects via intake form
2. **Email integration:** Connect SendGrid/Postmark for notifications
3. **File uploads:** Implement image/document upload to Supabase Storage
4. **Stripe:** Complete payment flow integration
5. **Search/Filter:** Add search to player directory
6. **Mobile responsiveness:** Test and optimize for mobile
7. **Error handling:** Add Sentry or similar error tracking

---

**Last Updated:** 2026-03-05
**Status:** Pipeline page fixed and working ✅
