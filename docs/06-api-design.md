# Pharma Core V2 API Design

Version: 2.0

---

# Philosophy

The frontend never talks directly to third-party services.

External services are accessed only through server APIs.

Authentication and authorization are always validated on the server.

---

# API Structure

/api

├── auth

├── users

├── courses

├── chapters

├── lessons

├── media

├── questions

├── flashcards

├── exams

├── enrollments

├── products

├── payments

├── analytics

├── notifications

└── bunny

---

# Authentication

POST

/api/auth/login

POST

/api/auth/logout

POST

/api/auth/refresh

GET

/api/auth/me

---

# Courses

GET

/api/courses

GET

/api/courses/:id

POST

/api/courses

PATCH

/api/courses/:id

DELETE

/api/courses/:id

---

# Chapters

GET

/api/courses/:courseId/chapters

POST

/api/courses/:courseId/chapters

PATCH

/api/chapters/:id

DELETE

/api/chapters/:id

---

# Lessons

GET

/api/chapters/:chapterId/lessons

POST

/api/chapters/:chapterId/lessons

PATCH

/api/lessons/:id

DELETE

/api/lessons/:id

---

# Media

POST

/api/media/upload

POST

/api/media/delete

GET

/api/media/:id

---

# Bunny

POST

/api/bunny/create-video

POST

/api/bunny/upload

GET

/api/bunny/status

DELETE

/api/bunny/video

---

# Questions

GET

/api/questions

POST

/api/questions

PATCH

/api/questions/:id

DELETE

/api/questions/:id

---

# Flashcards

GET

/api/flashcards

POST

/api/flashcards

PATCH

/api/flashcards/:id

DELETE

/api/flashcards/:id

---

# Exams

GET

/api/exams

POST

/api/exams

PATCH

/api/exams/:id

DELETE

/api/exams/:id

---

# Enrollments

GET

/api/enrollments

POST

/api/enrollments

PATCH

/api/enrollments/:id

DELETE

/api/enrollments/:id

---

# Payments

POST

/api/payments/create

POST

/api/payments/webhook

GET

/api/payments/history

---

# Analytics

GET

/api/analytics/dashboard

GET

/api/analytics/course/:id

GET

/api/analytics/student/:id

---

# Notifications

GET

/api/notifications

POST

/api/notifications

PATCH

/api/notifications/:id/read

---

# Response Format

Success

{
  "success": true,
  "data": {}
}

Failure

{
  "success": false,
  "error": {
    "code": "...",
    "message": "..."
  }
}

---

# API Rules

Use REST naming.

Use plural resources.

Validate every request.

Authorize every request.

Never expose provider secrets.

Never call Bunny directly from the client.

Always log important operations.