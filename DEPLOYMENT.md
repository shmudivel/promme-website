# PROMME Deployment Guide

## Overview

This document provides instructions for deploying the PROMME website to production. The website is a static frontend that communicates with a backend API.

---

## Prerequisites

- Web server (Nginx or Apache)
- SSL certificate for HTTPS
- Domain name configured
- Backend API server running
- Node.js (optional, for build tools)

---

## Deployment Steps

### 1. Prepare the Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and fill in production values:

```env
PROMME_ENV=production
API_BASE_URL=https://api.promme.ru/api
YANDEX_MAPS_API_KEY=your_production_api_key
ENABLE_MOCK_DATA=false
```

### 2. Update Configuration Files

Edit `assets/js/config.js` to ensure production configuration is correct:

```javascript
const CONFIG = {
    production: {
        API_BASE_URL: 'https://api.promme.ru/api',
        YANDEX_MAPS_API_KEY: 'your_production_key',
        ENABLE_MOCK_DATA: false,
        // ... other production settings
    }
};
```

### 3. Update HTML Files

Update all HTML files to load scripts in correct order:

```html
<!-- Configuration must load first -->
<script src="./assets/js/config.js"></script>
<script src="./assets/js/api-service.js"></script>
<script src="./assets/js/ui-utils.js"></script>
<script src="./assets/js/auth-api.js"></script>
<script src="./assets/js/profile-api.js"></script>
<script src="./assets/js/vacancies-api.js"></script>
<script src="./assets/js/main.js"></script>
```

### 4. Test Locally

Start a local server and test:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Visit http://localhost:8000 and verify:
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit (with mock data if backend not ready)
- [ ] No console errors
- [ ] Responsive design works on mobile

### 5. Prepare Files for Deployment

Remove development files:

```bash
# Remove temporary files
rm -f аватар\ 01.mp4
rm -f promme-original.html
rm -f README\ 2.md

# Remove any backup files
rm -f *.bak
```

Organize files:

```
promme-website/
├── index.html
├── auth.html
├── profile.html
├── vacancy.html
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── auth.css
│   │   └── ymaps.css
│   ├── js/
│   │   ├── config.js
│   │   ├── api-service.js
│   │   ├── ui-utils.js
│   │   ├── auth-api.js
│   │   ├── profile-api.js
│   │   ├── vacancies-api.js
│   │   ├── main.js
│   │   ├── auth.js
│   │   └── map.js
│   └── images/
│       └── (your image files)
├── favicon.svg
├── favicon-32.ico
└── favicon-16.ico
```

### 6. Upload to Server

#### Option A: Using FTP/SFTP

```bash
# Example using rsync
rsync -avz --exclude '.git' \
           --exclude 'node_modules' \
           --exclude '.env' \
           --exclude '*.mp4' \
           ./ user@your-server:/var/www/promme/html/
```

#### Option B: Using Git Deployment

```bash
# On your server
cd /var/www/promme
git clone https://github.com/your-org/promme-website.git html
cd html
cp .env.example .env
nano .env  # Edit production values
```

### 7. Configure Web Server

#### Nginx Configuration

Copy the example configuration:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/promme
sudo ln -s /etc/nginx/sites-available/promme /etc/nginx/sites-enabled/
```

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Apache Configuration (Alternative)

Create `/etc/apache2/sites-available/promme.conf`:

```apache
<VirtualHost *:80>
    ServerName promme.ru
    ServerAlias www.promme.ru
    Redirect permanent / https://promme.ru/
</VirtualHost>

<VirtualHost *:443>
    ServerName promme.ru
    ServerAlias www.promme.ru
    
    DocumentRoot /var/www/promme/html
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/promme.ru.crt
    SSLCertificateKeyFile /etc/ssl/private/promme.ru.key
    
    <Directory /var/www/promme/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Enable rewrite for SPA-like behavior
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Gzip compression
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
    
    # Cache static files
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

Enable and restart:

```bash
sudo a2ensite promme
sudo systemctl restart apache2
```

### 8. Configure SSL/HTTPS

#### Using Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d promme.ru -d www.promme.ru
```

Follow prompts and select redirect HTTP to HTTPS option.

#### Using Custom Certificate

Place certificate files:
```bash
sudo cp your_certificate.crt /etc/ssl/certs/promme.ru.crt
sudo cp your_private_key.key /etc/ssl/private/promme.ru.key
sudo chmod 600 /etc/ssl/private/promme.ru.key
```

### 9. Set Correct Permissions

```bash
sudo chown -R www-data:www-data /var/www/promme/html
sudo chmod -R 755 /var/www/promme/html
```

### 10. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp
sudo ufw enable
```

### 11. Set Up Monitoring (Optional)

Configure monitoring tools:

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Yandex Metrika
- **Log monitoring**: Logrotate for Nginx logs

Example logrotate configuration (`/etc/logrotate.d/promme`):

