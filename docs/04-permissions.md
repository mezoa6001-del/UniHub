# Pharma Core V2 Permissions & Roles

Version: 2.0

---

# Philosophy

Permissions are NOT hardcoded.

Roles are collections of permissions.

Users receive permissions through roles.

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

Platform administrator.

Can manage:

Courses

Users

Payments

Products

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

Upload videos

Manage question bank

Publish exams

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

Publish course

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

# Permission Naming

Permissions use:

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

# Permission Groups

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

Payment

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

3 Permission

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

# Security Principles

Never trust client role.

Always verify permissions
on the server.

Hide UI based on permissions.

Validate again on API.

Permissions are enforced
both on frontend and backend.