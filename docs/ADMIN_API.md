# Admin API Documentation

This document outlines all admin API endpoints for the Signal Works LMS platform.

## Authentication

All admin endpoints require the user to have the `ADMIN` role. The endpoints use the `requireRole(['ADMIN'])` middleware to enforce this.

---

## User Management

### List Users
**GET** `/api/admin/users`

Query Parameters:
- `role` (optional): Filter by role (STUDENT, INSTRUCTOR, ADMIN)
- `search` (optional): Search by name or email
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

Response:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "email": "student@example.com",
        "name": "John Doe",
        "role": "STUDENT",
        "avatarUrl": null,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z",
        "hasCompletedAssessment": true,
        "_count": {
          "enrollments": 5,
          "attempts": 20,
          "coursesCreated": 0
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

> **Note:** `hasCompletedAssessment` is `true` when the student has at least one `AssessmentSession` with `sessionType: 'INTAKE'` and `status: 'COMPLETED'`. It is derived via a batch query and is separate from `_count.attempts` (which tracks coding-challenge `Attempt` records, not intake sessions).

### Get User Details
**GET** `/api/admin/users/:userId`

Response includes user details with recent enrollments and courses created.

### Create User
**POST** `/api/admin/users`

Body:
```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "password": "securepassword",
  "role": "STUDENT"
}
```

### Update User
**PUT** `/api/admin/users/:userId`

Body (all fields optional):
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "password": "newpassword",
  "role": "INSTRUCTOR",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Delete User
**DELETE** `/api/admin/users/:userId`

Cascades to delete all related data (enrollments, attempts, etc.)

---

## Course Management

### List Courses
**GET** `/api/admin/courses`

Query Parameters:
- `published` (optional): Filter by published status (true/false)
- `instructorId` (optional): Filter by instructor
- `search` (optional): Search by title or description
- `page` (optional): Page number
- `limit` (optional): Items per page

Response includes instructor details and counts for lessons and enrollments.

### Get Course Details
**GET** `/api/admin/courses/:courseId`

Response includes full course details with lessons and enrollment count.

### Update Course
**PUT** `/api/admin/courses/:courseId`

Body (all fields optional):
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "published": true,
  "instructorId": "instructor_123"
}
```

### Delete Course
**DELETE** `/api/admin/courses/:courseId`

Cascades to delete all lessons and enrollments.

---

## Lesson Management

### List Lessons
**GET** `/api/admin/lessons`

Query Parameters:
- `courseId` (optional): Filter by course
- `page` (optional): Page number
- `limit` (optional): Items per page

### Create Lesson
**POST** `/api/admin/lessons`

Body:
```json
{
  "courseId": "course_123",
  "title": "Introduction to React",
  "content": "Lesson content in markdown...",
  "order": 1,
  "videoUrl": "https://example.com/video.mp4",
  "duration": 45
}
```

### Get Lesson Details
**GET** `/api/admin/lessons/:lessonId`

### Update Lesson
**PUT** `/api/admin/lessons/:lessonId`

Body (all fields optional):
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "order": 2,
  "videoUrl": "https://example.com/video2.mp4",
  "duration": 60
}
```

### Delete Lesson
**DELETE** `/api/admin/lessons/:lessonId`

---

---

## Student Dashboard Overview

### Get Student Overview
**GET** `/api/admin/students/[studentId]/overview`

**Params:** `studentId` = Clerk user ID (resolved internally to DB user ID)

**Purpose:** Returns all data needed to render the admin student dashboard in a single request.

Response:
```json
{
  "success": true,
  "data": {
    "student": {
      "dbId": "cuid_abc",
      "clerkId": "user_clerk_abc",
      "name": "Trevor M",
      "email": "spiral272@gmail.com",
      "role": "STUDENT",
      "adminNotes": "Strong CSS, needs backend work.",
      "roadmapDocumentId": "1BxiMVs0..."
    },
    "enrollment": {
      "id": "enroll_123",
      "courseTitle": "Full-Stack Bootcamp",
      "startDate": "2025-01-01T00:00:00Z",
      "finishDate": "2025-06-01T00:00:00Z",
      "progress": 42
    },
    "sessions": [
      {
        "assessmentNumber": 1,
        "id": "session_abc",
        "status": "COMPLETED",
        "startedAt": "2025-03-01T00:00:00Z",
        "completedAt": "2025-03-01T01:00:00Z",
        "responseCount": 28,
        "averageScore": 82
      }
    ],
    "roadmap": [
      {
        "id": "item_abc",
        "title": "HTML & CSS Fundamentals",
        "description": "...",
        "itemType": "COURSE",
        "status": "COMPLETED",
        "phase": 1,
        "order": 1,
        "estimatedHours": 20
      }
    ],
    "skills": [
      {
        "skillKey": "css_layout",
        "mastery": 0.87,
        "confidence": 0.92,
        "attempts": 6
      }
    ]
  }
}
```

