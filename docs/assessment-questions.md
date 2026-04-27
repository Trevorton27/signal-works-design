# Signal Works Design — Assessment Questions

**Total Steps:** 27 (plus summary)
**Estimated Time:** 55–60 minutes
**Skill Dimensions:** Programming, HTML/CSS, JavaScript, Backend, Git, UI/UX Design, Architecture

---

## Step 1 — Your Experience Level (QUESTIONNAIRE)
*Help us understand where you are in your coding journey.*

**How would you describe your current programming experience?**
- Complete beginner — I've never written code
- Beginner — Some familiarity with coding concepts
- Intermediate — I've built small apps or projects
- Advanced — Comfortable with React/backend development
- Professional developer — Working in the industry

---

## Step 2 — Quick Skill Check (MICRO_MCQ_BURST)
*Answer these 3 quick questions to help us calibrate your assessment.*

1. What does `const` prevent in JavaScript?
2. What does `flex: 1` do to an element?
3. Which HTTP method is idempotent?

---

## Step 3 — About You (QUESTIONNAIRE)
*Tell us about your background and experience with programming.*

**How much programming experience do you have?** *(select)*
- No experience — complete beginner
- Some self-taught (< 6 months)
- Self-taught (6+ months)
- Completed a bootcamp
- CS student or graduate
- Professional developer

**Which technologies have you used?** *(multiselect)*
- HTML/CSS
- JavaScript
- React
- Node.js
- Python
- Databases (SQL/NoSQL)
- Git/GitHub
- Other languages/frameworks

**GitHub profile URL** *(optional)*

**What is your primary learning goal?** *(select)*
- Career change into tech
- Upgrade existing skills
- Freelance/contract work
- Build side projects
- Build a startup
- General curiosity/learning

---

## Step 4 — Self-Assessment (QUESTIONNAIRE)
*Rate your confidence in the following areas (1 = no experience, 5 = very confident).*

- Programming basics (variables, loops, functions) *(slider 1–5)*
- HTML & CSS *(slider 1–5)*
- JavaScript *(slider 1–5)*
- Backend / APIs / Databases *(slider 1–5)*
- Git & version control *(slider 1–5)*
- UI/UX Design sense *(slider 1–5)*

---

## Step 5 — Learning Preferences (QUESTIONNAIRE)
*Help us personalize your learning experience.*

**How do you prefer to learn new programming concepts?** *(select)*
- Video tutorials and walkthroughs
- Reading documentation and articles
- Building projects hands-on
- AI-assisted Q&A and exploration
- A mix of all approaches

**How many hours per week can you commit to learning?** *(select)*
- Less than 5 hours
- 5–10 hours
- 10–20 hours
- 20+ hours (intensive study)

**Do you prefer detailed explanations or concise summaries?** *(select)*
- Detailed explanations with examples
- Concise summaries, I'll dive deeper when needed
- A balance of both

---

## Step 6 — Programming Concepts (MCQ)
*Answer this question about variables and data types.*

**What will be the value of `result` after this code runs?**
```javascript
let x = 5;
let y = "3";
let result = x + y;
```

---

## Step 7 — Arrays (MCQ)
*Answer this question about array methods.*

**Which array method would you use to create a new array with only the even numbers from `[1, 2, 3, 4, 5, 6]`?**

---

## Step 8 — Functions (MCQ)
*Answer this question about function scope.*

**What will this code output?**
```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter());
console.log(counter());
```

---

## Step 9 — Async Programming (MCQ)
*Answer this question about asynchronous JavaScript.*

**What is the output order of this code?**
```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

---

## Step 10 — CSS Layout (MCQ)
*Answer this question about CSS Flexbox.*

**Which CSS property would you use to center a flex item both horizontally and vertically within its container?**

---

## Step 11 — HTML Semantics (MCQ)
*Answer this question about semantic HTML.*

**Which is the most semantically appropriate way to mark up a navigation menu?**

---

## Step 12 — Git Basics (MCQ)
*Answer this question about Git version control.*

**What does `git add .` do?**

---

## Step 13 — DOM Manipulation (MCQ)
*Answer this question about working with the DOM.*

**What does `document.querySelector('.btn')` return?**

---

## Step 14 — Responsive Design (MCQ)
*Answer this question about responsive CSS.*

**Which media query targets screens smaller than 600px?**

---

## Step 15 — Architecture Basics (MCQ)
*Answer this question about system architecture.*

**Which best describes "client–server architecture"?**

---

## Step 16 — Explain a Concept (SHORT_TEXT)
*Explain in your own words.*

**In your own words, explain what a "callback function" is and give a simple example of when you might use one.**

---

## Step 17 — Debugging Approach (SHORT_TEXT)
*Describe your problem-solving process.*

**You're working on a web page and a button click isn't working as expected. Describe the steps you would take to debug this issue.**

---

## Step 18 — API Concepts (SHORT_TEXT)
*Explain a fundamental web development concept.*

**In your own words, explain what a REST API is and give one example of how a frontend might use it.**

---

## Step 19 — Coding Challenge: Unique Sorted (CODE)
*Implement a function to process an array.*

**Write a function `uniqueSorted(nums)` that takes an array of numbers and returns a new array with duplicates removed, sorted in ascending order.**

```javascript
function uniqueSorted(nums) {
  // your code here
}
```

---

## Step 20 — Coding Challenge: Word Count (CODE)
*Implement a function to count word occurrences.*

**Write a function `countWords(str)` that takes a string and returns an object where the keys are words and the values are the number of times each word appears.**

```javascript
function countWords(str) {
  // your code here
}
```

---

## Step 21 — Coding Challenge: Reverse Words (CODE)
*Implement a function to reverse word order in a sentence.*

**Write a function `reverseWords(str)` that takes a string and returns it with the word order reversed.**

```javascript
function reverseWords(str) {
  // your code here
}
```

---

## Step 22 — Design Comparison (DESIGN_COMPARISON)
*Compare two button designs and choose the better one.*

**Which button design is more effective for a primary call-to-action (like "Sign Up")?**
*(Choose A or B)*

---

## Step 23 — Layout Comparison (DESIGN_COMPARISON)
*Compare two card layouts.*

**Which card layout better presents a blog post preview?**
*(Choose A or B)*

---

## Step 24 — Design Critique (DESIGN_CRITIQUE)
*Analyze a design and suggest improvements.*

**Look at this login form design. What are 2–3 things you would improve and why?**

---

## Step 25 — Typography Judgment (DESIGN_COMPARISON)
*Evaluate text readability.*

**Which body text style is more readable for long-form content?**
*(Choose A or B)*

---

## Step 26 — UX Flow Evaluation (DESIGN_CRITIQUE)
*Analyze a user experience flow.*

**You see a checkout flow with 5 steps and mandatory account creation before purchase. What would you improve and why?**

---

## Step 27 — Reflect on Your Learning (SHORT_TEXT)
*Share your thought process.*

**Which question so far in this assessment felt the hardest, and what made it difficult for you?**

---

## Step 28 — AI in Learning (SHORT_TEXT)
*Share your perspective on AI-assisted learning.*

**How do you think AI tools (like ChatGPT or Copilot) should be used when learning to code? Give one benefit and one risk.**

---

## Final Step — Assessment Complete (SUMMARY)
*Review your skill profile and generate your personalized learning plan.*
