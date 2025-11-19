# 🔥 PROMME - Supabase Database Setup Guide

## Complete Database Setup with Supabase (FREE)

Supabase is a **FREE**, open-source Firebase alternative that provides:
- ✅ PostgreSQL Database
- ✅ Authentication
- ✅ Real-time subscriptions
- ✅ File storage
- ✅ RESTful API (auto-generated)
- ✅ Row-level security

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (username: shmudivel)
4. It's **FREE** - no credit card required!

### Step 2: Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `promme-database`
   - **Database Password:** (create a strong password - SAVE IT!)
   - **Region:** Choose closest to your users (e.g., Europe)
   - **Plan:** Free (0$ - 500MB database, 1GB file storage)
3. Click **"Create new project"**
4. Wait ~2 minutes for setup to complete

### Step 3: Get Your API Keys

1. In your project dashboard, go to:
   - **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **API Key (anon, public):** `eyJhbGc...` (long key)
3. **SAVE THESE!** You'll need them.

---

## 📊 Step 4: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the SQL from `database-migrations/001_initial_schema.sql`
4. Click **"Run"**
5. Repeat with `database-migrations/002_seed_data.sql` for sample data

### Option B: Using Table Editor (Visual)

1. Go to **Table Editor**
2. Click **"Create a new table"**
3. Create tables manually (see DATABASE-SCHEMA.md)

---

## 🔧 Step 5: Configure Your Website

### Update `assets/js/config.js`:

```javascript
const CONFIG = {
    development: {
        // Supabase Configuration
        SUPABASE_URL: 'https://your-project-id.supabase.co',
        SUPABASE_ANON_KEY: 'your-anon-key-here',
        
        // Keep existing config
        API_BASE_URL: 'http://localhost:3000/api',
        YANDEX_MAPS_API_KEY: 'your_yandex_key',
        ENABLE_MOCK_DATA: false, // Disable mock data!
        ENABLE_DEBUG: true,
        ENABLE_LOGGING: true,
    },
    
    production: {
        // Supabase Configuration
        SUPABASE_URL: 'https://your-project-id.supabase.co',
        SUPABASE_ANON_KEY: 'your-anon-key-here',
        
        API_BASE_URL: 'https://api.promme.ru/api',
        YANDEX_MAPS_API_KEY: 'your_yandex_key',
        ENABLE_MOCK_DATA: false,
        ENABLE_DEBUG: false,
        ENABLE_LOGGING: false,
    }
};
```

---

## 📝 Step 6: Update API Service

The `assets/js/supabase-client.js` file is ready to use!

It includes:
- ✅ Authentication (login, register, logout)
- ✅ User profiles
- ✅ Vacancies management
- ✅ Applications
- ✅ Chat/messaging
- ✅ File uploads (photos, videos, resumes)
- ✅ Real-time updates

---

## 🔐 Step 7: Enable Row Level Security (RLS)

Important for security! In Supabase:

1. Go to **Authentication** → **Policies**
2. For each table, click **"Enable RLS"**
3. Add policies (examples in SQL):

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Anyone can view vacancies
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
```

---

## 📤 Step 8: Setup File Storage

For photos, videos, resumes:

1. Go to **Storage** in Supabase
2. Create buckets:
   - **"avatars"** - for profile photos
   - **"resumes"** - for CV/resume files
   - **"videos"** - for video CVs
   - **"company-logos"** - for company images

3. Set bucket policies:

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

---

## 🧪 Step 9: Test Your Setup

### Test Authentication:

```javascript
// In browser console
const { data, error } = await supabaseClient.auth.signUp({
    email: 'test@example.com',
    password: 'password123',
});
console.log('Signup:', data, error);
```

### Test Database Query:

```javascript
// Fetch vacancies
const { data, error } = await supabaseClient
    .from('vacancies')
    .select('*')
    .limit(10);
console.log('Vacancies:', data, error);
```

### Test File Upload:

```javascript
// Upload file
const file = document.getElementById('fileInput').files[0];
const { data, error } = await supabaseClient.storage
    .from('avatars')
    .upload(`${userId}/avatar.jpg`, file);
console.log('Upload:', data, error);
```

---

## 🔄 Step 10: Enable Real-time Features

For live chat updates:

1. Go to **Database** → **Replication**
2. Enable replication for tables:
   - `messages`
   - `chats`
3. Now you can subscribe to changes:

```javascript
// Listen for new messages
const subscription = supabaseClient
    .from('messages')
    .on('INSERT', payload => {
        console.log('New message:', payload.new);
        displayNewMessage(payload.new);
    })
    .subscribe();
