(async () => {
  const startRes = await fetch('/api/assessment/intake/start', { method: 'POST' });
  const startJson = await startRes.json();
  const sid = startJson.data.sessionId;
  console.log('Session:', sid, '| Resuming:', startJson.data.isResuming);

  const answers = {
    level_self_prediction:        { predicted_level: 'intermediate' },
    quick_skill_probe:            { answers: { probe_const: 'a', probe_flex: 'b', probe_http: 'c' } },
    questionnaire_background:     { programming_experience: 'self_taught_intermediate', technologies_used: ['html_css','javascript','react'], github_url: '', learning_goal: 'skill_upgrade' },
    questionnaire_confidence:     { confidence_programming: 3, confidence_html_css: 3, confidence_javascript: 3, confidence_backend: 2, confidence_git: 3, confidence_design: 2 },
    questionnaire_learning_style: { learning_style: 'projects', weekly_hours: '5_10', explanation_preference: 'balanced' },
    mcq_variables:                { selectedOptionId: 'b' },
    mcq_arrays:                   { selectedOptionId: 'b' },
    mcq_functions:                { selectedOptionId: 'b' },
    mcq_async:                    { selectedOptionId: 'c' },
    mcq_css_layout:               { selectedOptionId: 'c' },
    mcq_html_semantics:           { selectedOptionId: 'b' },
    mcq_git_basics:               { selectedOptionId: 'b' },
    mcq_dom:                      { selectedOptionId: 'b' },
    mcq_responsive:               { selectedOptionId: 'b' },
    mcq_architecture:             { selectedOptionId: 'b' },
    short_explain_callback:       { answer: 'A callback is a function passed as an argument to another function, called later. Example: setTimeout(function() { console.log("done"); }, 1000).' },
    short_debug_approach:         { answer: 'I would open DevTools, check the console for errors, add a console.log inside the handler, verify the event listener is attached, and check for typos in the selector.' },
    short_explain_api:            { answer: 'A REST API is a server that exposes endpoints for CRUD operations over HTTP. A frontend might call GET /api/posts to fetch blog posts and display them.' },
    code_unique_sorted:           { code: 'function uniqueSorted(nums) { return [...new Set(nums)].sort(function(a,b){return a-b;}); }' },
    code_count_words:             { code: 'function countWords(str) { return str.trim().split(/\\s+/).reduce(function(acc,w){acc[w]=(acc[w]||0)+1;return acc;},{}); }' },
    code_reverse_words:           { code: 'function reverseWords(str) { return str.trim().split(/\\s+/).reverse().join(" "); }' },
    design_comparison_1:          { selectedOption: 'B' },
    design_comparison_2:          { selectedOption: 'B' },
    design_critique:              { answer: 'I would improve contrast on the submit button, add visible error states for each field, and reduce the number of required fields to lower friction.' },
    design_typography:            { selectedOption: 'B' },
    design_ux_flow:               { answer: 'I would allow guest checkout, reduce to 3 steps by combining billing and shipping, and move account creation to post-purchase as an optional step.' },
    meta_explain_thinking:        { answer: 'The async question was hardest because understanding microtask vs macrotask queue ordering requires a solid mental model that takes practice to build.' },
    meta_ai_reasoning:            { answer: 'Benefit: AI can explain concepts on demand and unblock you quickly. Risk: Over-reliance can prevent you from developing deep problem-solving instincts.' },
  };

  var stepOrder = [
    'level_self_prediction','quick_skill_probe','questionnaire_background',
    'questionnaire_confidence','questionnaire_learning_style',
    'mcq_variables','mcq_arrays','mcq_functions','mcq_async','mcq_css_layout',
    'mcq_html_semantics','mcq_git_basics','mcq_dom','mcq_responsive','mcq_architecture',
    'short_explain_callback','short_debug_approach','short_explain_api',
    'code_unique_sorted','code_count_words','code_reverse_words',
    'design_comparison_1','design_comparison_2','design_critique',
    'design_typography','design_ux_flow',
    'meta_explain_thinking',
    // meta_ai_reasoning intentionally omitted — submit that one manually in the UI
  ];

  for (var i = 0; i < stepOrder.length; i++) {
    var stepId = stepOrder[i];
    var answer = answers[stepId];
    var res = await fetch('/api/assessment/intake/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sid, stepId: stepId, answer: answer }),
    });
    var json = await res.json();
    console.log('done: ' + stepId + (json.data && json.data.isComplete ? ' <- COMPLETE' : ''));
    if (json.data && json.data.isComplete) break;
  }

  console.log('Ready — reloading to final question. Submit it manually in the UI.');
  window.location.reload();
})();
