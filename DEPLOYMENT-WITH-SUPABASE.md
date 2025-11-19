# 🚀 Deploy PROMME to Internet with Supabase

## Complete Guide to Launch Your Site

---

## 📋 Overview

This guide will help you:
1. ✅ Push code to GitHub (username: shmudivel)
2. ✅ Deploy frontend to Netlify (FREE)
3. ✅ Setup database with Supabase (FREE)
4. ✅ Make site accessible on internet

**Total Time:** ~15 minutes
**Total Cost:** $0 (100% FREE!)

---

## 🎯 Step 1: Push to GitHub

### Create Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name:** `promme-website`
   - **Description:** "PROMME - Job portal for industrial sector"
   - **Visibility:** Public
   - **DO NOT** check "Initialize with README"
3. Click **"Create repository"**

### Push Your Code

Open Terminal and run:

```bash
# Navigate to project
cd /Users/dahaniglikovdarkhan/Documents/repos/vibeCodingPROMMEwebsiteDemo

# Add GitHub remote
git remote add origin https://github.com/shmudivel/promme-website.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ **Done!** Your code is now on GitHub at:
`https://github.com/shmudivel/promme-website`

---

## 🌐 Step 2: Deploy Frontend (Netlify)

### Deploy with Netlify

1. Go to: https://app.netlify.com
2. Sign up with your GitHub account (shmudivel)
3. Click **"New site from Git"**
4. Choose **GitHub**
5. Select **`shmudivel/promme-website`**
6. Build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `/`
7. Click **"Deploy site"**

### Your Site is Live! 🎉

- **URL:** `https://random-name-12345.netlify.app`
- **Change name:** Site settings → Site details → Change site name
  - Example: `promme-demo.netlify.app`

### Enable Auto-Deploy

✅ **Already enabled!** Every time you push to GitHub, Netlify automatically deploys your site.

---

## 💾 Step 3: Setup Database (Supabase)

### Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (shmudivel)
4. **FREE** - No credit card required!

### Create Database Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `promme-database`
   - **Database Password:** Create strong password (SAVE IT!)
   - **Region:** Choose closest to you (Europe recommended)
   - **Plan:** Free
3. Click **"Create new project"**
4. Wait ~2 minutes for setup

### Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy entire content from `database-migrations/001_initial_schema.sql`
4. Paste and click **"Run"**
5. Create another query
6. Copy content from `database-migrations/002_seed_data.sql`
7. Paste and click **"Run"**

✅ **Database tables created!**

### Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long key)
3. **SAVE THESE!**

### Setup Storage Buckets

1. Go to **Storage** in Supabase
2. Create these buckets:
   - **avatars** (for profile photos)
   - **resumes** (for CV files)
   - **videos** (for video CVs)
   - **company-logos** (for company images)

3. For each bucket, make it public:
   - Click bucket → Settings
   - Enable "Public bucket"

---

## 🔧 Step 4: Configure Your Site

### Update Config in Netlify

1. In Netlify dashboard, go to:
   - **Site settings** → **Build & deploy** → **Environment**
2. Click **"Add variable"**
3. Add these environment variables:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Update Local Config (Optional)

Edit `assets/js/config.js`:

```javascript
development: {
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key',
    USE_SUPABASE: true,
    ENABLE_MOCK_DATA: false,
    // ... other settings
}
```

Push changes:

```bash
git add .
git commit -m "Add Supabase configuration"
git push
```

Netlify will auto-deploy! ✨

---

## 🔐 Step 5: Setup Security (Row Level Security)

### Enable RLS in Supabase

1. Go to **Authentication** → **Policies**
2. For each table, click **"Enable RLS"**

### Add Basic Policies

Run in SQL Editor:

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Anyone can view active vacancies
CREATE POLICY "Public vacancies"
ON vacancies FOR SELECT
TO public
USING (status = 'active');

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
USING (auth.uid() = user_id);

-- Users can create applications
CREATE POLICY "Users can create applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their chats
CREATE POLICY "Users can view own chats"
ON chats FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = company_id);

-- Users can read messages in their chats
CREATE POLICY "Users can read own messages"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM chats 
        WHERE chats.id = messages.chat_id 
        AND (chats.user_id = auth.uid() OR chats.company_id = auth.uid())
    )
);
```

✅ **Security enabled!**

---

## ✅ Step 6: Test Everything

### Test Frontend

1. Visit your Netlify URL
2. Click around to ensure everything loads
3. Test on mobile (responsive design)

### Test Authentication

1. Click "Вход" (Login)
2. Try to register new account
3. Check email for verification
4. Try to login

### Test Database

Open browser console (F12) and run:

```javascript
// Test Supabase connection
console.log(SupabaseAuthService);

