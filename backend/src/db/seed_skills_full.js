import { pool } from "./pool.js";

const skills = [
  // 1. Core Cognitive Skills
  { name: "Critical thinking", category: "Cognitive", difficulty: 3 },
  { name: "Problem solving", category: "Cognitive", difficulty: 3 },
  { name: "Analytical thinking", category: "Cognitive", difficulty: 3 },
  { name: "Decision making", category: "Cognitive", difficulty: 3 },
  { name: "Decision analysis", category: "Cognitive", difficulty: 4 },
  { name: "Systems thinking", category: "Cognitive", difficulty: 4 },
  { name: "Mathematical reasoning", category: "Cognitive", difficulty: 4 },
  { name: "Statistical reasoning", category: "Cognitive", difficulty: 4 },
  { name: "Scientific method application", category: "Cognitive", difficulty: 3 },
  { name: "Experiment design", category: "Cognitive", difficulty: 4 },
  { name: "Creativity", category: "Cognitive", difficulty: 2 },
  { name: "Innovation management", category: "Cognitive", difficulty: 4 },
  // 2. Learning & Knowledge Skills
  { name: "Research skills", category: "Learning", difficulty: 3 },
  { name: "Reading comprehension", category: "Learning", difficulty: 2 },
  { name: "Speed reading", category: "Learning", difficulty: 2 },
  { name: "Note-taking", category: "Learning", difficulty: 1 },
  { name: "Memory techniques", category: "Learning", difficulty: 2 },
  { name: "Mind mapping", category: "Learning", difficulty: 2 },
  { name: "Knowledge management", category: "Learning", difficulty: 3 },
  { name: "Continuous learning", category: "Learning", difficulty: 2 },
  // 3. Personal Effectiveness
  { name: "Time management", category: "Personal", difficulty: 2 },
  { name: "Organization", category: "Personal", difficulty: 2 },
  { name: "Prioritization", category: "Personal", difficulty: 2 },
  { name: "Multitasking", category: "Personal", difficulty: 2 },
  { name: "Self-discipline", category: "Personal", difficulty: 3 },
  { name: "Goal setting", category: "Personal", difficulty: 2 },
  { name: "Habit building", category: "Personal", difficulty: 2 },
  { name: "Stress management", category: "Personal", difficulty: 2 },
  { name: "Resilience", category: "Personal", difficulty: 3 },
  { name: "Adaptability", category: "Personal", difficulty: 2 },
  { name: "Mindfulness", category: "Personal", difficulty: 2 },
  // 4. Communication Skills
  { name: "Communication (verbal)", category: "Communication", difficulty: 2 },
  { name: "Communication (written)", category: "Communication", difficulty: 2 },
  { name: "Active listening", category: "Communication", difficulty: 2 },
  { name: "Public speaking", category: "Communication", difficulty: 3 },
  { name: "Presentation design", category: "Communication", difficulty: 3 },
  { name: "Storytelling", category: "Communication", difficulty: 3 },
  { name: "Persuasion", category: "Communication", difficulty: 3 },
  // 5. Interpersonal & Social Skills
  { name: "Emotional intelligence", category: "Interpersonal", difficulty: 3 },
  { name: "Teamwork", category: "Interpersonal", difficulty: 2 },
  { name: "Conflict resolution", category: "Interpersonal", difficulty: 3 },
  { name: "Negotiation", category: "Interpersonal", difficulty: 3 },
  { name: "Networking", category: "Interpersonal", difficulty: 2 },
  { name: "Interpersonal skills", category: "Interpersonal", difficulty: 2 },
  { name: "Cultural awareness", category: "Interpersonal", difficulty: 2 },
  { name: "Facilitation", category: "Interpersonal", difficulty: 3 },
  { name: "Mentoring", category: "Interpersonal", difficulty: 3 },
  { name: "Coaching", category: "Interpersonal", difficulty: 3 },
  // 6. Leadership & Management
  { name: "Leadership", category: "Leadership", difficulty: 3 },
  { name: "Strategic planning", category: "Leadership", difficulty: 4 },
  { name: "Project management", category: "Leadership", difficulty: 3 },
  { name: "Risk assessment", category: "Leadership", difficulty: 3 },
  { name: "Crisis management", category: "Leadership", difficulty: 4 },
  { name: "Event planning", category: "Leadership", difficulty: 3 },
  // 7. Business & Financial Skills
  { name: "Financial literacy", category: "Business", difficulty: 2 },
  { name: "Budgeting", category: "Business", difficulty: 2 },
  { name: "Accounting basics", category: "Business", difficulty: 3 },
  { name: "Investing", category: "Business", difficulty: 3 },
  { name: "Entrepreneurship", category: "Business", difficulty: 4 },
  { name: "Business analysis", category: "Business", difficulty: 3 },
  { name: "Market research", category: "Business", difficulty: 3 },
  { name: "Sales skills", category: "Business", difficulty: 3 },
  { name: "Customer service", category: "Business", difficulty: 2 },
  { name: "Branding", category: "Business", difficulty: 3 },
  { name: "Product design", category: "Business", difficulty: 3 },
  { name: "Supply chain understanding", category: "Business", difficulty: 3 },
  { name: "Logistics management", category: "Business", difficulty: 3 },
  { name: "Negotiating contracts", category: "Business", difficulty: 3 },
  { name: "Legal basics", category: "Business", difficulty: 3 },
  { name: "Ethics and integrity", category: "Business", difficulty: 2 },
  // 8. Technical & Digital Skills
  { name: "Programming (general)", category: "Technical", difficulty: 3 },
  { name: "Web development", category: "Technical", difficulty: 3 },
  { name: "Mobile app development", category: "Technical", difficulty: 4 },
  { name: "Database management", category: "Technical", difficulty: 3 },
  { name: "Cloud computing", category: "Technical", difficulty: 4 },
  { name: "DevOps practices", category: "Technical", difficulty: 4 },
  { name: "Cybersecurity fundamentals", category: "Technical", difficulty: 4 },
  { name: "Machine learning basics", category: "Technical", difficulty: 4 },
  { name: "AI model usage", category: "Technical", difficulty: 3 },
  { name: "Troubleshooting", category: "Technical", difficulty: 3 },
  { name: "Debugging", category: "Technical", difficulty: 3 },
  { name: "Quality assurance", category: "Technical", difficulty: 3 },
  { name: "Testing methodologies", category: "Technical", difficulty: 3 },
  // 9. Creative & Media Skills
  { name: "Graphic design", category: "Creative", difficulty: 3 },
  { name: "UI/UX design", category: "Creative", difficulty: 3 },
  { name: "Video editing", category: "Creative", difficulty: 3 },
  { name: "Photography", category: "Creative", difficulty: 2 },
  { name: "Content writing", category: "Creative", difficulty: 2 },
  { name: "Copywriting", category: "Creative", difficulty: 3 },
  { name: "Social media management", category: "Creative", difficulty: 2 },
  { name: "Digital marketing", category: "Creative", difficulty: 3 },
  { name: "SEO optimization", category: "Creative", difficulty: 3 },
  // 10. Operational & Execution Skills
  { name: "Documentation", category: "Operational", difficulty: 2 },
  { name: "Prototyping", category: "Operational", difficulty: 3 },
  { name: "Data analysis", category: "Operational", difficulty: 3 },
  { name: "Visualization (data)", category: "Operational", difficulty: 3 },
  { name: "Translation", category: "Operational", difficulty: 3 },
  { name: "Language learning", category: "Operational", difficulty: 2 },
  { name: "Teaching", category: "Operational", difficulty: 3 },
  { name: "Systems implementation", category: "Operational", difficulty: 4 },
];

async function seedSkills() {
  await pool.query("DELETE FROM user_skills");
  await pool.query("DELETE FROM career_skills");
  await pool.query("DELETE FROM skills");

  for (const skill of skills) {
    await pool.query(
      `INSERT INTO skills (name, category, difficulty) VALUES ($1, $2, $3)`,
      [skill.name, skill.category, skill.difficulty]
    );
  }

  const result = await pool.query("SELECT COUNT(*) FROM skills");
  console.log(`Inserted ${result.rows[0].count} skills.`);
  await pool.end();
}

seedSkills().catch(console.error);
