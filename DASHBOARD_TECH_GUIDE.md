# Antigravity Dashboard: Developer Implementation Guide

This document provides a technical overview of the **Antigravity Learning Dashboard** to assist decorators and developers in continuing its development.

## 📁 Key File Locations

### Frontend (React + Tailwind + Lucide)
- **Primary Dashboard**: [AntigravityDashboard.tsx](file:///c:/ApolloStemAcademy/apps/web/src/pages/AntigravityDashboard.tsx)
  - *Main component for student task management, imports, and premium UI.*
- **Routing Configuration**: [App.tsx](file:///c:/ApolloStemAcademy/apps/web/src/App.tsx)
  - *Defined route: `/student/antigravity`*
- **Navigation Links**: [Sidebar.tsx](file:///c:/ApolloStemAcademy/apps/web/src/components/Sidebar.tsx)
  - *Sidebar width is currently set to `w-48`. Entry labeled "Antigravity AI".*

### Backend (Hono + Cloudflare D1)
- **API Endpoints**: [index.ts](file:///c:/ApolloStemAcademy/apps/api/src/index.ts)
  - *Handles student tasks, classroom links, and sync logic.*
- **Google Classroom Logic**: [google_classroom.ts](file:///c:/ApolloStemAcademy/apps/api/src/google_classroom.ts)
  - *Contains the core sync mechanism for importing external data.*

### Database (SQL Schema)
- **Schema Definitions**: [schema.sql](file:///c:/ApolloStemAcademy/packages/db/schema.sql)
  - *Look for `student_tasks` (custom tasks) and `users.google_classroom_link`.*

---

## 🚀 Implemented Features

### 1. Unified Assignment Tracker
The dashboard aggregates data from two sources:
- **`student_tasks`**: Personal tasks created via "Manual Add" or "Import".
- **`assignments`**: Official class-wide assignments fetched via backend enrollments.

### 2. Google Classroom Sync
- **Link Persistence**: The student's Google Classroom URL is stored in the `users` table.
- **Sync Trigger**: Saving the link triggers a `POST` to `/api/google/sync`, which imports assignments and ensures the student is enrolled in the default class for visibility.

### 3. Smart Import Parser
- **Logic**: Located in `handleImport` within `AntigravityDashboard.tsx`.
- **Format**: Parses text using the `Subject - Title - Due Date` delimiter.

---

## 🛠 Backend API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/student/tasks` | `GET` | Fetch all personal goals/assignments. |
| `/api/student/tasks` | `POST` | Create a new task (subject, title, due_date, priority). |
| `/api/student/assignments` | `GET` | Fetch official class-based assignments. |
| `/api/student/classroom-link` | `GET` | Retrieve the saved Google Classroom URL. |
| `/api/google/sync` | `POST` | Import demo/real assignments and link user to default class. |

---

## 📝 Next Steps for Developers
- **Real OAuth Integration**: The sync currently defaults to a mock path. Connect real Google OAuth 2.0 tokens to move beyond demo data.
- **Task Deletion/Editing**: Currently, tasks can be added but not deleted or edited from the UI table (placeholders exist for the "More" menu).
- **Notification System**: Connect the "Contact Teacher" logic to the internal `messages` table instead of using `mailto:`.