```

---

## 🌐 Deploy with Supabase + Netlify

### Environment Variables on Netlify:

1. In Netlify Dashboard:
   - Site settings → Build & deploy → Environment
2. Add variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

### Or use `.env` file locally:

Create `.env`:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Add to `.gitignore`:
```
.env
.env.local
```

---

## 📊 Supabase Dashboard Features

### Monitor Your App:

1. **Database** - View/edit tables
2. **Authentication** - Manage users
3. **Storage** - Browse uploaded files
4. **API Docs** - Auto-generated API reference
5. **Logs** - View all database queries
6. **Reports** - Usage statistics

---

## 🎯 Migration from Mock Data to Supabase

### Current State:
- Using mock data in `api-service.js`

### After Supabase Setup:
1. Set `ENABLE_MOCK_DATA: false` in config
2. All API calls will use Supabase
3. No backend server needed!

### Gradual Migration:
```javascript
// In api-service.js
async function getVacancies() {
    if (CONFIG.ENABLE_MOCK_DATA) {
        return mockVacancies; // Old way
    } else {
        return await SupabaseService.getVacancies(); // New way
    }
}
```

---

## 💰 Supabase Pricing (Free Tier)

**Free Forever Includes:**
- ✅ 500MB database space
- ✅ 1GB file storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ Social OAuth providers
- ✅ Email support

**Perfect for:**
- Development
- MVP/Demo
- Small to medium projects

**Upgrade Later:**
- Pro: $25/month (8GB database, 100GB storage)
- Team: Custom pricing

---

## 🔒 Security Best Practices

### 1. Never Expose Service Role Key
- Only use **anon key** in frontend
- Service role key = full database access (keep secret!)

### 2. Always Enable RLS
- Protects data at database level
- Even if someone has your anon key

### 3. Validate on Backend
- Add validation functions in Supabase
- Use PostgreSQL functions for complex logic

### 4. Use HTTPS Only
- Supabase provides HTTPS by default
- Never use HTTP in production

---

## 📚 Useful Supabase Features

### Email Authentication
```javascript
// Email + Password signup
await supabaseClient.auth.signUp({
    email: 'user@example.com',
    password: 'secure-password'
});

// Email verification automatic!
```

### Social Login (Google, GitHub, etc.)
```javascript
// Google OAuth
await supabaseClient.auth.signIn({
    provider: 'google'
});
```

### Password Reset
```javascript
await supabaseClient.auth.api.resetPasswordForEmail(
    'user@example.com'
);
```

### Edge Functions (Serverless)
- Write custom API endpoints
- Deploy TypeScript/JavaScript functions
- Perfect for AI features, email sending, etc.

---

## 🐛 Troubleshooting

### Can't Connect to Supabase?
- Check project URL is correct
- Verify anon key is copied correctly
- Check browser console for errors

### Database Queries Failing?
- Enable RLS policies
- Check user is authenticated
- Verify table names match schema

### Files Not Uploading?
- Check storage policies
- Verify bucket exists
- Check file size limits (50MB max on free tier)

### Real-time Not Working?
- Enable replication on tables
- Check subscription code
- Verify user has SELECT permission

---

## 📖 Resources

- **Supabase Docs:** https://supabase.com/docs
- **JavaScript Client:** https://supabase.com/docs/reference/javascript
- **SQL Reference:** https://www.postgresql.org/docs/
- **Community:** https://github.com/supabase/supabase/discussions

---

## ✅ Checklist

Before going live:

- [ ] Supabase project created
- [ ] Database tables created (run migrations)
- [ ] Sample data loaded (optional)
- [ ] API keys added to config.js
- [ ] Row Level Security enabled
- [ ] Storage buckets created
- [ ] Storage policies configured
- [ ] Authentication tested
- [ ] Database queries tested
- [ ] File uploads tested
- [ ] Environment variables set (Netlify)
- [ ] Mock data disabled in production

---

## 🎉 You're Done!

Your PROMME website now has:
- ✅ Real database (PostgreSQL)
- ✅ User authentication
- ✅ File storage
- ✅ Real-time chat
- ✅ RESTful API
- ✅ All FREE!

**No backend server needed!** Supabase handles everything.

---

## 🚀 Next Steps

1. **Test everything locally**
2. **Deploy to Netlify**
3. **Monitor in Supabase dashboard**
4. **Add more features as you grow**

**Questions?** Check Supabase docs or their Discord community!

