# Assessment Testing Guide

This document explains how to manually test the assessment intake flow end-to-end, including email delivery verification.

---

## Prerequisites

- Assessment dev server running on `http://localhost:3003`
- Signed in to the app at `http://localhost:3003/sign-in`
- `RESEND_API_KEY` present in `assessment/.env`
- Browser DevTools open (F12 → Console tab)

---

## Step 1 — Reset Your Session

If you have an existing session (completed or in-progress), you must delete it before starting a fresh test run. Paste this in the browser console:

```javascript
await fetch('/api/assessment/intake/reset', { method: 'DELETE' })
  .then(r => r.json())
  .then(console.log);
```

Expected response:
```json
{ "success": true, "deleted": 1 }
```

> This endpoint is blocked in production (`NODE_ENV === 'production'`). It only works locally.

---

## Step 2 — Auto-Fill All Steps Except the Last

The script at `test-assessment-submit.js` (project root) programmatically submits canned answers for all steps up to but **not including** the final question. This lets you land on the last step in the UI and submit it manually.

**How to run:**

1. Navigate to `http://localhost:3003/assessment`
2. Open DevTools → Console
3. Copy the contents of `test-assessment-submit.js` and paste into the console
4. Hit Enter

The script will:
- Start (or resume) a session
- Submit pre-filled answers for all 27 steps
- Stop before `meta_ai_reasoning` (the final question)
- Reload the page, landing you on that last question

**What the script skips (intentionally):**
- `meta_ai_reasoning` — "How do you think AI tools should be used when learning to code?" — this is left for you to submit manually via the UI

---

## Step 3 — Submit Manually

After the page reloads you will see the final question. Type an answer and click **Submit**. This triggers:

1. Session marked `COMPLETED` in the database
2. Email sent to `support@signalworksdesign.com` — full internal report with skill profile, answers, and recommendations
3. Email sent to the student — confirmation with next steps and booking link

---

## Step 4 — Verify Emails

Check both inboxes:

| Inbox | Expected email |
|---|---|
| `support@signalworksdesign.com` | Internal report — student name, score, skill breakdown, all submitted answers |
| Student email (e.g. `spiral272@gmail.com`) | Confirmation — thank you message, booking link, no scores or weaknesses |

If no emails arrive within 60 seconds, check the terminal running the dev server for error logs from `emailService.ts`.

---

## Common Issues

### `isResuming: true` after reset
The reset deletes all INTAKE sessions. If you still see `isResuming: true`, confirm the DELETE returned `deleted: 1` and that you are signed in as the correct user.

### No emails received
1. Confirm `RESEND_API_KEY` is in `assessment/.env`
2. Restart the dev server after adding the key (env vars are read at startup)
3. Check terminal logs for lines containing `Internal email error` or `Student email failed`

### `404` on `/api/ai/generate-project`
This is expected in local dev — the AI capstone project generator is not implemented. It is caught silently and does not affect email delivery or the summary page.

### Script syntax error in console
Do not type or re-format the script manually. Copy the file contents directly:

```bash
cat /home/trey27/Documents/projects/signal-works-lms/test-assessment-submit.js
```

Paste the exact output into the console.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assessment/intake/start` | Start or resume a session |
| `POST` | `/api/assessment/intake/submit` | Submit answer for a step |
| `GET` | `/api/assessment/intake/current` | Get current step and progress |
| `GET` | `/api/assessment/intake/summary` | Get session summary after completion |
| `DELETE` | `/api/assessment/intake/reset` | **Dev only** — delete all sessions for current user |

---

## Canned Answers Reference

The answers submitted by `test-assessment-submit.js` are listed below for reference.

| Step ID | Kind | Answer |
|---|---|---|
| `level_self_prediction` | QUESTIONNAIRE | `intermediate` |
| `quick_skill_probe` | MICRO_MCQ_BURST | `probe_const: a`, `probe_flex: b`, `probe_http: c` |
| `questionnaire_background` | QUESTIONNAIRE | `self_taught_intermediate`, React/JS/HTML, `skill_upgrade` |
| `questionnaire_confidence` | QUESTIONNAIRE | All sliders at 2–3 |
| `questionnaire_learning_style` | QUESTIONNAIRE | `projects`, `5_10 hrs/week`, `balanced` |
| `mcq_variables` | MCQ | `b` — `"53"` (string concatenation) |
| `mcq_arrays` | MCQ | `b` — `filter()` |
| `mcq_functions` | MCQ | `b` — `1, 2` (closure) |
| `mcq_async` | MCQ | `c` — `1, 4, 3, 2` |
| `mcq_css_layout` | MCQ | `c` — `justify-content + align-items: center` |
| `mcq_html_semantics` | MCQ | `b` — `<nav><ul>...` |
| `mcq_git_basics` | MCQ | `b` — stages all modified/untracked files |
| `mcq_dom` | MCQ | `b` — first matching element |
| `mcq_responsive` | MCQ | `b` — `@media (max-width: 600px)` |
| `mcq_architecture` | MCQ | `b` — browser requests → backend responds |
| `short_explain_callback` | SHORT_TEXT | Written explanation of callbacks |
| `short_debug_approach` | SHORT_TEXT | Written debugging steps |
| `short_explain_api` | SHORT_TEXT | Written REST API explanation |
| `code_unique_sorted` | CODE | `[...new Set(nums)].sort(...)` |
| `code_count_words` | CODE | `reduce` into object |
| `code_reverse_words` | CODE | `.split().reverse().join()` |
| `design_comparison_1` | DESIGN_COMPARISON | `B` |
| `design_comparison_2` | DESIGN_COMPARISON | `B` |
| `design_critique` | DESIGN_CRITIQUE | Written critique |
| `design_typography` | DESIGN_COMPARISON | `B` |
| `design_ux_flow` | DESIGN_CRITIQUE | Written UX improvement suggestions |
| `meta_explain_thinking` | SHORT_TEXT | Reflection on hardest question |
| `meta_ai_reasoning` | SHORT_TEXT | **Submitted manually in the UI** |
