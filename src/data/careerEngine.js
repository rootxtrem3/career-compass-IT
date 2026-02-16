export const RIASEC_OPTIONS = [
  { letter: "R", name: "Realistic", detail: "Hands-on, technical, practical tasks" },
  { letter: "I", name: "Investigative", detail: "Research, analysis, deep problem solving" },
  { letter: "A", name: "Artistic", detail: "Creative thinking and expression" },
  { letter: "S", name: "Social", detail: "Helping, teaching, support, collaboration" },
  { letter: "E", name: "Enterprising", detail: "Leadership, persuasion, business drive" },
  { letter: "C", name: "Conventional", detail: "Structure, organization, process quality" }
];

export const SKILL_OPTIONS = [
  "Communication",
  "Data Analysis",
  "Problem Solving",
  "Critical Thinking",
  "Project Management",
  "Team Leadership",
  "Public Speaking",
  "Digital Marketing",
  "Sales",
  "UI/UX Design",
  "Content Writing",
  "Research",
  "Teaching",
  "Software Development",
  "Quality Assurance",
  "Customer Support",
  "Negotiation",
  "Financial Analysis",
  "Operations Planning",
  "Product Strategy"
];

export const MBTI_OPTIONS = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP"
];

const CAREER_LIBRARY = [
  {
    title: "Data Scientist",
    summary: "Build models and insights from data to drive decision making.",
    riasec: ["I", "C"],
    mbti: ["INTJ", "INTP", "ISTJ", "ENTJ"],
    skills: ["Data Analysis", "Research", "Critical Thinking", "Problem Solving"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist"
  },
  {
    title: "Software Engineer",
    summary: "Design and implement digital products and systems.",
    riasec: ["R", "I", "C"],
    mbti: ["INTP", "INTJ", "ISTP", "ENTP"],
    skills: ["Software Development", "Problem Solving", "Critical Thinking", "Quality Assurance"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer"
  },
  {
    title: "UX Designer",
    summary: "Craft user-friendly and high-conversion product experiences.",
    riasec: ["A", "I", "S"],
    mbti: ["INFP", "INFJ", "ENFP", "ISFP"],
    skills: ["UI/UX Design", "Communication", "Research", "Product Strategy"],
    link: "https://www.linkedin.com/jobs/search/?keywords=UX%20Designer"
  },
  {
    title: "Product Manager",
    summary: "Align user needs, business goals, and product execution.",
    riasec: ["E", "I", "C"],
    mbti: ["ENTJ", "ENFJ", "INTJ", "ESTJ"],
    skills: ["Product Strategy", "Project Management", "Communication", "Data Analysis"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Product%20Manager"
  },
  {
    title: "Marketing Strategist",
    summary: "Plan and optimize campaigns across digital channels.",
    riasec: ["A", "E", "S"],
    mbti: ["ENFP", "ENFJ", "ENTP", "ESFP"],
    skills: ["Digital Marketing", "Content Writing", "Communication", "Data Analysis"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Marketing%20Strategist"
  },
  {
    title: "Financial Analyst",
    summary: "Evaluate business performance, risk, and growth options.",
    riasec: ["C", "I", "E"],
    mbti: ["INTJ", "ISTJ", "ENTJ", "ESTJ"],
    skills: ["Financial Analysis", "Data Analysis", "Critical Thinking", "Operations Planning"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Financial%20Analyst"
  },
  {
    title: "Human Resources Specialist",
    summary: "Support hiring, talent growth, and workplace culture.",
    riasec: ["S", "E", "C"],
    mbti: ["ENFJ", "ESFJ", "ISFJ", "ENFP"],
    skills: ["Communication", "Negotiation", "Customer Support", "Team Leadership"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Human%20Resources%20Specialist"
  },
  {
    title: "Instructional Designer",
    summary: "Create impactful learning materials and training systems.",
    riasec: ["A", "S", "I"],
    mbti: ["INFJ", "INFP", "ENFJ", "ISFJ"],
    skills: ["Teaching", "Content Writing", "Research", "Communication"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Instructional%20Designer"
  },
  {
    title: "Operations Analyst",
    summary: "Improve workflows, systems, and process efficiency.",
    riasec: ["C", "I", "E"],
    mbti: ["ISTJ", "ESTJ", "INTJ", "ENTJ"],
    skills: ["Operations Planning", "Project Management", "Data Analysis", "Quality Assurance"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Operations%20Analyst"
  },
  {
    title: "Sales Consultant",
    summary: "Convert opportunities into revenue through consultative selling.",
    riasec: ["E", "S", "R"],
    mbti: ["ENTJ", "ESTP", "ESFP", "ENFJ"],
    skills: ["Sales", "Negotiation", "Public Speaking", "Communication"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Sales%20Consultant"
  },
  {
    title: "QA Engineer",
    summary: "Protect product quality with testing and automation.",
    riasec: ["C", "R", "I"],
    mbti: ["ISTJ", "ISTP", "INTP", "ISFJ"],
    skills: ["Quality Assurance", "Software Development", "Critical Thinking", "Problem Solving"],
    link: "https://www.linkedin.com/jobs/search/?keywords=QA%20Engineer"
  },
  {
    title: "Customer Success Manager",
    summary: "Help clients achieve value and long-term retention.",
    riasec: ["S", "E", "C"],
    mbti: ["ENFJ", "ESFJ", "ENFP", "ESTJ"],
    skills: ["Customer Support", "Communication", "Negotiation", "Project Management"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Customer%20Success%20Manager"
  }
];

function calculateScore(career, selectedRiasec, selectedSkills, selectedMbti) {
  const riasecMatches = career.riasec.filter((code) => selectedRiasec.includes(code));
  const skillMatches = career.skills.filter((skill) => selectedSkills.includes(skill));
  const mbtiMatch = selectedMbti && career.mbti.includes(selectedMbti);

  const riasecScore = selectedRiasec.length
    ? (riasecMatches.length / Math.min(selectedRiasec.length, career.riasec.length)) * 40
    : 0;

  const skillBase = Math.min(Math.max(selectedSkills.length, 1), 4);
  const skillScore = selectedSkills.length ? (skillMatches.length / skillBase) * 45 : 0;
  const mbtiScore = mbtiMatch ? 15 : 0;

  return {
    ...career,
    score: Math.min(99, Math.round(riasecScore + skillScore + mbtiScore)),
    matchedRiasec: riasecMatches,
    matchedSkills: skillMatches,
    matchedMbti: mbtiMatch ? selectedMbti : null
  };
}

export function getRecommendations(selectedRiasec, selectedSkills, selectedMbti) {
  if (!selectedRiasec.length || !selectedSkills.length || !selectedMbti) return [];

  return CAREER_LIBRARY.map((career) =>
    calculateScore(career, selectedRiasec, selectedSkills, selectedMbti)
  )
    .filter((career) => career.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