```
/var/log/nginx/promme_*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

---

## Environment-Specific Configurations

### Development

```javascript
window.PROMME_ENV = 'development';
```

- Enable mock data
- Enable debug logging
- Use localhost API
- Show detailed errors

### Staging

```javascript
window.PROMME_ENV = 'staging';
```

- Use staging API
- Enable logging
- Disable mock data
- Test real integrations

### Production

```javascript
window.PROMME_ENV = 'production';
```

- Use production API
- Disable logging
- Disable debug mode
- Optimize performance

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads at https://promme.ru
- [ ] SSL certificate is valid and working
- [ ] All pages are accessible
- [ ] Forms submit correctly to API
- [ ] Authentication flow works
- [ ] Profile pages load
- [ ] Vacancy search and display works
- [ ] Maps integration works
- [ ] Mobile responsive design works
- [ ] Browser console has no errors
- [ ] All images load correctly
- [ ] Favicon displays
- [ ] Analytics tracking is active
- [ ] Error pages (404, 500) display correctly
- [ ] SEO meta tags are present
- [ ] Performance is acceptable (Lighthouse score)

---

## Performance Optimization

### 1. Enable Compression

Already configured in Nginx/Apache examples above.

### 2. Optimize Images

```bash
# Install image optimization tools
sudo apt install jpegoptim optipng

# Optimize JPEGs
find assets/images -name "*.jpg" -exec jpegoptim --max=85 {} \;

# Optimize PNGs
find assets/images -name "*.png" -exec optipng -o7 {} \;
```

### 3. Minify CSS and JavaScript (Optional)

If using build tools:

```bash
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs assets/js/main.js -o assets/js/main.min.js

# Minify CSS
cleancss -o assets/css/main.min.css assets/css/main.css
```

Update HTML to reference minified files in production.

### 4. Content Delivery Network (CDN)

Consider using a CDN for static assets:
- CloudFlare
- AWS CloudFront
- Azure CDN
- Yandex CDN

### 5. Enable Browser Caching

Already configured in Nginx/Apache examples with cache headers.

---

## Rollback Procedure

If deployment issues occur:

1. **Identify the issue**:
   ```bash
   sudo tail -f /var/log/nginx/promme_error.log
   ```

2. **Rollback to previous version**:
   ```bash
   cd /var/www/promme/html
   git log --oneline  # Find previous commit
   git checkout <previous-commit-hash>
   sudo systemctl reload nginx
   ```

3. **Restore from backup**:
   ```bash
   sudo cp -r /var/backups/promme/html_backup_YYYYMMDD/* /var/www/promme/html/
   sudo systemctl reload nginx
   ```

---

## Backup Strategy

### Automated Backups

Create backup script (`/usr/local/bin/backup-promme.sh`):

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/promme"
DATE=$(date +%Y%m%d_%H%M%S)
SITE_DIR="/var/www/promme/html"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup website files
tar -czf "$BACKUP_DIR/promme_backup_$DATE.tar.gz" -C "$SITE_DIR" .

# Keep only last 30 days of backups
find $BACKUP_DIR -name "promme_backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: promme_backup_$DATE.tar.gz"
```

Make executable and add to cron:

```bash
sudo chmod +x /usr/local/bin/backup-promme.sh
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-promme.sh
```

---

## Troubleshooting

### Issue: 404 Not Found on pages

**Solution**: Check Nginx/Apache rewrite rules are configured correctly.

### Issue: API calls failing with CORS errors

**Solution**: Ensure backend API has CORS headers configured for your domain.

### Issue: SSL certificate errors

**Solution**: Verify certificate files are correct and renewed.
```bash
sudo certbot renew --dry-run
```

### Issue: Slow page load times

**Solution**: 
1. Check Nginx compression is enabled
2. Verify CDN is working
3. Optimize images
4. Check backend API response times

### Issue: JavaScript errors in console

**Solution**:
1. Check all JS files are loaded in correct order
2. Verify config.js has correct API URLs
3. Clear browser cache
4. Check for missing dependencies

---

## Monitoring and Maintenance

### Log Monitoring

```bash
# View access logs
sudo tail -f /var/log/nginx/promme_access.log

# View error logs
sudo tail -f /var/log/nginx/promme_error.log

# Search for errors
sudo grep "error" /var/log/nginx/promme_error.log
```

### Performance Monitoring

Use tools like:
- Google Lighthouse
- WebPageTest
- GTmetrix
- Pingdom Speed Test

### Security Updates

```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Update SSL certificates (auto-renewal with Let's Encrypt)
sudo certbot renew

# Check for security vulnerabilities
sudo apt install lynis
sudo lynis audit system
```

---

## CI/CD Integration (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        source: "."
        target: "/var/www/promme/html"
        rm: true
        
    - name: Reload Nginx
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: sudo systemctl reload nginx
```

---

## Contact

For deployment assistance, contact the DevOps team or refer to the main README.md.

