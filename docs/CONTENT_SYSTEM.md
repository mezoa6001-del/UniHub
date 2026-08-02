# UniHub Content System

Version: 1.0

---

# Vision

Content is the core building block of UniHub.

A Lesson is not a video.

A Lesson is a collection of ordered learning experiences.

Examples:

- Video
- PDF
- Flashcards
- Quiz
- AI Summary
- Clinical Case
- Assignment
- External Link
- Audio

Every item inside a lesson is called **Content**.

---

# Hierarchy

Course

└── Chapter

      └── Lesson

              └── Contents

---

# Content Lifecycle

Draft

↓

Review

↓

Published

↓

Archived

---

# Content Types

VIDEO

PDF

QUIZ

FLASHCARD

SUMMARY

CASE

ASSIGNMENT

LINK

AUDIO

NOTE

AI_CHAT

---

# Content Interface

```ts
interface Content {

id: string;

lessonId: string;

title: string;

description?: string;

type: ContentType;

status: ContentStatus;

order: number;

metadata: Record<string, unknown>;

createdAt: Timestamp;

updatedAt: Timestamp;

}
```

---

# Metadata

Every content type owns its own metadata.

## Video

```ts
metadata = {

videoUrl

duration

thumbnail

provider

captions

}
```

---

## PDF

```ts
metadata = {

fileUrl

pages

size

}
```

---

## Quiz

```ts
metadata = {

questionCount

passingScore

timeLimit

randomize

}
```

---

## Flashcards

```ts
metadata = {

cards

algorithm

}
```

---

## AI Summary

```ts
metadata = {

source

version

tokens

}
```

---

# Ordering

Contents are displayed by order.

Example

1 Video

2 PDF

3 Summary

4 Flashcards

5 Quiz

6 Clinical Case

---

# Permissions

Instructor

can create

can edit

can archive

Admin

full access

Student

read only

---

# AI Integration

AI never publishes directly.

Flow

Upload

↓

Extract

↓

Knowledge Analysis

↓

Generate

↓

Draft

↓

Instructor Review

↓

Publish

---

# Future Types

Simulation

3D Model

VR

AR

Live Session

OSCE

No database migration should be required to support new content types.

Only a new enum value and a viewer component.

---

# Goal

Everything inside UniHub is Content.

Videos are Content.

PDFs are Content.

Quizzes are Content.

Flashcards are Content.

The platform is built around Content, not around file types.