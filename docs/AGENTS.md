# UniHub Engineering Guide

## Project Philosophy

UniHub is a production-grade medical education platform.

Every change must improve maintainability.

Never sacrifice architecture for speed.

---

# Core Principles

- Build for scale.
- Build for readability.
- Build for maintainability.
- Keep the codebase boring and predictable.

---

# Architecture

Feature-Based Architecture.

Example:

features/
    videos/
    courses/
    chapters/
    questions/
    flashcards/
    dashboard/

Each feature owns:

- components
- hooks
- services
- schemas
- types
- constants
- utils

---

# app/

The app directory only defines routes.

Business logic never lives in app/.

Example:

app/admin/page.tsx

↓

return <DashboardPage />

---

# Components

Prefer composition.

Never duplicate components.

Reuse Design System first.

---

# Hooks

Hooks orchestrate UI state.

Never access Firestore directly inside components.

---

# Services

Firestore access belongs here.

Validation belongs here.

Business logic belongs here.

---

# Schemas

Use Zod.

Never manually validate forms.

---

# Types

No duplicated interfaces.

Export from one place.

---

# UI Rules

Reuse:

- Card
- Button
- Badge
- Spinner
- Modal

Do not recreate existing UI.

---

# TypeScript

Forbidden:

- any
- @ts-ignore
- TODO
- FIXME

Build must stay green.

---

# Git Workflow

Every task:

Build

Commit

Next task

Never stack multiple unverified refactors.

---

# Build Rule

After every task:

npm run build

must pass.

---

# Pull Requests

Small.

Atomic.

Focused.

---

# Performance

Prefer Server Components.

Avoid unnecessary client components.

Lazy load heavy UI.

---

# Firestore

Never duplicate queries.

Create reusable services.

---

# Code Review Checklist

- Build passes
- No duplicated code
- No duplicated components
- No any
- No TODO
- Responsive
- Error state
- Loading state
- Empty state
- Accessible

---

# Naming

Feature names:

videos

courses

dashboard

questions

hooks:

useCreateVideo

useUpdateVideo

services:

create-video.service.ts

update-video.service.ts

---

# Golden Rule

If an implementation feels disconnected from the rest of the project,

STOP.

Integrate.

Do not reinvent.
# Layer Responsibilities

## app/

Routes only.

Never place business logic here.

---

## features/

Each feature owns its entire business domain.

Example:

features/videos/

features/dashboard/

features/questions/

---

## components/

Global reusable UI only.

Examples:

Button

Card

Modal

Spinner

Input

---

## lib/

Shared infrastructure.

Examples:

firebase

auth

storage

config

---

## hooks/

Feature-specific hooks only.

Never access Firestore inside UI components.

---

## services/

All database operations.

Validation.

Business rules.

---

## schemas/

Zod schemas only.

---

## types/

Shared types for the feature.

---

## constants/

Feature constants.

---

## utils/

Pure helper functions.

Never access Firestore here.