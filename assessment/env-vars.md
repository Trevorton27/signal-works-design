# Assessment Environment Variables Reference

---

## Database

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for the Neon serverless database. Used by Prisma for all data reads/writes — assessment results, question banks, user progress, etc. |

---

## Clerk Authentication

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for the Clerk JS SDK in the browser. Safe to expose — initializes Clerk frontend components (sign-in modal, user button, etc.). |
| `CLERK_SECRET_KEY` | Server-side secret for Clerk API calls. Used to verify sessions and fetch user data from API routes. Never exposed to the browser. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Path Clerk redirects unauthenticated users to for sign-in. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Path Clerk redirects new users to for registration. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Where users land after a successful sign-in (`/assessment` = assessment dashboard). |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Where new users land after completing registration (`/assessment`). |

---

## AI / Claude

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Secret key for the Anthropic API. Used to generate assessment questions, evaluate free-form responses, and provide AI-driven feedback to students. |
| `AI_TUTOR_MODEL` | Specifies which Claude model to use (e.g. `claude-sonnet-4-5-20250929`). Controls the capability/cost tradeoff for AI-generated assessments and grading. |

---

## Embeddings

| Variable | Purpose |
|---|---|
| `EMBEDDINGS_API_KEY` | API key for the embeddings provider (Voyage AI when using `voyage-2`). Used to embed questions and answers for semantic similarity scoring. |
| `EMBEDDINGS_API_URL` | Endpoint for the embeddings API (e.g. `https://api.voyageai.com/v1/embeddings`). |
| `EMBEDDINGS_MODEL` | The embeddings model to use (`voyage-2`). Determines vector quality for semantic answer matching and question deduplication. |

---

## Code Execution (JDoodle)

| Variable | Purpose |
|---|---|
| `JDOODLE_CLIENT_ID` | Client ID for the JDoodle API. Used to authenticate requests that execute student-submitted code in a sandboxed environment. |
| `JDOODLE_CLIENT_SECRET` | Client secret for the JDoodle API. Paired with the client ID to authorize code execution requests across supported languages. |

---

## Cross-App Communication

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_LMS_URL` | Public URL of the LMS app. Used to generate links that redirect students back to the LMS after completing an assessment. |
| `LMS_API_URL` | Server-side base URL for making internal API calls from Assessment → LMS (e.g. posting scores, updating progress records). |
| `INTERNAL_API_SECRET` | Shared secret included in server-to-server requests between Assessment and LMS apps to authenticate internal API calls and prevent unauthorized access. |
