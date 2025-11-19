# PROMME Backend Integration Guide

## Overview

This guide helps backend developers integrate with the PROMME frontend. The frontend is now prepared with a complete API service layer that makes it easy to connect to your backend.

---

## Quick Start

1. **Review API Documentation**: Read `API-DOCUMENTATION.md` for complete endpoint specifications
2. **Set up Backend**: Implement the endpoints according to the API documentation
3. **Configure Frontend**: Update `assets/js/config.js` with your API URL
4. **Test Integration**: Use the mock data mode to develop frontend-backend integration gradually

---

## Frontend Architecture

### Script Loading Order

The frontend loads scripts in this specific order:

```html
<!-- 1. Configuration -->
<script src="assets/js/config.js"></script>

<!-- 2. API Services -->
<script src="assets/js/api-service.js"></script>
<script src="assets/js/ui-utils.js"></script>
<script src="assets/js/auth-api.js"></script>
<script src="assets/js/profile-api.js"></script>
<script src="assets/js/vacancies-api.js"></script>

<!-- 3. Application Scripts -->
<script src="assets/js/main.js"></script>
<script src="assets/js/auth.js"></script>
<script src="assets/js/map.js"></script>
```

### API Service Layer

All API calls go through the centralized API service (`api-service.js`), which provides:

- Automatic error handling
- Authentication token management
- Request/response interceptors
- Mock data mode for development
- Timeout handling
- Consistent error format

---

## Configuration

### 1. Environment Configuration

Edit `assets/js/config.js`:

```javascript
const CONFIG = {
    production: {
        API_BASE_URL: 'https://api.promme.ru/api',  // Your API URL
        YANDEX_MAPS_API_KEY: 'your_key_here',
        ENABLE_MOCK_DATA: false,  // Disable mock data
        ENABLE_LOGGING: false,
        ENABLE_DEBUG: false,
    }
};
```

### 2. Set Environment

In HTML or via environment variable:

```html
<script>
    window.PROMME_ENV = 'production';
</script>
<script src="assets/js/config.js"></script>
```

Or use `.env` file:
```env
PROMME_ENV=production
API_BASE_URL=https://api.promme.ru/api
```

---

## API Integration Examples

### Authentication Flow

#### Frontend Code (already implemented):

```javascript
// In auth.js, when user submits login form
async function handleLogin() {
    const result = await AuthAPI.login({
        email: userEmail,
        password: userPassword,
        profileType: selectedProfileType,
        rememberMe: shouldRemember
    });
    
    if (result.success) {
        // User data and token are automatically stored
        window.location.href = 'index.html';
    } else {
        UIUtils.showError(result.error);
    }
}
```

#### Expected Backend Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "profileType": "job-seeker"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Profile Management

#### Frontend Code (already implemented):

```javascript
// Get user profile
const result = await ProfileAPI.getProfile();
if (result.success) {
    displayProfile(result.data);
}

// Update profile
const updateResult = await ProfileAPI.updateProfile({
    name: "New Name",
    phone: "+7 999 123 45 67",
    position: "Senior Welder"
});
```

#### Expected Backend Endpoints:

```
GET  /api/profile
PUT  /api/profile
POST /api/profile/photo
POST /api/profile/resume
```

### Vacancies

#### Frontend Code (already implemented):

```javascript
// Get vacancies with filters
const result = await VacanciesAPI.getVacancies({
    page: 1,
    limit: 10,
    search: "сварщик",
    location: "Москва",
    salaryMin: 50000
});

// Apply for vacancy
const applyResult = await VacanciesAPI.applyForVacancy('vacancy_123', {
    coverLetter: "I am interested..."
});
```

#### Expected Backend Endpoints:

```
GET  /api/vacancies
GET  /api/vacancies/:id
GET  /api/vacancies/match
POST /api/vacancies/:id/apply
POST /api/vacancies/:id/save
```

---

## Testing Integration

### Step 1: Enable Mock Data

In `config.js`:

```javascript
ENABLE_MOCK_DATA: true
```

Frontend will work without backend, using mock responses.

### Step 2: Implement One Endpoint at a Time

Start with authentication:

1. Implement `POST /api/auth/login`
2. Set `ENABLE_MOCK_DATA: false` for auth only
3. Test login flow
4. Move to next endpoint

### Step 3: Test with Real API

```javascript
// In config.js
const CONFIG = {
    development: {
        API_BASE_URL: 'http://localhost:3000/api',
        ENABLE_MOCK_DATA: false
    }
};
```

### Step 4: Monitor API Calls

Open browser DevTools → Network tab to see all API requests/responses.

---

## Error Handling

### Frontend Handling

The frontend automatically handles errors:

```javascript
// API call with automatic error handling
try {
    const result = await ProfileAPI.updateProfile(data);
    if (result.success) {
        UIUtils.showSuccess('Profile updated!');
    } else {
        UIUtils.showError(result.error);
    }
} catch (error) {
    UIUtils.handleError(error);  // Shows user-friendly error message
}
```

### Expected Error Format

Backend should return errors in this format:

```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "message": "Email is already taken"
  }
}
```

### HTTP Status Codes

Use standard HTTP status codes:

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## Authentication & Authorization

### JWT Token

Frontend expects JWT token in login response:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
}
```

### Token Storage

Token is automatically stored in `localStorage` by `AuthAPI`.

### Token Usage

For protected endpoints, frontend automatically sends:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Verification

Backend should verify token and return user info:

```
GET /api/auth/verify
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

---

## File Uploads

