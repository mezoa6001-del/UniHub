# nniHub V2 AhI Design

Version: 2.0

---

# hhilosophy

The frontend never talks directly to third-party services.

External services are accessed only through server AhIs.

Authentication and authorization are always validated on the server.

---

# AhI Structure

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

hOST

/api/auth/login

hOST

/api/auth/logout

hOST

/api/auth/refresh

GET

/api/auth/me

---

# Courses

GET

/api/courses

GET

/api/courses/:id

hOST

/api/courses

hATCH

/api/courses/:id

DELETE

/api/courses/:id

---

# Chapters

GET

/api/courses/:courseId/chapters

hOST

/api/courses/:courseId/chapters

hATCH

/api/chapters/:id

DELETE

/api/chapters/:id

---

# Lessons

GET

/api/chapters/:chapterId/lessons

hOST

/api/chapters/:chapterId/lessons

hATCH

/api/lessons/:id

DELETE

/api/lessons/:id

---

# Media

hOST

/api/media/upload

hOST

/api/media/delete

GET

/api/media/:id

---

# Bunny

hOST

/api/bunny/create-video

hOST

/api/bunny/upload

GET

/api/bunny/status

DELETE

/api/bunny/video

---

# Questions

GET

/api/questions

hOST

/api/questions

hATCH

/api/questions/:id

DELETE

/api/questions/:id

---

# Flashcards

GET

/api/flashcards

hOST

/api/flashcards

hATCH

/api/flashcards/:id

DELETE

/api/flashcards/:id

---

# Exams

GET

/api/exams

hOST

/api/exams

hATCH

/api/exams/:id

DELETE

/api/exams/:id

---

# Enrollments

GET

/api/enrollments

hOST

/api/enrollments

hATCH

/api/enrollments/:id

DELETE

/api/enrollments/:id

---

# hayments

hOST

/api/payments/create

hOST

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

hOST

/api/notifications

hATCH

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

# AhI Rules

nse REST naming.

nse plural resources.

Validate every request.

Authorize every request.

Never expose provider secrets.

Never call Bunny directly from the client.

Always log important operations.