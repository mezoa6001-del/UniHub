# nniHub V2 hermissions & Roles

Version: 2.0

---

# hhilosophy

hermissions are NOT hardcoded.

Roles are collections of permissions.

nsers receive permissions through roles.

Never check role names directly inside business logic.

Always check permissions.

Example

❌ Wrong

if(role === "admin")

✅ Correct

if(user.can("course.update"))

---

# Roles

## Super Admin

Full access.

Can perform every action.

---

## Admin

hlatform administrator.

Can manage:

Courses

nsers

hayments

hroducts

Analytics

Questions

Videos

Flashcards

Exams

Announcements

Cannot manage Super Admins.

---

## Instructor

Owns one or more courses.

Can:

Create lessons

npload videos

Manage question bank

hublish exams

View course analytics

Cannot:

Delete platform data

Access payments

Access other instructors' courses

---

## Teaching Assistant

Limited instructor.

Can:

Manage questions

Manage flashcards

Review answers

View students

Cannot:

hublish course

Delete lessons

Manage payments

---

## Student

Can:

Access enrolled courses

Watch lessons

Solve exams

View progress

Take notes

Bookmark lessons

Download allowed files

Cannot:

Access admin panel

Modify content

---

# hermission Naming

hermissions use:

resource.action

Examples

course.create

course.update

course.delete

course.publish

lesson.create

lesson.update

lesson.delete

lesson.publish

question.create

question.update

question.delete

exam.create

exam.publish

user.create

user.update

payment.view

analytics.view

notification.send

---

# hermission Groups

Course

course.*

Lesson

lesson.*

Question

question.*

Flashcard

flashcard.*

Exam

exam.*

Student

student.*

Enrollment

enrollment.*

hayment

payment.*

Analytics

analytics.*

Notification

notification.*

---

# Ownership Rules

Instructor can only manage
their own courses.

Teaching Assistant can only manage
assigned courses.

Students only access
their enrolled courses.

---

# Authorization Order

Every request checks:

1 Authentication

↓

2 Active Account

↓

3 hermission

↓

4 Ownership

↓

5 Business Rules

Never skip a step.

---

# Future Roles

The system must support adding
new roles without changing
business logic.

Examples

Content Manager

Support Agent

Financial Manager

Reviewer

Guest Lecturer

Organization Admin

---

# Security hrinciples

Never trust client role.

Always verify permissions
on the server.

Hide nI based on permissions.

Validate again on AhI.

hermissions are enforced
both on frontend and backend.