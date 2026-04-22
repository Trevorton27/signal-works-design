You are a senior full-stack engineer working inside an existing Next.js LMS project. Your job is to finish the remaining coding work needed to make this app production-ready for real students.

Project context:
- This is a learning platform / LMS with roles like STUDENT, INSTRUCTOR, and ADMIN.
- The app includes courses, lessons, assessments, coding challenges, AI tutor support, and individualized roadmap delivery.
- The project already has architecture, environment, and integration plans for Clerk auth, Postgres/Prisma, AI APIs, Google Docs roadmap integration, and coding challenge execution.
- We want to prepare the app for actual student use, not just a demo.

Important constraints:
- Do not rewrite the whole project.
- Build incrementally on the existing codebase.
- Preserve current architecture where possible.
- Keep code production-minded, readable, and heavily commented only where useful.
- Prefer small, testable changes.
- For each phase, inspect the current codebase first and adapt to what already exists.
- Before making changes, summarize what already exists and what is missing.
- After each phase, output:
  1. files changed
  2. why they were changed
  3. any env vars required
  4. any migration or seed steps
  5. manual test steps

Execution rules:
- Do not invent fake files if equivalent files already exist.
- Reuse existing utilities, UI patterns, and API conventions.
- If the repo already has placeholder functionality, replace it carefully rather than layering duplicates.
- If a task depends on external credentials, implement the code path and document required env vars.
- Add safe fallbacks and user-friendly error states.
- Add basic tests where practical.
- If a major decision point appears, choose the simplest production-safe option and proceed.

Now execute the following phases in order.

==================================================
PHASE 1 — AUTH HARDENING AND ROLE ENFORCEMENT
==================================================

Goal:
Make authentication and authorization production-ready with Clerk as the single source of truth.

Tasks:
1. Audit the existing auth implementation.
   - Find any placeholder auth code, mock sessions, temporary guards, or inconsistent user identity handling.
   - Determine how Clerk is currently wired in the app.
2. Standardize auth around Clerk.
   - Ensure sign-in, sign-up, sign-out, and protected routes work properly.
   - Ensure server-side and client-side auth patterns are consistent.
3. Enforce role-based access control.
   - STUDENT should only access student areas.
   - INSTRUCTOR should access instructor tools.
   - ADMIN should access admin operations.
4. Ensure user records in the database sync cleanly with Clerk user IDs.
5. Add clear unauthorized / forbidden / unauthenticated states.
6. Make not-found and error pages safe even when auth config is missing or temporarily unavailable.
7. Add any missing middleware, helpers, or guards.
8. Add smoke tests or targeted tests for protected routes if the repo supports testing.

Deliverables:
- Working auth flow
- Consistent role checks
- Safe protected route behavior
- Documentation of required Clerk env vars

==================================================
PHASE 2 — STUDENT JOURNEY COMPLETION
==================================================

Goal:
Make the main student experience complete and reliable.

Tasks:
1. Audit the actual student flow from first login to active learning.
2. Ensure the following path works end-to-end:
   - sign up / sign in
   - student profile created or linked
   - enrollment recognized
   - student sees assigned courses
   - student opens lessons
   - student can access assessments/challenges
   - student can access roadmap if assigned
   - student can reach the AI tutor
3. Add missing loading, empty, and error states.
4. Improve route protection so students cannot access unassigned content.
5. Add helpful UX for "no enrollments yet," "roadmap not assigned yet," and "assessment not available yet."
6. If current pages are placeholders, convert them into usable MVP pages.
7. Ensure navigation is clear and student-safe.

Deliverables:
- One polished end-to-end student flow
- Reliable empty/error states
- Student dashboard that is usable for a real pilot cohort

==================================================
PHASE 3 — INSTRUCTOR AND ADMIN OPERATIONS
==================================================

Goal:
Make the platform operable by instructors/admins without manual database edits.

Tasks:
1. Audit existing instructor/admin pages and APIs.
2. Implement or finish:
   - course creation/editing
   - lesson creation/editing
   - enrollment management
   - roadmap assignment
   - role-aware dashboard views
3. Add basic content publishing state if missing.
4. Make forms production-friendly with validation and useful feedback.
5. Prevent unauthorized access to admin functions.
6. Add server-side validation for all privileged mutations.
7. Improve any brittle API endpoints used by admin workflows.

Deliverables:
- Admin can manage core content
- Instructor/admin can assign students and content
- Minimal but practical back-office functionality

==================================================
PHASE 4 — CONTENT AND DATA READINESS
==================================================

Goal:
Prepare the app to run with real starter content and safe production data flows.

