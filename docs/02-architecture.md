# Pharma Core V2 Architecture

> Version: 2.1
> Status: Active
> Last Updated: 2026-07-09

---

# Vision

Pharma Core is not a video platform.

Pharma Core is a Learning Management System (LMS) specialized for medical education.

The platform manages educational content, students, instructors, enrollments, assessments, analytics, and learning progress.

Videos are only one type of learning content.

---

# Core Philosophy

Everything belongs to a Course.

Everything is extensible.

No feature should require redesigning the database.

---

# Core Hierarchy

Platform

└── Course

  └── Chapter

    └── Lesson

---

# Lesson

Lesson is the fundamental learning unit.

Lesson can be:

- Video
- PDF
- Quiz
- Flashcards
- Assignment
- Live Session
- External Link
- Text

Lesson is NOT a video.

Video is a Lesson Type.

---

# Course

A Course represents a complete educational product.

A course contains:

- Chapters
- Lessons
- Question Bank
- Flashcards
- Exams
- Students
- Analytics
- Settings

---

# Chapter

A Chapter groups lessons together.

Examples

Cardiovascular

Respiratory

Renal

Endocrine

---

# Question Bank

Questions are NOT inside lessons.

Questions belong to:

Course

Chapter

(Optional) Lesson

This allows creating exams from any combination of chapters or lessons.

---

# Flashcards

Flashcards follow the same model as Questions.

Course

Chapter

(Optional) Lesson

---

# Exams

Exam belongs to Course.

Exam may include:

One chapter

Multiple chapters

Specific lessons

Specific tags

Random questions

---

# Users

Supported roles

- Super Admin
- Admin
- Instructor
- Teaching Assistant
- Student

---

# Course Ownership

A Course supports multiple instructors.

Course

↓

Instructor IDs[]

Instead of

Instructor ID

This allows multiple teachers and assistants.

---

# Course Features

Every course enables its own modules.

Example

Videos

Questions

Flashcards

Leaderboard

Notes

Certificates

Discussions

Downloads

Each feature can be enabled or disabled independently.

---

# Course Status

Draft

Private

Published

Coming Soon

Archived

---

# Product

Course is educational content.

Product is what students purchase.

A Product may contain:

One Course

Multiple Courses

Bundles

Subscriptions

Future memberships

---

# Guiding Principles

Keep Pages small.

Keep Business Logic outside UI.

Avoid duplicated data.

Prefer reusable components.

Every entity must have an owner.

Everything should scale to thousands of students.

Never redesign the database for new content types.

Extend.

Do not rebuild.
# Folder Structure

The project follows a Feature-Based Architecture.

```
app/
    (routes only)

features/
    courses/
        components/
        hooks/
        services/
        validators/
        utils/
        constants/
        types/

    videos/
    questions/
    flashcards/

components/
    ui/
    layout/
    shared/

hooks/
    shared hooks only

lib/
    firebase/
    utils/
    config/
```

Rules

- Pages should be thin.
- Components should never access Firestore directly.
- Services contain business logic.
- Validators are powered by Zod.
# Firestore Collections

```
users
courses
chapters
lessons
questions
flashcards
products
subscriptions
enrollments
progress
bookmarks
attempts
leaderboard
notifications
```

Rules

- Every document has an owner.
- Avoid duplicated fields.
- References are preferred over duplicated data.
# Business Logic

Business logic never lives inside React components.

Flow

```
Page
    ↓
Feature Component
    ↓
Hook
    ↓
Service
    ↓
Firestore
```

Components should never call Firestore directly.
# Validation

Every write operation follows this order

```
Input

↓

Zod Validation

↓

Service

↓

Firestore
```

No document should reach Firestore without validation.
# UI Rules

Every form should use

- React Hook Form
- Zod
- Shared UI Components

Every page should reuse existing UI components.

Avoid duplicated UI.
# Git Convention

Feature

```
feat(courses): create course
```

Fix

```
fix(auth): login redirect
```

Refactor

```
refactor(ui): reusable input
```

Documentation

```
docs(architecture): update collections
```
# Development Workflow

Every feature follows the same lifecycle.

Planning

↓

Types

↓

Schema

↓

Service

↓

Hook

↓

UI

↓

Testing

↓

Review

↓

Commit
# Definition of Done

A feature is complete only when

- UI finished
- Validation implemented
- Service implemented
- Firestore integrated
- Loading state handled
- Error state handled
- Success state handled
- No TypeScript errors
- No ESLint errors
- Build succeeds
# Performance

- Minimize Firestore reads.
- Use pagination.
- Avoid duplicated queries.
- Prefer reusable hooks.
- Lazy load heavy components.
# Security

Never trust the frontend.

Authorization belongs to Firestore Rules.

Every entity has an owner.

Roles

Super Admin

↓

Admin

↓

Instructor

↓

Teaching Assistant

↓

Student
# Coding Standards

TypeScript

- Strict mode enabled.
- Never use `any`.
- Prefer explicit types.

React

- Prefer functional components.
- Keep components under 200 lines when possible.
- Move reusable logic to hooks.

Imports

1. External packages
2. Internal aliases (@/)
3. Relative imports

Naming

Components:
PascalCase

Hooks:
useSomething

Services:
verb-entity.service.ts

Validators:
entity.schema.ts

Types:
entity.types.ts
# Testing Strategy

Minimum testing before merging

- npm run lint
- npm run build

Future

- Unit Tests
- Integration Tests
- E2E Tests
