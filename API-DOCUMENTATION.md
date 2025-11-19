# PROMME API Documentation

## Overview

This document describes the API endpoints that the PROMME frontend expects to communicate with. The backend team should implement these endpoints according to the specifications below.

**Base URL**: `/api` (relative to your backend server)

**Authentication**: Most endpoints require Bearer token authentication in the `Authorization` header.

**Response Format**: All responses follow this structure:

```json
{
  "success": true/false,
  "data": {...},
  "message": "Optional message",
  "error": "Error message (only if success is false)"
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "password": "securepassword",
  "profileType": "job-seeker" // or "company" or "facilitator"
}
```

**Response:**
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
  "message": "Registration successful"
}
```

**Status Codes:**
- 201: Created
- 400: Bad request (invalid data)
- 409: Conflict (user already exists)

---

### POST /auth/login

Authenticate a user.

**Request Body:**
```json
{
  "email": "ivan@example.com",
  "password": "securepassword",
  "profileType": "job-seeker"
}
```

**Response:**
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

**Status Codes:**
- 200: OK
- 401: Unauthorized (invalid credentials)
- 404: Not found (user doesn't exist)

---

### POST /auth/logout

Logout current user (invalidate token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### GET /auth/verify

Verify authentication token validity.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "ivan@example.com"
    }
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized (invalid or expired token)

---

### POST /auth/password-reset-request

Request password reset email.

**Request Body:**
```json
{
  "email": "ivan@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

**Status Codes:**
- 200: OK
- 404: Not found (email doesn't exist)

---

### POST /auth/password-reset

Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request (invalid or expired token)

---

## Profile Endpoints

### GET /profile

Get current user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7 (999) 123-45-67",
    "position": "Сварщик 5 разряда",
    "experience": 12,
    "education": "Высшее техническое",
    "skills": "РДС, МАГ, ТИГ, чтение чертежей",
    "about": "Опытный сварщик с 12-летним стажем",
    "profileType": "job-seeker",
    "photoUrl": "https://cdn.promme.ru/photos/user_123.jpg",
    "resumeUrl": "https://cdn.promme.ru/resumes/user_123.pdf"
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized
- 404: Not found

---

### PUT /profile

Update user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Иван Иванов",
  "phone": "+7 (999) 123-45-67",
  "position": "Сварщик 6 разряда",
  "experience": 13,
  "education": "Высшее техническое",
  "skills": "РДС, МАГ, ТИГ, чтение чертежей, контроль качества",
  "about": "Опытный сварщик с 13-летним стажем"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Иван Иванов",
    // ... updated profile data
  },
  "message": "Profile updated successfully"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request (invalid data)
- 401: Unauthorized

---

### POST /profile/photo

Upload profile photo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.promme.ru/photos/user_123.jpg",
    "fileId": "file_456"
  },
  "message": "Photo uploaded successfully"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request (invalid file)
- 401: Unauthorized
- 413: Payload too large

---

### POST /profile/resume

Upload resume file.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.promme.ru/resumes/user_123.pdf",
    "fileId": "file_789",
    "parsedData": {
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "phone": "+7 (999) 123-45-67",
      "position": "Сварщик 5 разряда",
      "experience": 12,
      "education": "Высшее техническое",
      "skills": "РДС, МАГ, ТИГ"
    }
  },
  "message": "Resume uploaded successfully"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request (invalid file)
- 401: Unauthorized

---

### GET /profile/completion

Get profile completion percentage.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "percentage": 85,
    "missingFields": ["photoUrl", "resumeUrl"]
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### GET /profile/stats

Get profile statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profileViews": 124,
    "applicationsCount": 15,
    "savedVacanciesCount": 8,
    "responseRate": 67
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### DELETE /profile

Delete user profile (soft delete).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

## Vacancies Endpoints

### GET /vacancies

