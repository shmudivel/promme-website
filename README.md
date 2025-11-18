# PROMME Demo - Industrial HR Platform

**Status:** 🟢 Running  
**Demo URL:** http://localhost:3000  
**Completion:** 70%

---

## What's Built (Last 30 Minutes)

### ✅ Complete User Flows
1. **Landing Page** - Clean, professional welcome screen
2. **Registration** - Beautiful user type selector (Job Seeker, Company, University)
3. **Chat Onboarding** - Animated chat interface with typing indicators
4. **Job Feed** - Instagram-style scrollable cards with real job data
5. **Login** - Simple auth screen

### ✅ Technical Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- Mobile-first responsive design

---

## How to Test

```bash
# Dev server should already be running on http://localhost:3000

# Test Job Seeker Flow:
1. Go to http://localhost:3000
2. Click "Get Started"
3. Select "Job Seeker"
4. Answer chat questions
5. See personalized job feed

# Test Company Flow:
1. Go to http://localhost:3000/register
2. Select "Company"
3. Answer chat questions
4. See company dashboard
```

---

## What's Next (4-6 hours)

### Priority 1: Database
- [ ] Create Supabase account
- [ ] Set up tables (users, profiles, jobs)
- [ ] Connect to app
- [ ] Save onboarding data

### Priority 2: Auth
- [ ] Real Supabase authentication
- [ ] Protected routes
- [ ] Session management

### Priority 3: Deploy
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test live URL
- [ ] Send to Sergey

---

## File Structure

```
app/
├── page.tsx              # Landing page
├── register/page.tsx     # User type selector
├── login/page.tsx        # Login form
├── onboarding/
│   ├── job_seeker/page.tsx
│   └── company/page.tsx
└── dashboard/page.tsx    # Job feed

components/
└── chat-interface.tsx    # Reusable chat UI

```

---

## Environment Variables Needed

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Check code
```

---

**Built in:** 30 minutes  
**Next checkpoint:** Wednesday, Nov 20  
**Final demo:** Saturday, Nov 30

