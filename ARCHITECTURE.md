# Pharma Core V2 Architecture

> Last Updated: 2026

---

# Vision

Pharma Core is a modern LMS for medical education built with
Next.js, Firebase and TypeScript.

The project follows a Feature-First Architecture with a shared
Design System.

---

# Tech Stack

- Next.js 15
- React 19
- TypeScript
- Firebase
- Firestore
- Firebase Storage
- Tailwind CSS
- Zod

---

# Folder Structure

app/
components/
features/
lib/
hooks/
types/
constants/
public/

---

# Architecture Rules

## Shared Components

Reusable UI components belong to:

components/ui

Examples:

- Button
- Input
- Dialog
- Card
- Select
- Textarea

---

## Feature Components

Feature-specific components stay inside the feature.

Example:

features/chapters/components/

Examples:

- ChapterCard
- ChapterForm
- CreateChapterDialog

---

## Services

Business logic and Firestore access belong to:

features/*/services

Services never contain UI.

---

## Hooks

Hooks are responsible for state management and data fetching.

---

## Validators

Validation is implemented using Zod.

Every feature owns its validators.

---

## Types

Each feature owns its own types.

Shared types go inside:

types/

---

# Naming Convention

Components

PascalCase

Example

CourseCard.tsx

Hooks

camelCase

Example

useCourses.ts

Services

verb-resource.service.ts

Examples

create-course.service.ts

list-course.service.ts

update-course.service.ts

delete-course.service.ts

---

Status

🚧 Under Development