### Frontend Implementation

```javascript
// Upload resume
const result = await ProfileAPI.uploadResume(fileObject);

// Upload photo
const result = await ProfileAPI.uploadProfilePhoto(photoFile);
```

### Backend Requirements

Accept `multipart/form-data` with:
- Field name: `file`
- Additional data in form fields

Return:
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.promme.ru/files/resume.pdf",
    "fileId": "file_123"
  }
}
```

### File Validation

Backend should validate:
- File size (max 10MB for resumes, 5MB for photos)
- File type (PDF, DOC, DOCX for resumes; JPG, PNG for photos)
- Virus scanning (recommended)

---

## CORS Configuration

### Required Headers

Backend must send CORS headers:

```
Access-Control-Allow-Origin: https://promme.ru
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Preflight Requests

Handle OPTIONS requests:

```javascript
// Node.js/Express example
app.options('*', cors());
```

---

## Rate Limiting

Frontend respects rate limits. Backend should return:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

When rate limit exceeded:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Search and Filtering

### Vacancy Search

Frontend sends query parameters:

```
GET /api/vacancies?search=сварщик&location=Москва&page=1&limit=10
```

Backend should:
1. Implement full-text search on title, description
2. Filter by location, salary range, experience
3. Sort by relevance, date, salary
4. Paginate results

### Expected Response

```json
{
  "success": true,
  "data": {
    "vacancies": [...],
    "total": 152,
    "page": 1,
    "limit": 10,
    "totalPages": 16
  }
}
```

---

## AI Features Integration

### Resume Parsing

```javascript
// Frontend
const result = await ProfileAPI.parseResume(resumeFile);
```

Backend should:
1. Accept resume file
2. Extract text from PDF/DOC
3. Parse with NLP/AI to extract:
   - Name, email, phone
   - Position/title
   - Experience years
   - Education
   - Skills
   - Work history

### AI Video Generation

```javascript
// Frontend
const result = await ProfileAPI.generateAIVideo({
    photo: photoFile,
    script: "Optional script"
});
```

Backend should:
1. Accept photo file
2. Generate AI avatar video (using D-ID, HeyGen, or similar)
3. Return video URL

---

## Real-time Features (Optional)

### WebSocket Connection

For real-time notifications:

```javascript
// Example WebSocket integration
const ws = new WebSocket('wss://api.promme.ru/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'APPLICATION_UPDATE') {
        UIUtils.showInfo(`Application status: ${data.status}`);
    }
};
```

---

## Monitoring and Analytics

### API Metrics

Backend should track:
- Request count per endpoint
- Response times
- Error rates
- User activity

### Error Logging

Log all 4xx and 5xx errors with:
- Request details
- User ID
- Timestamp
- Stack trace

### Performance Monitoring

Monitor and optimize:
- Database query times
- API response times
- File upload speeds
- AI processing times

---

## Security Best Practices

### Input Validation

Validate all inputs:
- Email format
- Password strength
- File types and sizes
- SQL injection prevention
- XSS prevention

### Password Security

- Hash with bcrypt (cost factor 10+)
- Never store plain text passwords
- Implement password reset via email

### Token Security

- Use secure JWT secret
- Set reasonable expiration (24h)
- Implement token refresh
- Validate token on every request

### File Upload Security

- Validate file types
- Scan for viruses
- Store outside web root
- Use unique filenames
- Set size limits

---

## Deployment Considerations

### Environment Variables

Use environment variables for:
- Database connection strings
- API keys
- JWT secret
- File storage credentials

### Database

Recommended: PostgreSQL or MongoDB

Implement:
- Connection pooling
- Indexes on frequently queried fields
- Regular backups

### File Storage

Recommended: AWS S3, Azure Blob Storage, or CDN

Features needed:
- Public URLs for files
- Signed URLs for private files
- Automatic backups

### Scaling

Consider:
- Horizontal scaling with load balancer
- Redis for session storage
- CDN for static assets
- Database read replicas

---

## Testing

### Unit Tests

Test individual API endpoints:

```javascript
// Example with Jest
test('POST /api/auth/login', async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
});
```

### Integration Tests

Test frontend-backend integration:

1. Start backend server
2. Set `ENABLE_MOCK_DATA: false`
3. Run frontend tests
4. Verify all flows work

### Load Testing

Use tools like:
- Apache Bench
- k6
- Artillery

Test scenarios:
- 100 concurrent users
- 1000 requests per minute
- File upload under load

---

## Troubleshooting

### CORS Issues

**Problem**: "CORS policy blocked"

**Solution**: Add CORS headers to backend responses

### Authentication Failures

**Problem**: 401 errors on protected routes

**Solution**: 
- Verify token format
- Check token expiration
- Ensure Authorization header is sent

### File Upload Issues

**Problem**: Files not uploading

**Solution**:
- Check file size limits
- Verify content-type header
- Ensure multipart/form-data parsing

### API Timeouts

**Problem**: Requests timing out

**Solution**:
- Optimize database queries
- Add caching
- Increase timeout on both ends

---

## Support

For integration help:
- Review `API-DOCUMENTATION.md`
- Check browser console for errors
- Review network tab in DevTools
- Contact frontend team with specific questions

---

## Changelog

### Version 1.0 (Current)
- Initial API specification
- Authentication endpoints
- Profile management
- Vacancies system
- AI features
- File uploads

### Planned Features
- Real-time notifications
- Video calls for interviews
- Advanced search with AI
- Company dashboards
- Analytics and reporting