// Try to fetch vacancies
SupabaseVacanciesService.searchVacancies().then(result => {
    console.log('Vacancies:', result);
});
```

---

## 🎉 You're Live!

Your PROMME website is now:
- ✅ **Online** and accessible worldwide
- ✅ **Hosted** on Netlify (free, fast, secure)
- ✅ **Database** powered by Supabase
- ✅ **HTTPS** enabled (automatic)
- ✅ **Auto-deploy** on git push

---

## 📊 What You Have Now

### Frontend (Netlify)
- URL: `https://your-site.netlify.app`
- Auto-deploys from GitHub
- Free SSL/HTTPS
- Global CDN
- 100GB bandwidth/month (free tier)

### Backend (Supabase)
- PostgreSQL database
- User authentication
- File storage
- Real-time updates
- RESTful API
- 500MB database (free tier)
- 1GB file storage (free tier)

---

## 🔄 Making Updates

### Update Frontend

```bash
# Make changes to code
# Then:
git add .
git commit -m "Update feature X"
git push
```

Netlify automatically deploys in ~30 seconds!

### Update Database

1. Go to Supabase → SQL Editor
2. Run migrations or manual queries
3. Changes apply instantly

---

## 📱 Share Your Site

Your site is now live! Share it:

- Direct link: `https://your-site.netlify.app`
- Add custom domain (optional): See Netlify docs
- Social media
- Email signature
- Business cards

---

## 🎯 Next Steps

### Optional Enhancements

1. **Custom Domain:**
   - Buy domain (Namecheap, GoDaddy, reg.ru)
   - Add to Netlify (automatic SSL)

2. **Analytics:**
   - Add Google Analytics
   - Or use Netlify Analytics

3. **Email Notifications:**
   - Set up SendGrid or Mailgun
   - Use Supabase Edge Functions

4. **AI Features:**
   - Integrate OpenAI API
   - Resume parsing
   - Video generation

5. **Payment Processing:**
   - Add Stripe for premium features
   - Subscription plans

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Netlify** | 100GB bandwidth/month | $19/mo (Pro) |
| **Supabase** | 500MB DB, 1GB storage | $25/mo (Pro) |
| **GitHub** | Unlimited public repos | $4/mo (Private) |
| **Total** | **$0/month** | ~$50/mo (if scaled) |

**Perfect for:**
- MVP/Demo: FREE tier is enough
- Small business: FREE tier works
- Growing: Upgrade when needed ($25-50/mo)

---

## 🆘 Troubleshooting

### Site Not Loading
- Check Netlify deploy logs
- Verify all files pushed to GitHub
- Check browser console for errors

### Database Not Working
- Verify API keys in Netlify environment variables
- Check Supabase project is active
- Enable RLS policies

### Authentication Failing
- Check Supabase Auth settings
- Verify email settings
- Test with valid email address

### Files Not Uploading
- Check storage buckets exist
- Verify bucket policies
- Check file size (50MB max on free tier)

---

## 📚 Documentation

Detailed guides available:

- **SUPABASE-SETUP-GUIDE.md** - Complete Supabase setup
- **INTERNET-DEPLOYMENT-GUIDE.md** - All deployment options
- **QUICK-DEPLOY.md** - Fast deployment
- **DATABASE-SCHEMA.md** - Database structure
- **API-DOCUMENTATION.md** - API reference

---

## ✅ Final Checklist

Before announcing your site:

- [ ] Code pushed to GitHub
- [ ] Site deployed on Netlify
- [ ] Custom site name set
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Sample data loaded
- [ ] API keys configured
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Authentication tested
- [ ] Vacancies loading
- [ ] Mobile responsive
- [ ] No console errors
- [ ] HTTPS working
- [ ] Fast loading (<3 seconds)

---

## 🎊 Congratulations!

Your PROMME job portal is now live on the internet!

**Your sites:**
- Frontend: `https://your-site.netlify.app`
- Database: Supabase dashboard
- Code: `https://github.com/shmudivel/promme-website`

**Share your success!** 🎉

---

## 📞 Support

Need help?

- **Netlify:** https://docs.netlify.com
- **Supabase:** https://supabase.com/docs
- **GitHub:** https://docs.github.com
- **Community:** Search Stack Overflow

---

**Ready to launch? Follow the steps above!** 🚀

