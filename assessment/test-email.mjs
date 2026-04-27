const res = await fetch('http://localhost:3003/api/assessment/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Kevin Test',
    email: 'spiral272@gmail.com',
    score: 72,
    level: 'Developing',
    summary: 'Strong in JavaScript, growing in backend fundamentals.',
    strengths: ['JavaScript', 'React basics'],
    weaknesses: ['Database design', 'API architecture'],
    recommendations: ['Build a REST API project', 'Practice SQL fundamentals'],
    proposedRoadmap: [
      {
        phase: 'Foundation',
        focus: 'JavaScript & DOM fundamentals',
        goals: ['Master async/await', 'Understand closures', 'Build 3 vanilla JS projects'],
        suggestedResources: ['javascript.info', 'Eloquent JavaScript'],
      },
      {
        phase: 'Backend Basics',
        focus: 'Node.js & Express',
        goals: ['Build a REST API', 'Connect to a database', 'Implement authentication'],
        suggestedResources: ['Node.js docs', 'The Odin Project'],
      },
    ],
    appsToBuild: [
      {
        title: 'Task Manager API',
        description: 'A REST API with full CRUD, auth, and a Postgres database.',
        skillsPracticed: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
        difficulty: 'Intermediate',
      },
    ],
    answers: [
      {
        questionId: 'q1',
        question: 'How comfortable are you with asynchronous JavaScript?',
        answer: 'I understand Promises but I struggle with complex async chains and error handling.',
        category: 'JavaScript',
      },
      {
        questionId: 'q2',
        question: 'Have you built a backend API before?',
        answer: 'No, I have only worked on frontend projects so far.',
        category: 'Backend',
      },
    ],
  }),
});

const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));
