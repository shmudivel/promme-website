# PROMME - Internet Deployment Guide

## Make Your Website Accessible on the Internet

This guide shows you how to deploy the PROMME website so anyone can access it online.

---

## 🚀 Quick Start Options

### **Option 1: GitHub Pages (FREE & EASIEST)**
Best for: Quick testing, demo sites, static hosting

**Steps:**

1. **Push code to GitHub:**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - PROMME website"

# Create repository on GitHub, then:
git remote add origin https://github.com/your-username/promme-website.git
git branch -M main
git push -u origin main
```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at: `https://your-username.github.io/promme-website/`

3. **Custom Domain (Optional):**
   - Add a file named `CNAME` with your domain:
     ```
     www.promme.ru
     ```
   - Configure DNS at your domain registrar:
     ```
     Type: CNAME
     Name: www
     Value: your-username.github.io
     ```

**✅ Pros:** Free, easy, automatic HTTPS
**❌ Cons:** Static only, limited to frontend

---

### **Option 2: Netlify (FREE, RECOMMENDED)**
Best for: Production sites, automatic deployments, form handling

**Steps:**

1. **Sign up at Netlify:**
   - Go to https://netlify.com
   - Sign up with GitHub account

2. **Deploy from GitHub:**
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: (leave empty for static)
     - Publish directory: `/`
   - Click "Deploy site"

3. **Your site is live!**
   - Netlify gives you: `https://random-name-12345.netlify.app`
   - Change site name in Site settings → Site details

4. **Custom Domain:**
   - Go to Domain settings → Add custom domain
   - Follow DNS configuration instructions
   - Netlify provides free HTTPS automatically

**✅ Pros:** Free, fast CDN, auto-deploy on git push, free SSL
**❌ Cons:** None for static sites!

**Netlify CLI (Alternative):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

### **Option 3: Vercel (FREE)**
Best for: Fast deployment, similar to Netlify

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
# Navigate to your project
cd /path/to/promme-website

# Deploy
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? promme-website
# - Directory? ./
```

3. **Your site is live!**
   - Vercel gives you: `https://promme-website.vercel.app`

4. **Production deployment:**
```bash
vercel --prod
```

**✅ Pros:** Fast, free SSL, great performance
**❌ Cons:** None for static sites

---

### **Option 4: Firebase Hosting (FREE)**
Best for: Integration with Firebase services

**Steps:**

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Initialize:**
```bash
firebase init hosting

# Choose:
# - Create new project or use existing
# - Public directory: . (current directory)
# - Single-page app: No
# - GitHub deploys: No (for now)
```

4. **Deploy:**
```bash
firebase deploy
```

5. **Your site is live at:**
   - `https://your-project.web.app`
   - `https://your-project.firebaseapp.com`

**✅ Pros:** Google infrastructure, free SSL, fast
**❌ Cons:** Requires Firebase account

---

### **Option 5: Traditional Web Hosting**
Best for: Full control, existing hosting plan

**Hosting Providers:**
- **Hostinger** - $2-5/month
- **Bluehost** - $3-7/month
- **SiteGround** - $3-6/month
- **reg.ru** (Russia) - 100-300₽/month
- **Timeweb** (Russia) - 200-500₽/month

**Steps:**

1. **Get hosting account**
2. **Upload files via FTP:**
   - Use FileZilla or similar FTP client
   - Host: ftp.yourdomain.com
   - Upload all files to `public_html` or `www` folder

3. **Configure domain:**
   - Point your domain to hosting nameservers
   - Wait 24-48 hours for DNS propagation

**✅ Pros:** Full control, can add backend later
**❌ Cons:** Costs money, requires management

---

### **Option 6: DigitalOcean / VPS**
Best for: Full control, scalability, backend integration

**Steps:**

1. **Create Droplet:**
   - Go to DigitalOcean.com
   - Create account ($100 free credit available)
   - Create Droplet (Ubuntu 22.04)
   - Choose $5/month plan

2. **SSH into server:**
```bash
ssh root@your-server-ip
```

3. **Install Nginx:**
```bash
apt update
apt install nginx
ufw allow 'Nginx Full'
```

4. **Upload files:**
```bash
# On your computer
scp -r ./* root@your-server-ip:/var/www/promme/
```

5. **Configure Nginx:**
```bash
nano /etc/nginx/sites-available/promme
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/promme;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

6. **Enable site:**
```bash
ln -s /etc/nginx/sites-available/promme /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