Tasks:
1. Audit Prisma schema, seed scripts, and current content models.
2. Ensure the schema supports:
   - users
   - roles
   - enrollments
   - courses
   - lessons
   - roadmap assignments
   - challenge attempts / results
3. Improve seed data so the app can be demoed or pilot-tested with realistic starter content.
4. Add or refine production-safe seed commands.
5. Ensure content relationships are consistent and null-safe.
6. Add validation around content fetches so missing data does not crash pages.

Deliverables:
- Clean schema usage
- Useful seed data
- Stable data relationships
- Clear migration and seed instructions

==================================================
PHASE 5 — ASSESSMENT AND CHALLENGE RELIABILITY
==================================================

Goal:
Make coding assessments reliable enough for student use.

Tasks:
1. Audit the current assessment and challenge system.
2. Confirm the challenge lifecycle:
   - challenge displayed
   - starter content loaded
   - submission accepted
   - code execution or evaluation runs
   - result stored
   - feedback displayed
3. Implement or harden:
   - timeouts
   - retries
   - execution error messages
   - invalid input handling
   - attempt persistence
   - anti-abuse protections where reasonable
4. Ensure challenge attempts are associated with the correct user.
5. Add user-friendly fallback UX when the executor service is unavailable.
6. Make result persistence and display consistent.

Deliverables:
- Stable assessment workflow
- Better failure handling
- Stored attempts/results
- Clear student feedback

==================================================
PHASE 6 — ROADMAP / GOOGLE DOCS INTEGRATION HARDENING
==================================================

Goal:
Make the roadmap assignment and display feature dependable.

Tasks:
1. Audit current roadmap/Google Docs integration.
2. Confirm how roadmap assignment works from admin to student.
3. Improve conversion/rendering reliability.
4. Add safe rendering for unsupported or partially supported Google Docs content.
5. Add good empty states for:
   - roadmap not assigned
   - doc unavailable
   - conversion failed
6. Add admin-side visibility into what roadmap is assigned to whom.
7. If IDs are inconsistent between Clerk IDs and database IDs, normalize that flow.

Deliverables:
- Reliable roadmap assignment
- Stable roadmap display
- Better failure handling and traceability

==================================================
PHASE 7 — TRANSACTIONAL EMAIL INTEGRATION
==================================================

Goal:
Add production-ready email flows using a provider such as Resend.

Tasks:
1. Add an email service abstraction.
2. Implement the first essential transactional emails:
   - welcome / account-ready email
   - enrollment confirmation
   - basic support/contact submission acknowledgment
   - optional roadmap assigned or session reminder template if the app already supports the trigger
3. Add server-side utility functions for sending emails.
4. Protect against accidental sends in development.
5. Add graceful logging/error handling for failed email sends.
6. Document all required env vars and where they are used.
7. If contact/support forms exist, wire them to the email system.

Deliverables:
- Reusable email module
- Core transactional email support
- Safe environment-aware behavior

==================================================
PHASE 8 — OBSERVABILITY, RESILIENCE, AND ERROR HANDLING
==================================================

Goal:
Make the app safer to operate in production.

Tasks:
1. Audit existing logging and error handling.
2. Add structured server logs around important workflows:
   - auth sync
   - enrollment lookup
   - roadmap fetch
   - assessment submission
   - AI tutor request
   - email send
3. Improve API error responses so they are consistent and debuggable.
4. Add top-level error boundaries or route-safe error handling where needed.
5. Prevent unhandled runtime crashes from broken optional integrations.
6. If an error monitoring provider is already present, wire it properly. If not, create clean abstraction points so it can be added later.

Deliverables:
- More consistent logs
- Better resilience
- Cleaner production debugging

==================================================
PHASE 9 — POLISH, QA SUPPORT, AND LAUNCH PREP CODE
==================================================

Goal:
Prepare the codebase for a pilot launch.

Tasks:
1. Add a launch checklist file in the repo.
2. Add an environment variable reference doc tied to actual code usage.
3. Add a "production readiness" README section.
4. Remove dead placeholder components or routes that create confusion.
5. Verify that loading states, empty states, and error states are visually consistent.
6. If the repo has test support, add a minimal smoke suite covering:
   - auth access
   - student dashboard load
   - admin workflow basics
   - assessment submission path
7. Identify any remaining code-level blockers and fix them.

Deliverables:
- Cleaner repo
- Better docs
- Fewer launch surprises
- Pilot-ready codebase

==================================================
FINAL OUTPUT FORMAT
==================================================

At the end of all phases, provide:
1. a concise summary of completed work
2. a list of remaining non-code blockers
3. a list of env vars required
4. migration commands
5. seed commands
6. local test steps
7. production deployment notes
8. recommended next 5 tasks after pilot launch
