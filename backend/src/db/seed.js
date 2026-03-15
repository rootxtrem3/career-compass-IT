import { pool } from "./pool.js";

async function seed() {
  await pool.query("DELETE FROM recommendation_items");
  await pool.query("DELETE FROM recommendations");
  await pool.query("DELETE FROM user_milestones");
  await pool.query("DELETE FROM career_milestones");
  await pool.query("DELETE FROM career_progress");
  await pool.query("DELETE FROM saved_careers");
  await pool.query("DELETE FROM career_mbti");
  await pool.query("DELETE FROM career_skills");
  await pool.query("DELETE FROM careers");
  await pool.query("DELETE FROM user_skills");
  await pool.query("DELETE FROM skills");

  const skills = await pool.query(
    `INSERT INTO skills (name, category, difficulty, description)
     VALUES
     ('Python', 'Technical', 2, 'Programming language for data and automation.'),
     ('Data Analysis', 'Technical', 3, 'Analyze datasets and generate insights.'),
     ('Communication', 'Communication', 2, 'Clear written and verbal communication.'),
     ('Project Management', 'Leadership', 3, 'Plan and execute projects effectively.'),
     ('Creativity', 'Creative', 2, 'Generate novel ideas and solutions.')
     RETURNING id, name`
  );

  const career = await pool.query(
    `INSERT INTO careers (title, description, riasec_code, salary_min, salary_max, demand_level, growth_rate, education_requirements)
     VALUES
     ('Data Analyst', 'Interpret data to drive business decisions.', 'ICR', 55000, 90000, 'High', 12.5, 'Bachelor''s degree or equivalent.'),
     ('Product Manager', 'Lead product strategy and execution.', 'ECS', 80000, 140000, 'High', 10.0, 'Bachelor''s degree with experience.'),
     ('UX Designer', 'Design user-centered experiences.', 'AIS', 65000, 115000, 'Medium', 8.0, 'Portfolio with design training.')
     RETURNING id, title`
  );

  const skillMap = new Map(skills.rows.map((row) => [row.name, row.id]));
  const careerMap = new Map(career.rows.map((row) => [row.title, row.id]));

  const careerSkills = [
    { career: "Data Analyst", skill: "Data Analysis", weight: 0.8 },
    { career: "Data Analyst", skill: "Communication", weight: 0.6 },
    { career: "Product Manager", skill: "Project Management", weight: 0.8 },
    { career: "Product Manager", skill: "Communication", weight: 0.7 },
    { career: "UX Designer", skill: "Creativity", weight: 0.8 },
    { career: "UX Designer", skill: "Communication", weight: 0.6 }
  ];

  for (const entry of careerSkills) {
    await pool.query(
      `INSERT INTO career_skills (career_id, skill_id, importance_weight)
       VALUES ($1, $2, $3)`,
      [careerMap.get(entry.career), skillMap.get(entry.skill), entry.weight]
    );
  }

  const mbtiWeights = [
    { career: "Data Analyst", type: "INTJ", weight: 0.9 },
    { career: "Data Analyst", type: "ISTJ", weight: 0.8 },
    { career: "Product Manager", type: "ENTJ", weight: 0.9 },
    { career: "Product Manager", type: "ENFJ", weight: 0.8 },
    { career: "UX Designer", type: "INFP", weight: 0.85 },
    { career: "UX Designer", type: "ENFP", weight: 0.8 }
  ];

  for (const entry of mbtiWeights) {
    await pool.query(
      `INSERT INTO career_mbti (career_id, mbti_type, weight)
       VALUES ($1, $2, $3)`,
      [careerMap.get(entry.career), entry.type, entry.weight]
    );
  }

  const milestones = [
    { career: "Data Analyst", title: "Learn Python", description: "Build fluency in Python basics." },
    { career: "Data Analyst", title: "Complete data project", description: "Ship a data analysis project." },
    { career: "Product Manager", title: "Ship a roadmap", description: "Plan and deliver a roadmap." },
    { career: "UX Designer", title: "Create portfolio", description: "Publish 2-3 case studies." }
  ];

  for (const entry of milestones) {
    await pool.query(
      `INSERT INTO career_milestones (career_id, title, description)
       VALUES ($1, $2, $3)`,
      [careerMap.get(entry.career), entry.title, entry.description]
    );
  }
}

seed()
  .then(() => {
    console.log("Seed complete.");
    return pool.end();
  })
  .catch((error) => {
    console.error("Seed failed", error);
    pool.end();
  });