7. **Install SSL (Let's Encrypt):**
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

**✅ Pros:** Full control, can add backend, scalable
**❌ Cons:** Requires technical knowledge, costs money

---

## 🌐 Domain Configuration

### Getting a Domain

**Domain Registrars:**
- **Namecheap** - $8-12/year (.com)
- **GoDaddy** - $10-15/year
- **reg.ru** (Russia) - 199₽/year (.ru)
- **Google Domains** - $12/year
- **Cloudflare** - At cost pricing

### DNS Configuration

After choosing a hosting option, configure DNS:

**For Netlify/Vercel:**
```
Type: A Record
Name: @
Value: (provided by hosting)

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**For VPS/Traditional Hosting:**
```
Type: A Record
Name: @
Value: your-server-ip

Type: A Record
Name: www
Value: your-server-ip
```

---

## 📋 Pre-Deployment Checklist

Before making your site public:

### 1. Update Configuration

Edit `assets/js/config.js`:
```javascript
const CONFIG = {
    production: {
        API_BASE_URL: 'https://api.promme.ru/api',  // Your real API
        YANDEX_MAPS_API_KEY: 'your_production_key',
        ENABLE_MOCK_DATA: false,
        ENABLE_DEBUG: false,
        ENABLE_LOGGING: false,
    }
};
```

Set environment:
```html
<script>
    window.PROMME_ENV = 'production';
</script>
```

### 2. Remove Development Files

```bash
# Remove development files
rm -f "README 2.md"
rm -f "promme-original.html"
rm -f *.mp4  # Large video files
```

### 3. Optimize Images

```bash
# Install optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin assets/images/* --out-dir=assets/images/
```

### 4. Test Locally

```bash
# Start local server
python3 -m http.server 8000

# Test in browser
open http://localhost:8000
```

Check:
- [ ] All pages load
- [ ] Links work
- [ ] Forms work (with mock data if backend not ready)
- [ ] Mobile responsive
- [ ] No console errors

### 5. Update Meta Tags

In `index.html`:
```html
<!-- Update with your actual domain -->
<meta property="og:url" content="https://promme.ru">
<meta property="og:title" content="PROMME - Портал для поиска работы">
<meta property="og:description" content="Найдите работу в промышленном секторе">
<meta property="og:image" content="https://promme.ru/assets/images/og-image.jpg">
```

---

## 🔧 Post-Deployment Tasks

### 1. Set Up Analytics

**Google Analytics:**
```html
<!-- Add to <head> in all HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Yandex Metrika:**
```html
<!-- Add to <head> in all HTML files -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(XXXXXXXX, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
```

### 2. Add robots.txt

Create `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://promme.ru/sitemap.xml
```

### 3. Create sitemap.xml

Create `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://promme.ru/</loc>
    <lastmod>2024-01-19</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://promme.ru/auth.html</loc>
    <lastmod>2024-01-19</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://promme.ru/vacancy.html</loc>
    <lastmod>2024-01-19</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 4. Set Up Monitoring

**UptimeRobot (Free):**
- Go to https://uptimerobot.com
- Add your site URL
- Get alerts if site goes down

**Pingdom:**
- Go to https://pingdom.com
- Monitor site speed and uptime

### 5. Enable HTTPS

All modern hosting options provide free SSL:
- **Netlify/Vercel/Firebase:** Automatic
- **VPS:** Use Let's Encrypt (see steps above)
- **Traditional Hosting:** Usually included, check cPanel

---

## 🎯 Recommended: Netlify Deployment (Detailed)

### Step-by-Step Netlify Deployment

1. **Create netlify.toml** in your project root:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. **Push to GitHub:**
```bash
git add .
git commit -m "Add Netlify configuration"
git push
```

3. **Deploy on Netlify:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Click "Deploy site"

4. **Configure domain:**
   - Go to Domain settings
   - Add your custom domain
   - Update DNS records as instructed
   - Wait for SSL certificate (automatic)

5. **Done!** Your site is live with:
   - ✅ HTTPS
   - ✅ CDN
   - ✅ Auto-deploy on git push
   - ✅ Free hosting

---

## 💰 Cost Comparison

| Option | Cost | Best For |
|--------|------|----------|
| GitHub Pages | FREE | Testing, demos |
| Netlify | FREE | Production, recommended |
| Vercel | FREE | Production, alternative |
| Firebase | FREE | Firebase integration |
| Shared Hosting | $3-7/month | Full control |
| VPS (DigitalOcean) | $5-10/month | Backend + frontend |
| AWS/Azure | $5-50/month | Enterprise, scaling |

---

## 🚨 Troubleshooting

### Site Not Loading

1. **Check DNS:**
```bash
nslookup your-domain.com
```

2. **Check SSL:**
   - Use https://www.ssllabs.com/ssltest/

3. **Check hosting status:**
   - Netlify: Check deploy logs
   - VPS: Check Nginx logs
   ```bash
   tail -f /var/log/nginx/error.log
   ```

### 404 Errors

**GitHub Pages:**
- Make sure files are in root or docs folder

**Netlify/Vercel:**
- Add redirects configuration (see above)

### Slow Loading

1. **Enable CDN** (automatic with Netlify/Vercel)
2. **Optimize images**
3. **Enable compression**
4. **Use caching headers**

---

## 📱 Mobile Testing

After deployment, test on:
- iOS Safari
- Android Chrome
- Different screen sizes

Tools:
- Chrome DevTools (F12 → Mobile view)
- BrowserStack (paid)
- Real devices

---

## ✅ Final Checklist

Before announcing your site:

- [ ] Site loads on HTTPS
- [ ] All pages work
- [ ] Forms submit correctly
- [ ] Mobile responsive
- [ ] Fast loading (<3 seconds)
- [ ] Analytics installed
- [ ] SEO meta tags added
- [ ] Favicon displays
- [ ] No console errors
- [ ] Contact information is correct
- [ ] Social media links work
- [ ] robots.txt and sitemap.xml added

---

## 🎉 Your Site is Live!

Congratulations! Your PROMME website is now accessible on the internet!

**Share your site:**
- Social media
- Email signature
- Business cards
- LinkedIn profile

**Next steps:**
1. Monitor analytics
2. Get user feedback
3. Deploy backend API
4. Connect payment processing (if needed)
5. Scale as you grow

---

## 📞 Need Help?

- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com
- Let's Encrypt: https://letsencrypt.org
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials

---

**Your site is ready to go live! Choose your deployment method and follow the steps above.** 🚀

