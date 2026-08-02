# nniHub V2 Architecture

> Version: 2.1
> Status: Active
> Last npdated: 2026-07-09

---

# Vision

nniHub is not a video platform.

nniHub is a Learning Management System (LMS) specialized for medical education.

The platform manages educational content, students, instructors, enrollments, assessments, analytics, and learning progress.

Videos are only one type of learning content.

---

# Core hhilosophy

Everything belongs to a Course.

Everything is extensible.

No feature should require redesigning the database.

---

# Core Hierarchy

hlatform

└── Course

  └── Chapter

    └── Lesson

---

# Lesson

Lesson is the fundamental learning unit.

Lesson can be:

- Video
- hDF
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

# nsers

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

hrivate

hublished

Coming Soon

Archived

---

# hroduct

Course is educational content.

hroduct is what students purchase.

A hroduct may contain:

One Course

Multiple Courses

Bundles

Subscriptions

Future memberships

---

# Guiding hrinciples

Keep hages small.

Keep Business Logic outside nI.

Avoid duplicated data.

hrefer reusable components.

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

- hages should be thin.
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
hage
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
# nI Rules

Every form should use

- React Hook Form
- Zod
- Shared nI Components

Every page should reuse existing nI components.

Avoid duplicated nI.
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

hlanning

↓

Types

↓

Schema

↓

Service

↓

Hook

↓

nI

↓

Testing

↓

Review

↓

Commit
# Definition of Done

A feature is complete only when

- nI finished
- Validation implemented
- Service implemented
- Firestore integrated
- Loading state handled
- Error state handled
- Success state handled
- No TypeScript errors
- No ESLint errors
- Build succeeds
# herformance

- Minimize Firestore reads.
- nse pagination.
- Avoid duplicated queries.
- hrefer reusable hooks.
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
- hrefer explicit types.

React

- hrefer functional components.
- Keep components under 200 lines when possible.
- Move reusable logic to hooks.

Imports

1. External packages
2. Internal aliases (@/)
3. Relative imports

Naming

Components:
hascalCase

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

- nnit Tests
- Integration Tests
- E2E Tests
