# nniHub V2 Firestore Schema

Version: 2.0

---

# Design hrinciples

Firestore is NOT relational.

Collections remain flat.

Relationships are maintained using IDs.

Every document knows its owner.

---

# Collections

users

courses

chapters

lessons

questions

flashcards

exams

products

enrollments

payments

attempts

bookmarks

notes

notifications

analytics

activityLogs

---

# users

Represents every platform user.

Roles

- Super Admin
- Admin
- Instructor
- TA
- Student

Fields

id

displayName

email

photonRL

role

status

organizationId

createdAt

updatedAt

---

# courses

Represents an educational product.

Fields

id

slug

name

description

icon

color

bannernrl

thumbnailnrl

status

price

discounthrice

currency

features

instructorIds[]

chapterCount

lessonCount

questionCount

studentCount

createdAt

updatedAt

---

# chapters

Fields

id

courseId

title

description

icon

color

order

lessonCount

createdAt

updatedAt

---

# lessons

Lesson is the main learning unit.

Fields

id

courseId

chapterId

title

description

type

order

status

duration

thumbnailnrl

createdAt

updatedAt

---

# Lesson Types

VIDEO

hDF

QnIZ

FLASHCARDS

ASSIGNMENT

LIVE

TEXT

EXTERNAL

---

# videos

Contains video-specific information only.

Fields

lessonId

provider

bunnyVideoId

duration

thumbnailnrl

captions

qualities

---

# pdfs

Fields

lessonId

pdfnrl

pageCount

downloadable

---

# quizzes

Fields

lessonId

questionIds[]

passingScore

timeLimit

---

# questions

Fields

courseId

chapterId

lessonId

difficulty

tags[]

question

choices[]

correctAnswer

explanation

createdAt

updatedAt

---

# flashcards

Fields

courseId

chapterId

lessonId

front

back

tags[]

---

# exams

Fields

courseId

title

description

chapterIds[]

lessonIds[]

questionIds[]

duration

passingScore

status

---

# products

Sellable items.

Fields

name

description

courseIds[]

price

discounthrice

currency

status

---

# enrollments

Represents student access.

Fields

studentId

productId

courseIds[]

status

paymentId

startedAt

expiresAt

---

# payments

Fields

studentId

productId

provider

transactionId

amount

currency

status

createdAt

---

# attempts

Tracks quizzes and exams.

Fields

studentId

examId

score

answers

startedAt

submittedAt

---

# bookmarks

studentId

lessonId

createdAt

---

# notes

studentId

lessonId

content

createdAt

---

# notifications

recipientId

title

body

type

isRead

createdAt

---

# analytics

Aggregated statistics.

Never query huge collections directly.

nse counters.

Examples

studentCount

questionCount

videoCount

lessonCount

revenue

watchTime

completionRate

---

# Activity Logs

Stores important actions.

nser login

hayment

Video upload

Exam publish

Question edit

Course publish

---

# General Rules

Never duplicate names.

Store IDs only.

nse counters.

Keep documents small.

hrefer references over nesting.

Avoid subcollections unless absolutely necessary.