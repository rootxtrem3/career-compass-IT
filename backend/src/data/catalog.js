function makeUuid(index) {
  return `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

const skillMatrix = [
  ["Programming", ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Bash", "SQL"]],
  ["Frontend", ["React", "Next.js", "HTML", "CSS", "Tailwind", "Accessibility", "UI Design", "State Management", "Animation", "Responsive Design"]],
  ["Backend", ["Node.js", "Express", "REST APIs", "Authentication", "Validation", "Caching", "Message Queues", "Microservices", "GraphQL", "Server Security"]],
  ["Data", ["Data Analysis", "Data Modeling", "ETL", "Statistics", "Power BI", "Excel", "Visualization", "Reporting", "Machine Learning", "Data Cleaning"]],
  ["DevOps", ["Git", "Linux", "Docker", "CI/CD", "Cloud Deployment", "Monitoring", "IaC", "Networking", "Containers", "Release Management"]],
  ["QA", ["Manual Testing", "Automated Testing", "Regression Testing", "API Testing", "Performance Testing", "Test Planning", "Bug Reporting", "Selenium", "Playwright", "Quality Metrics"]],
  ["Design", ["UX Research", "Wireframing", "Prototyping", "User Flows", "Figma", "Visual Design", "Interaction Design", "Design Systems", "Usability Testing", "Design Handoff"]],
  ["Product", ["Project Management", "Product Discovery", "Roadmapping", "Requirements Writing", "Sprint Planning", "Stakeholder Management", "Market Research", "Prioritization", "KPIs", "Business Analysis"]],
  ["Soft Skills", ["Communication", "Critical Thinking", "Problem Solving", "Collaboration", "Presentation", "Leadership", "Time Management", "Adaptability", "Documentation", "Decision Making"]],
  ["Support", ["Customer Support", "Troubleshooting", "CRM", "Knowledge Base Writing", "Technical Writing", "Onboarding", "Incident Handling", "Training", "Operations", "Service Management"]]
];

export const skills = skillMatrix.flatMap(([category, names], categoryIndex) =>
  names.map((name, skillIndex) => ({
    id: makeUuid(categoryIndex * 100 + skillIndex + 1),
    name,
    category,
    difficulty: skillIndex < 3 ? "beginner" : skillIndex < 7 ? "intermediate" : "advanced",
    description: `${name} competency within the ${category} domain.`
  }))
);

const skillIdByName = new Map(skills.map((skill) => [skill.name, skill.id]));

function weightedSkills(pairs) {
  return Object.fromEntries(pairs.map(([name, weight]) => [skillIdByName.get(name), weight]));
}

export const careers = [
  {
    id: makeUuid(2001),
    title: "Frontend Developer",
    description: "Build responsive user interfaces and interactive product experiences.",
    riasec_code: "AEC",
    mbti_types: ["ENFP", "ENTP", "ISFP", "INTP"],
    salary_min: 45000,
    salary_max: 82000,
    demand_level: "High",
    growth_rate: 0.1834,
    education_requirements: "Diploma, degree, or portfolio demonstrating frontend capability.",
    skill_weights: weightedSkills([
      ["JavaScript", 1],
      ["React", 1],
      ["HTML", 0.9],
      ["CSS", 0.9],
      ["Responsive Design", 0.8],
      ["Accessibility", 0.7],
      ["Git", 0.5]
    ]),
    milestones: [
      "Learn modern JavaScript fundamentals",
      "Build responsive React interfaces",
      "Practice accessibility and performance optimization",
      "Publish a portfolio with 3 frontend projects"
    ]
  },
  {
    id: makeUuid(2002),
    title: "Backend Developer",
    description: "Develop APIs, data flows, and server-side logic for applications.",
    riasec_code: "IRC",
    mbti_types: ["INTJ", "ISTJ", "ENTJ", "INTP"],
    salary_min: 50000,
    salary_max: 92000,
    demand_level: "High",
    growth_rate: 0.2012,
    education_requirements: "Strong programming and backend systems knowledge.",
    skill_weights: weightedSkills([
      ["Node.js", 1],
      ["Express", 0.9],
      ["REST APIs", 1],
      ["SQL", 0.9],
      ["Authentication", 0.8],
      ["Validation", 0.7],
      ["Git", 0.5]
    ]),
    milestones: [
      "Design RESTful APIs",
      "Build services with authentication and validation",
      "Work with relational and document databases",
      "Deploy a production backend service"
    ]
  },
  {
    id: makeUuid(2003),
    title: "Full Stack Developer",
    description: "Ship features across frontend and backend application layers.",
    riasec_code: "IEC",
    mbti_types: ["INTP", "ENTP", "ENTJ", "ENFP"],
    salary_min: 52000,
    salary_max: 95000,
    demand_level: "High",
    growth_rate: 0.1948,
    education_requirements: "Solid full-stack development portfolio or equivalent education.",
    skill_weights: weightedSkills([
      ["JavaScript", 1],
      ["React", 0.9],
      ["Node.js", 0.9],
      ["REST APIs", 0.8],
      ["SQL", 0.7],
      ["Git", 0.6],
      ["Docker", 0.5]
    ]),
    milestones: [
      "Ship full-stack CRUD applications",
      "Connect frontend clients to APIs",
      "Manage authentication end to end",
      "Deploy and monitor a full-stack project"
    ]
  },
  {
    id: makeUuid(2004),
    title: "Data Analyst",
    description: "Interpret data, create reports, and support data-driven decisions.",
    riasec_code: "IRC",
    mbti_types: ["INTJ", "ISTJ", "INFJ", "INTP"],
    salary_min: 40000,
    salary_max: 76000,
    demand_level: "High",
    growth_rate: 0.1662,
    education_requirements: "Analytics training, statistics, or case-study experience.",
    skill_weights: weightedSkills([
      ["SQL", 1],
      ["Data Analysis", 1],
      ["Excel", 0.8],
      ["Visualization", 0.8],
      ["Reporting", 0.7],
      ["Statistics", 0.7],
      ["Communication", 0.4]
    ]),
    milestones: [
      "Analyze datasets with SQL and spreadsheets",
      "Build reports and visual dashboards",
      "Practice stakeholder-ready storytelling",
      "Publish portfolio case studies"
    ]
  },
  {
    id: makeUuid(2005),
    title: "Data Engineer",
    description: "Build pipelines and data systems for reliable analytics and products.",
    riasec_code: "IRC",
    mbti_types: ["INTJ", "ISTJ", "ENTJ", "INTP"],
    salary_min: 55000,
    salary_max: 98000,
    demand_level: "High",
    growth_rate: 0.2123,
    education_requirements: "Experience with data systems, ETL, and backend concepts.",
    skill_weights: weightedSkills([
      ["Python", 1],
      ["SQL", 1],
      ["ETL", 0.9],
      ["Data Modeling", 0.9],
      ["Cloud Deployment", 0.7],
      ["Docker", 0.6],
      ["Linux", 0.5]
    ]),
    milestones: [
      "Build ETL jobs and data models",
      "Work with cloud data tooling",
      "Set up monitoring for pipelines",
      "Deliver reliable batch or streaming workflows"
    ]
  },
  {
    id: makeUuid(2006),
    title: "UX Designer",
    description: "Design user-centered product flows, interfaces, and research-backed improvements.",
    riasec_code: "ASI",
    mbti_types: ["INFP", "ENFP", "INFJ", "ISFP"],
    salary_min: 42000,
    salary_max: 78000,
    demand_level: "Medium",
    growth_rate: 0.1437,
    education_requirements: "Design training and portfolio-ready UX case studies.",
    skill_weights: weightedSkills([
      ["UX Research", 1],
      ["Wireframing", 0.9],
      ["Prototyping", 0.9],
      ["User Flows", 0.8],
      ["Figma", 0.8],
      ["Usability Testing", 0.8],
      ["Communication", 0.5]
    ]),
    milestones: [
      "Create wireframes and prototypes",
      "Run usability tests",
      "Document a full UX case study",
      "Build a portfolio for product teams"
    ]
  },
  {
    id: makeUuid(2007),
    title: "UI Designer",
    description: "Design polished digital interfaces and visual systems for products.",
    riasec_code: "AES",
    mbti_types: ["ISFP", "ENFP", "INFP", "INFJ"],
    salary_min: 39000,
    salary_max: 72000,
    demand_level: "Medium",
    growth_rate: 0.1275,
    education_requirements: "Strong visual portfolio and UI systems practice.",
    skill_weights: weightedSkills([
      ["UI Design", 1],
      ["Visual Design", 0.9],
      ["Figma", 0.8],
      ["Design Systems", 0.8],
      ["Interaction Design", 0.7],
      ["Responsive Design", 0.6]
    ]),
    milestones: [
      "Build high-fidelity interface designs",
      "Create reusable design tokens and systems",
      "Design responsive layouts",
      "Prepare implementation-ready handoff files"
    ]
  },
  {
    id: makeUuid(2008),
    title: "Product Manager",
    description: "Coordinate product decisions, user needs, and execution plans across teams.",
    riasec_code: "ESC",
    mbti_types: ["ENTJ", "ENFJ", "ESTJ", "INFJ"],
    salary_min: 50000,
    salary_max: 97000,
    demand_level: "Medium",
    growth_rate: 0.1219,
    education_requirements: "Clear product thinking, execution planning, and communication skills.",
    skill_weights: weightedSkills([
      ["Project Management", 1],
      ["Product Discovery", 0.9],
      ["Roadmapping", 0.9],
      ["Requirements Writing", 0.8],
      ["Sprint Planning", 0.7],
      ["Stakeholder Management", 0.7],
      ["Communication", 0.8]
    ]),
    milestones: [
      "Write clear requirements documents",
      "Lead prioritization and roadmap exercises",
      "Run sprint planning with a team",
      "Ship a measurable product improvement"
    ]
  },
  {
    id: makeUuid(2009),
    title: "QA Engineer",
    description: "Protect product quality through structured testing and defect analysis.",
    riasec_code: "CRI",
    mbti_types: ["ISTJ", "INTJ", "ISFJ", "ESTJ"],
    salary_min: 35000,
    salary_max: 66000,
    demand_level: "Medium",
    growth_rate: 0.1088,
    education_requirements: "Testing fundamentals, quality discipline, and tooling practice.",
    skill_weights: weightedSkills([
      ["Manual Testing", 1],
      ["Automated Testing", 0.9],
      ["Regression Testing", 0.8],
      ["API Testing", 0.8],
      ["Bug Reporting", 0.8],
      ["Quality Metrics", 0.6],
      ["Communication", 0.5]
    ]),
    milestones: [
      "Write test plans and cases",
      "Practice regression and exploratory testing",
      "Automate checks for key flows",
      "Track and communicate quality metrics"
    ]
  },
  {
    id: makeUuid(2010),
    title: "DevOps Engineer",
    description: "Improve delivery speed, deployment reliability, and platform operations.",
    riasec_code: "IRC",
    mbti_types: ["INTJ", "ENTJ", "ISTJ", "INTP"],
    salary_min: 58000,
    salary_max: 102000,
    demand_level: "High",
    growth_rate: 0.2176,
    education_requirements: "Hands-on infrastructure, Linux, and deployment experience.",
    skill_weights: weightedSkills([
      ["Linux", 1],
      ["Docker", 0.9],
      ["CI/CD", 0.9],
      ["Cloud Deployment", 0.9],
      ["Monitoring", 0.8],
      ["Networking", 0.7],
      ["IaC", 0.8]
    ]),
    milestones: [
      "Containerize an application",
      "Build CI/CD pipelines",
      "Deploy infrastructure and services",
      "Set up alerts and observability"
    ]
  },
  {
    id: makeUuid(2011),
    title: "Technical Writer",
    description: "Create clear product documentation, guides, and technical learning content.",
    riasec_code: "SCA",
    mbti_types: ["INFJ", "ISFJ", "INTJ", "INFP"],
    salary_min: 32000,
    salary_max: 61000,
    demand_level: "Medium",
    growth_rate: 0.0984,
    education_requirements: "Strong writing, structure, and technical understanding.",
    skill_weights: weightedSkills([
      ["Technical Writing", 1],
      ["Documentation", 0.9],
      ["Knowledge Base Writing", 0.8],
      ["Communication", 0.8],
      ["Onboarding", 0.5],
      ["Git", 0.4]
    ]),
    milestones: [
      "Write structured technical guides",
      "Create a documentation style standard",
      "Document real product workflows",
      "Measure and improve content usefulness"
    ]
  },
  {
    id: makeUuid(2012),
    title: "IT Support Specialist",
    description: "Resolve technical issues and keep users productive with dependable support.",
    riasec_code: "SRC",
    mbti_types: ["ESFJ", "ISFJ", "ESTJ", "ENFJ"],
    salary_min: 28000,
    salary_max: 52000,
    demand_level: "Medium",
    growth_rate: 0.0912,
    education_requirements: "Troubleshooting ability and strong user communication.",
    skill_weights: weightedSkills([
      ["Troubleshooting", 1],
      ["Customer Support", 0.9],
      ["Service Management", 0.8],
      ["Incident Handling", 0.8],
      ["Training", 0.5],
      ["Communication", 0.8]
    ]),
    milestones: [
      "Handle support tickets consistently",
      "Create repeatable troubleshooting guides",
      "Improve response and resolution workflows",
      "Train users on common issues"
    ]
  }
];

const companies = [
  "Northwind Labs",
  "Blue Ridge Analytics",
  "Studio Nova",
  "Summit Logic",
  "Aster Cloud",
  "NileSoft",
  "BrightPath Systems",
  "OrbitEdge",
  "VectorHive",
  "Pioneer Stack",
  "Harbor Data",
  "Zenith Works",
  "Pixel Foundry",
  "AtlasFlow",
  "Cedar Metrics",
  "Open Horizon",
  "Signal Forge",
  "Luma Systems"
];

const locations = [
  "Remote",
  "Addis Ababa",
  "Hybrid",
  "Nairobi",
  "Kigali",
  "Dubai",
  "Cape Town",
  "Lagos",
  "Accra",
  "Doha",
  "Berlin",
  "Amsterdam"
];

export const jobs = Array.from({ length: 216 }, (_, index) => {
  const career = careers[index % careers.length];
  const company = companies[index % companies.length];
  const location = locations[index % locations.length];
  const day = (index % 28) + 1;

  return {
    id: makeUuid(3001 + index),
    source: "seed",
    external_id: `seed-${career.title.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    title: career.title,
    company,
    location,
    posted_at: `2026-03-${String(day).padStart(2, "0")}T08:00:00.000Z`,
    apply_url: `https://example.com/jobs/${career.title.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`
  };
});