All data is fetched in parallel via `Promise.all`. Session average scores are computed from `AssessmentResponse.gradeResult.score` fields.

---

## Student Engagement Tracking

### Get Engagement Analytics
**GET** `/api/admin/engagement`

Query Parameters:
- `userId` (optional): Filter by specific user
- `courseId` (optional): Filter by specific course
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

Response:
```json
{
  "success": true,
  "data": {
    "summary": {
      "enrollments": {
        "total": 150,
        "completed": 45,
        "inProgress": 105,
        "avgProgress": 67
      },
      "assessments": {
        "totalAttempts": 500,
        "successfulAttempts": 350,
        "successRate": 70,
        "avgScore": 75,
        "avgTimeSpent": 300
      },
      "mastery": {
        "totalEvents": 1000,
        "eventsByType": {
          "ATTEMPT": 500,
          "SUCCESS": 350,
          "FAILURE": 150,
          "HINT": 100
        }
      }
    },
    "enrollments": [...],
    "attempts": [...],
    "masteryEvents": [...]
  }
}
```

---

## Student Roadmap Management

### List Roadmaps
**GET** `/api/admin/roadmaps`

Query Parameters:
- `userId` (optional): Filter by user
- `status` (optional): Filter by status (NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED)
- `itemType` (optional): Filter by type (COURSE, SKILL, PROJECT, MILESTONE)
- `page` (optional): Page number
- `limit` (optional): Items per page

### Create Roadmap Item
**POST** `/api/admin/roadmaps`

Body:
```json
{
  "userId": "user_123",
  "title": "Complete React Course",
  "description": "Master React fundamentals",
  "itemType": "COURSE",
  "status": "NOT_STARTED",
  "order": 1,
  "targetDate": "2025-06-01T00:00:00Z",
  "metadata": {
    "courseId": "course_123",
    "estimatedHours": 40
  }
}
```

### Get Roadmap Item
**GET** `/api/admin/roadmaps/:roadmapId`

### Update Roadmap Item
**PUT** `/api/admin/roadmaps/:roadmapId`

Body (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "itemType": "SKILL",
  "status": "IN_PROGRESS",
  "order": 2,
  "targetDate": "2025-07-01T00:00:00Z",
  "completedAt": "2025-05-15T00:00:00Z",
  "metadata": {
    "skillTags": ["react", "javascript"]
  }
}
```

### Delete Roadmap Item
**DELETE** `/api/admin/roadmaps/:roadmapId`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (not admin)
- `404`: Not found
- `500`: Internal server error

---

## Testing the APIs

### Using cURL

```bash
# List all students
curl http://localhost:3000/api/admin/users?role=STUDENT

# Create a new student
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "name": "New Student",
    "password": "password123",
    "role": "STUDENT"
  }'

# Get engagement analytics for a specific user
curl http://localhost:3000/api/admin/engagement?userId=user_123

# Create a roadmap item
curl -X POST http://localhost:3000/api/admin/roadmaps \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "title": "Complete JavaScript Basics",
    "itemType": "COURSE",
    "order": 1
  }'
```

### Using JavaScript/Fetch

```javascript
// Fetch all courses
const response = await fetch('/api/admin/courses');
const data = await response.json();

// Create a new lesson
const lesson = await fetch('/api/admin/lessons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 'course_123',
    title: 'New Lesson',
    content: 'Lesson content...',
    order: 1
  })
});

// Update a user
const updated = await fetch('/api/admin/users/user_123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Updated Name',
    role: 'INSTRUCTOR'
  })
});

// Delete a course
await fetch('/api/admin/courses/course_123', {
  method: 'DELETE'
});
```

---

## Database Schema References

### StudentRoadmap Model

```prisma
model StudentRoadmap {
  id          String         @id @default(cuid())
  userId      String
  title       String
  description String?        @db.Text
  itemType    RoadmapItemType
  status      RoadmapStatus  @default(NOT_STARTED)
  order       Int
  targetDate  DateTime?
  completedAt DateTime?
  metadata    Json?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  user        User           @relation(fields: [userId], references: [id])
}
```

### Enums

```prisma
enum RoadmapItemType {
  COURSE
  SKILL
  PROJECT
  MILESTONE
}

enum RoadmapStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  BLOCKED
}
```
