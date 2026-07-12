# Pharma Core V2 - Engineering Principles

Version: 2.0

---

# Mission

Build a scalable medical Learning Management System (LMS)
that can support thousands of students,
multiple instructors,
multiple courses,
and future expansion
without redesigning the architecture.

---

# Philosophy

We build systems.

Not pages.

We build products.

Not features.

We optimize for long-term maintainability.

Not short-term speed.

---

# Core Rules

## 1.

Course is the center of the platform.

Everything belongs to a Course.

---

## 2.

Lesson is the learning unit.

Video is NOT the learning unit.

PDF is NOT the learning unit.

Quiz is NOT the learning unit.

Lesson contains all learning types.

---

## 3.

Never duplicate information.

Store IDs.

Fetch related data when needed.

---

## 4.

Business logic never belongs inside UI.

---

## 5.

Firestore access never belongs inside Components.

Always use Services.

---

## 6.

Pages should stay small.

Target:

Less than 100 lines.

---

## 7.

Components should have one responsibility.

---

## 8.

Hooks manage state.

Services manage data.

Components render UI.

---

## 9.

Soft Delete.

Never permanently delete educational data.

---

## 10.

Everything must be scalable.

Assume:

10,000 students

100 instructors

200 courses

Millions of questions

---

# Folder Philosophy

Each feature owns itself.

Example

courses/

videos/

questions/

payments/

analytics/

Each feature contains:

components

hooks

services

types

---

# Firestore Philosophy

Flat collections.

Reference by IDs.

Avoid nested collections.

Use counters.

Use indexes.

Keep documents small.

---

# UI Philosophy

Reusable.

Consistent.

Accessible.

Fast.

Responsive.

---

# Backend Philosophy

Validation first.

Authorization first.

Logging first.

Never trust client input.

---

# Security

Every request must verify:

Authentication

Authorization

Ownership

---

# Documentation

Every architectural decision must be documented.

No undocumented decisions.

---

# Git

Every milestone has a Tag.

Every feature has a dedicated branch.

No direct breaking changes.

---

# Success

The project should be easy to understand
for a new developer within one day.

The architecture should survive years
without major redesign.