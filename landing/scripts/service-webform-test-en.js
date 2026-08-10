/**
 * English test script for the /services consultation form.
 *
 * Usage:
 *   1. Open http://localhost:3000/services in your browser
 *   2. Scroll to the consultation form (or click "Book a Free Consultation")
 *   3. Open DevTools console (F12 -> Console)
 *   4. Paste this entire script and press Enter
 *   5. Watch it fill each step and auto-advance
 */

(async () => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- helpers -----------------------------------------------------------

  /** Click a radio/checkbox label whose visible text includes `text` */
  function clickLabel(text) {
    const labels = [...document.querySelectorAll('label')];
    const match = labels.find((l) => l.textContent.trim().includes(text));
    if (match) {
      match.click();
    } else {
      console.warn(`[test] label not found: "${text}"`);
    }
  }

  /** Set a native-input value so React picks it up */
  function setInput(el, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** Set value on a <select> element */
  function setSelect(el, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value'
    ).set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** Get text inputs/textareas in the current step */
  function getInputs() {
    return [...document.querySelectorAll('#consultation-form input, #consultation-form textarea, #consultation-form select')];
  }

  /** Click the "Next" or "Submit" button */
  function clickNext() {
    const btns = [...document.querySelectorAll('#consultation-form button')];
    const next = btns.find(
      (b) => b.textContent.includes('Next') || b.textContent.includes('Submit')
    );
    if (next && !next.disabled) next.click();
  }

  // --- Step 1: About You ------------------------------------------------
  console.log('[test] Step 1: About You');
  const inputs1 = getInputs();
  setInput(inputs1[0], 'James Mitchell');      // Full Name
  setInput(inputs1[1], 'Kansai Digital Ltd');   // Company
  setInput(inputs1[2], 'CTO');                 // Job Title
  setInput(inputs1[3], 'james@kansaidigital.example.com'); // Email
  setInput(inputs1[4], '090-1234-5678');       // Phone
  clickLabel('Google Meet');                    // Preferred Contact
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 2: What are you looking to build? ---------------------------
  console.log('[test] Step 2: Project Idea');
  clickLabel('AI Assistant / Chatbot');
  await delay(200);
  const inputs2 = getInputs();
  const ta2 = inputs2.filter((el) => el.tagName === 'TEXTAREA');
  setInput(ta2[0],
    'We want to build a bilingual AI chatbot for our e-commerce site that can answer product questions, process returns, and recommend items based on customer history. It should support both English and Japanese customers.'
  );
  setInput(ta2[1],
    'Our current customer support team is overwhelmed. We get 200+ inquiries per day and response times are averaging 8 hours. We want to automate 70% of routine questions to free up staff for complex cases and reduce response time to under 2 minutes.'
  );
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 3: Project Details ------------------------------------------
  console.log('[test] Step 3: Project Details');
  clickLabel('Existing project needing improvements');
  await delay(200);
  clickLabel('Website');
  clickLabel('Database');
  clickLabel('API');
  clickLabel('Documentation');
  await delay(200);
  const inputs3 = getInputs();
  const ta3 = inputs3.filter((el) => el.tagName === 'TEXTAREA');
  if (ta3.length > 0) {
    setInput(ta3[0],
      'Website: https://shop.kansaidigital.example.com\nWe use Shopify for e-commerce with a PostgreSQL backend for analytics.\nAPI docs are available at https://api.kansaidigital.example.com/docs'
    );
  }
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 4: Features -------------------------------------------------
  console.log('[test] Step 4: Features');
  clickLabel('User Accounts');
  clickLabel('Login / Authentication');
  clickLabel('AI Chat');
  clickLabel('AI Search');
  clickLabel('Email Notifications');
  clickLabel('API Integrations');
  clickLabel('Analytics');
  clickLabel('Custom Database');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 5: AI Features ----------------------------------------------
  console.log('[test] Step 5: AI Features');
  clickLabel('Yes');
  await delay(300);
  clickLabel('ChatGPT-style assistant');
  clickLabel('Internal knowledge search');
  clickLabel('Customer support automation');
  clickLabel('Translation');
  clickLabel('Report generation');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 6: Timeline -------------------------------------------------
  console.log('[test] Step 6: Timeline');
  clickLabel('Within 1 month');
  await delay(200);
  const dateInput = getInputs().find((el) => el.type === 'date');
  if (dateInput) setInput(dateInput, '2026-10-01');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 7: Budget ---------------------------------------------------
  console.log('[test] Step 7: Budget');
  clickLabel('\\u00a51M - \\u00a53M');
  // The yen sign may render differently; try multiple patterns
  await delay(100);
  clickLabel('1M');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 8: Success --------------------------------------------------
  console.log('[test] Step 8: Success');
  const inputs8 = getInputs();
  const ta8 = inputs8.filter((el) => el.tagName === 'TEXTAREA');
  if (ta8.length > 0) {
    setInput(ta8[0],
      'Six months after launch, success means:\n1. 70% of routine customer inquiries handled automatically by the AI\n2. Average response time under 2 minutes (down from 8 hours)\n3. Customer satisfaction score above 4.5/5\n4. Support team freed up to handle complex cases and upselling\n5. Bilingual support running seamlessly without manual translation'
    );
  }
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 9: Consultation ---------------------------------------------
  console.log('[test] Step 9: Consultation');
  clickLabel('45 minutes');
  await delay(200);
  clickLabel('Weekday Morning');
  clickLabel('Weekday Afternoon');
  await delay(200);
  const selects = getInputs().filter((el) => el.tagName === 'SELECT');
  if (selects.length > 0) setSelect(selects[0], 'Asia/Tokyo (JST)');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 10: Anything Else -------------------------------------------
  console.log('[test] Step 10: Anything Else');
  const inputs10 = getInputs();
  const ta10 = inputs10.filter((el) => el.tagName === 'TEXTAREA');
  if (ta10.length > 0) {
    setInput(ta10[0],
      'We have a tight deadline because our peak sales season starts in November. Also, we would prefer the AI to use Claude rather than GPT if possible. Our team speaks both English and Japanese so meetings in either language are fine.'
    );
  }
  await delay(300);

  console.log('[test] All steps filled. Click "Submit" to send, or review each step using "Back".');
  // Uncomment the next line to auto-submit:
  // clickNext();
})();
