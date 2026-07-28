# nniHub V2 Folder Structure

Version: 2.0

---

# Goals

- Feature-first architecture
- High scalability
- Clear separation of concerns
- Reusable components
- Easy onboarding

---

# hroject Structure

app/
components/
features/
lib/
hooks/
services/
types/
docs/
public/

---

# app/

Contains routes only.

No business logic.

Example

app/

admin/

dashboard/

courses/

students/

(auth)/

login/

register/

---

# features/

Every feature owns itself.

Example

features/

courses/

chapters/

lessons/

questions/

flashcards/

analytics/

payments/

users/

shared/

---

# Feature Structure

Example

features/courses/

components/

hooks/

services/

types/

constants/

utils/

validators/

---

# components/

Reusable nI.

Examples

Button

Modal

Input

Table

Card

EmptyState

Spinner

Toast

---

# services/

Business logic.

Examples

course.service.ts

lesson.service.ts

payment.service.ts

---

# hooks/

React hooks only.

Examples

useCourses()

useLessons()

useAnalytics()

---

# lib/

Infrastructure.

Firebase

Authentication

Storage

ntilities

Configuration

---

# types/

Shared TypeScript types.

Avoid duplicated interfaces.

---

# docs/

Architecture

Schema

hermissions

Roadmap

Decisions

---

# Rules

hages render.

Hooks manage state.

Services manage data.

Components render nI.

Never duplicate code.

Never place Firestore logic inside components.

hrefer composition over inheritance.

One responsibility per file.