Get list of vacancies with filters and pagination.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `search` (string): Search query
- `location` (string): Location filter
- `salaryMin` (number): Minimum salary
- `salaryMax` (number): Maximum salary
- `experience` (string): Experience level
- `sortBy` (string, default: 'createdAt'): Sort field
- `sortOrder` (string, default: 'desc'): Sort order ('asc' or 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "vacancies": [
      {
        "id": "vacancy_123",
        "title": "Сварщик 5 разряда",
        "company": "ООО Уралмашзавод",
        "location": "Екатеринбург",
        "salary": "80000-120000",
        "experience": "5+",
        "description": "Требуется опытный сварщик...",
        "requirements": ["НАКС", "РДС", "МАГ", "ТИГ"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 152,
    "page": 1,
    "limit": 10
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad request (invalid parameters)

---

### GET /vacancies/:id

Get single vacancy by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "vacancy_123",
    "title": "Сварщик 5 разряда",
    "company": "ООО Уралмашзавод",
    "location": "Екатеринбург",
    "salary": "80000-120000",
    "experience": "5+",
    "description": "Полное описание вакансии...",
    "requirements": ["Требование 1", "Требование 2"],
    "responsibilities": ["Обязанность 1", "Обязанность 2"],
    "benefits": ["Преимущество 1", "Преимущество 2"],
    "schedule": "Полная занятость",
    "companyInfo": {
      "name": "ООО Уралмашзавод",
      "description": "Описание компании...",
      "employees": "1000+"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 404: Not found

---

### GET /vacancies/match

Get matching vacancies for current user based on profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vacancies": [
      {
        "id": "vacancy_123",
        "title": "Сварщик 5 разряда",
        "company": "ООО Уралмашзавод",
        "match": 95,
        // ... other vacancy fields
      }
    ]
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### POST /vacancies/:id/apply

Apply for a vacancy.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "coverLetter": "Уважаемый работодатель...",
  "resumeUrl": "https://cdn.promme.ru/resumes/user_123.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app_456",
    "status": "pending",
    "submittedAt": "2024-01-20T14:30:00Z"
  },
  "message": "Application submitted successfully"
}
```

**Status Codes:**
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 409: Conflict (already applied)

---

### POST /vacancies/:id/save

Save/bookmark a vacancy.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Vacancy saved successfully"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized
- 404: Not found

---

### DELETE /vacancies/:id/save

Remove vacancy from saved.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Vacancy removed from saved"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### GET /vacancies/saved

Get saved vacancies for current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vacancies": [
      // ... vacancy objects
    ]
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

### POST /vacancies

Create new vacancy (for companies).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Сварщик 5 разряда",
  "location": "Екатеринбург",
  "salary": "80000-120000",
  "experience": "5+",
  "description": "Описание вакансии...",
  "requirements": ["Требование 1", "Требование 2"],
  "responsibilities": ["Обязанность 1", "Обязанность 2"],
  "benefits": ["Преимущество 1", "Преимущество 2"],
  "schedule": "Полная занятость"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "vacancy_789",
    // ... created vacancy data
  },
  "message": "Vacancy created successfully"
}
```

**Status Codes:**
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden (not a company account)

---

### PUT /vacancies/:id

Update vacancy (for companies).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated title",
  // ... other fields to update
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... updated vacancy data
  },
  "message": "Vacancy updated successfully"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found

---

### DELETE /vacancies/:id

Delete vacancy (for companies).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Vacancy deleted successfully"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized
- 403: Forbidden
- 404: Not found

---

## AI Endpoints

### POST /ai/parse-resume

Parse resume file using AI.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary resume file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7 (999) 123-45-67",
    "position": "Сварщик 5 разряда",
    "experience": 12,
    "education": "Высшее техническое",
    "skills": "РДС, МАГ, ТИГ, чтение чертежей",
    "about": "Опытный сварщик..."
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad request
- 401: Unauthorized

---

### POST /ai/generate-profile

Generate profile from text description using AI.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "text": "Я опытный сварщик с 12-летним стажем работы..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "position": "Сварщик",
    "experience": 12,
    "skills": "РДС, МАГ, ТИГ",
    "about": "Опытный сварщик..."
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad request
- 401: Unauthorized

---

### POST /ai/generate-video

Generate AI video for profile.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [photo file]
script: "Optional script for video"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoUrl": "https://cdn.promme.ru/videos/user_123.mp4",
    "thumbnailUrl": "https://cdn.promme.ru/thumbnails/user_123.jpg",
    "videoId": "video_456"
  },
  "message": "AI video generated successfully"
}
```

**Status Codes:**
- 200: OK
- 400: Bad request
- 401: Unauthorized

---

## Applications Endpoints

### GET /applications

Get user's job applications.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string): 'pending', 'accepted', 'rejected'

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123",
        "vacancyId": "vacancy_456",
        "vacancy": {
          "title": "Сварщик 5 разряда",
          "company": "ООО Уралмашзавод"
        },
        "status": "pending",
        "submittedAt": "2024-01-20T14:30:00Z",
        "updatedAt": "2024-01-20T14:30:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE" // Optional error code for specific errors
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required or token invalid
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE`: Resource already exists
- `SERVER_ERROR`: Internal server error

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Standard endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Pagination

Paginated endpoints return this structure:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 152,
    "page": 1,
    "limit": 10,
    "totalPages": 16
  }
}
```

---

## File Upload Requirements

### Supported Formats

**Resume/CV:**
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Text (.txt)
- Max size: 10 MB

**Photos:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Max size: 5 MB
- Recommended dimensions: 800x800px minimum

---

## Webhooks (Optional)

If backend needs to notify frontend about events:

### POST /webhooks/vacancy-status

Notify about application status change.

**Request Body:**
```json
{
  "event": "application_status_changed",
  "data": {
    "applicationId": "app_123",
    "userId": "user_456",
    "status": "accepted",
    "timestamp": "2024-01-21T10:00:00Z"
  }
}
```

---

## Notes for Backend Implementation

1. **Authentication**: Use JWT tokens with 24-hour expiration
2. **Password Storage**: Hash passwords with bcrypt (cost factor 10+)
3. **File Storage**: Use CDN for uploaded files
4. **Search**: Implement full-text search for vacancies
5. **Matching Algorithm**: Consider user's skills, experience, and location
6. **Email Notifications**: Send emails for applications, password resets
7. **Data Validation**: Validate all input data server-side
8. **CORS**: Configure CORS to allow frontend domain
9. **HTTPS**: All production endpoints must use HTTPS
10. **Logging**: Log all API requests for debugging and analytics

---

## Contact

For backend integration questions, please contact the development team.

