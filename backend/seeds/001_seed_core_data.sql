INSERT INTO riasec_codes (code, name, description)
VALUES
  ('R', 'Realistic', 'Hands-on, practical, and technical work.'),
  ('I', 'Investigative', 'Analytical, research-heavy, and problem-solving work.'),
  ('A', 'Artistic', 'Creative, expressive, and design-oriented work.'),
  ('S', 'Social', 'Supportive, educational, and interpersonal work.'),
  ('E', 'Enterprising', 'Leadership, persuasion, and business execution.'),
  ('C', 'Conventional', 'Structured, detail-oriented, and process-driven work.')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description;

INSERT INTO mbti_types (code, title)
VALUES
  ('INTJ', 'Architect'), ('INTP', 'Logician'), ('ENTJ', 'Commander'), ('ENTP', 'Debater'),
  ('INFJ', 'Advocate'), ('INFP', 'Mediator'), ('ENFJ', 'Protagonist'), ('ENFP', 'Campaigner'),
  ('ISTJ', 'Logistician'), ('ISFJ', 'Defender'), ('ESTJ', 'Executive'), ('ESFJ', 'Consul'),
  ('ISTP', 'Virtuoso'), ('ISFP', 'Adventurer'), ('ESTP', 'Entrepreneur'), ('ESFP', 'Entertainer')
ON CONFLICT (code) DO UPDATE
SET title = EXCLUDED.title;

INSERT INTO skills (name, category)
VALUES
  ('Communication', 'soft-skill'),
  ('Data Analysis', 'technical'),
  ('Problem Solving', 'soft-skill'),
  ('Critical Thinking', 'soft-skill'),
  ('Project Management', 'business'),
  ('Team Leadership', 'leadership'),
  ('Public Speaking', 'soft-skill'),
  ('Digital Marketing', 'business'),
  ('Sales', 'business'),
  ('UI/UX Design', 'creative'),
  ('Content Writing', 'creative'),
  ('Research', 'technical'),
  ('Teaching', 'education'),
  ('Software Development', 'technical'),
  ('Quality Assurance', 'technical'),
  ('Customer Support', 'service'),
  ('Negotiation', 'business'),
  ('Financial Analysis', 'business'),
  ('Operations Planning', 'business'),
  ('Product Strategy', 'business'),
  ('Time Management', 'soft-skill'),
  ('Adaptability', 'soft-skill'),
  ('Decision Making', 'soft-skill'),
  ('Conflict Resolution', 'soft-skill'),
  ('Stakeholder Management', 'leadership'),
  ('Mentorship', 'leadership'),
  ('Cross-functional Collaboration', 'leadership'),
  ('Business Analysis', 'business'),
  ('Market Research', 'business'),
  ('Budgeting', 'business'),
  ('Risk Management', 'business'),
  ('Strategic Planning', 'business'),
  ('Business Development', 'business'),
  ('SQL', 'technical'),
  ('Python', 'technical'),
  ('JavaScript', 'technical'),
  ('TypeScript', 'technical'),
  ('API Design', 'technical'),
  ('Cloud Computing', 'technical'),
  ('DevOps', 'technical'),
  ('Cybersecurity Fundamentals', 'technical'),
  ('Data Visualization', 'technical'),
  ('Machine Learning', 'technical'),
  ('Testing Automation', 'technical'),
  ('Wireframing', 'creative'),
  ('Prototyping', 'creative'),
  ('Visual Design', 'creative'),
  ('Brand Strategy', 'creative'),
  ('Copywriting', 'creative'),
  ('SEO', 'business'),
  ('SEM', 'business'),
  ('Email Marketing', 'business'),
  ('Social Media Strategy', 'business'),
  ('CRM Management', 'business'),
  ('Customer Journey Mapping', 'service'),
  ('Client Onboarding', 'service'),
  ('Account Management', 'service'),
  ('Presentation Skills', 'soft-skill'),
  ('Technical Writing', 'technical'),
  ('Agile Methodology', 'business'),
  ('Scrum', 'business'),
  ('Kanban', 'business'),
  ('Excel', 'technical'),
  ('Power BI', 'technical'),
  ('Tableau', 'technical'),
  ('Leadership Communication', 'leadership'),
  ('Coaching', 'leadership'),
  ('Interviewing', 'service'),
  ('Process Improvement', 'business'),
  ('Documentation', 'technical'),
  ('Stakeholder Reporting', 'business'),
  ('Data Governance', 'technical'),
  ('Data Cleaning', 'technical'),
  ('Prompt Engineering', 'technical'),
  ('AI Tooling', 'technical'),
  ('Cloud Architecture', 'technical'),
  ('Network Fundamentals', 'technical'),
  ('Systems Design', 'technical'),
  ('Microservices', 'technical'),
  ('Frontend Development', 'technical'),
  ('Backend Development', 'technical'),
  ('Mobile Development', 'technical'),
  ('Accessibility', 'technical'),
  ('Localization', 'technical'),
  ('Growth Strategy', 'business'),
  ('Partnership Development', 'business'),
  ('Revenue Operations', 'business'),
  ('Sales Enablement', 'business'),
  ('Demand Forecasting', 'business'),
  ('Procurement', 'business'),
  ('Vendor Management', 'business'),
  ('Event Marketing', 'business'),
  ('Campaign Optimization', 'business'),
  ('Brand Storytelling', 'creative'),
  ('UX Research Ops', 'creative'),
  ('Service Design', 'creative'),
  ('Instructional Coaching', 'education'),
  ('Curriculum Design', 'education'),
  ('Change Management', 'leadership'),
  ('Performance Management', 'leadership'),
  ('Compliance Management', 'business')
ON CONFLICT (name) DO UPDATE
SET category = EXCLUDED.category;

INSERT INTO certifications (name, provider)
VALUES
  ('AWS Certified Developer', 'Amazon'),
  ('Google Data Analytics Professional Certificate', 'Google'),
  ('PMP', 'Project Management Institute'),
  ('Scrum Master Certification', 'Scrum Alliance'),
  ('HubSpot Content Marketing', 'HubSpot'),
  ('Meta Social Media Marketing', 'Meta')
ON CONFLICT (name) DO UPDATE
SET provider = EXCLUDED.provider;

INSERT INTO careers (slug, title, description, experience_level, median_salary_usd, metadata)
VALUES
  ('data-scientist', 'Data Scientist', 'Build predictive models and decision intelligence from structured and unstructured data.', 'mid', 124000, '{"demand":"high"}'),
  ('software-engineer', 'Software Engineer', 'Design and ship reliable software systems across frontend and backend stacks.', 'mid', 118000, '{"demand":"high"}'),
  ('ux-designer', 'UX Designer', 'Create intuitive, user-centered digital experiences and design systems.', 'entry', 92000, '{"demand":"high"}'),
  ('product-manager', 'Product Manager', 'Own product outcomes by aligning user needs, delivery, and business goals.', 'mid', 126000, '{"demand":"high"}'),
  ('marketing-strategist', 'Marketing Strategist', 'Plan growth campaigns and optimize conversion across channels.', 'mid', 89000, '{"demand":"medium"}'),
  ('financial-analyst', 'Financial Analyst', 'Analyze financial data to support strategic decisions and risk management.', 'entry', 85000, '{"demand":"medium"}'),
  ('operations-analyst', 'Operations Analyst', 'Improve process efficiency and operating models with measurable outcomes.', 'mid', 91000, '{"demand":"medium"}'),
  ('customer-success-manager', 'Customer Success Manager', 'Drive retention and customer outcomes through consultative support.', 'mid', 88000, '{"demand":"high"}')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    experience_level = EXCLUDED.experience_level,
    median_salary_usd = EXCLUDED.median_salary_usd,
    metadata = EXCLUDED.metadata,
    is_active = TRUE;

INSERT INTO career_riasec (career_id, riasec_code, weight)
SELECT c.id, x.riasec_code, x.weight
FROM careers c
JOIN (
  VALUES
    ('data-scientist', 'I', 1.00), ('data-scientist', 'C', 0.70),
    ('software-engineer', 'I', 0.90), ('software-engineer', 'R', 0.70), ('software-engineer', 'C', 0.50),
    ('ux-designer', 'A', 0.90), ('ux-designer', 'I', 0.50), ('ux-designer', 'S', 0.60),
    ('product-manager', 'E', 0.90), ('product-manager', 'I', 0.70), ('product-manager', 'C', 0.60),
    ('marketing-strategist', 'A', 0.80), ('marketing-strategist', 'E', 0.90), ('marketing-strategist', 'S', 0.60),
    ('financial-analyst', 'I', 0.90), ('financial-analyst', 'C', 1.00), ('financial-analyst', 'E', 0.50),
    ('operations-analyst', 'I', 0.70), ('operations-analyst', 'C', 1.00), ('operations-analyst', 'E', 0.50),
    ('customer-success-manager', 'S', 0.90), ('customer-success-manager', 'E', 0.80), ('customer-success-manager', 'C', 0.50)
) AS x(slug, riasec_code, weight)
ON c.slug = x.slug
ON CONFLICT (career_id, riasec_code) DO UPDATE
SET weight = EXCLUDED.weight;

INSERT INTO career_mbti (career_id, mbti_code, weight)
SELECT c.id, x.mbti_code, x.weight
FROM careers c
JOIN (
  VALUES
    ('data-scientist', 'INTJ', 1.00), ('data-scientist', 'INTP', 0.90), ('data-scientist', 'ISTJ', 0.70),
    ('software-engineer', 'INTP', 1.00), ('software-engineer', 'INTJ', 0.90), ('software-engineer', 'ISTP', 0.70),
    ('ux-designer', 'INFP', 1.00), ('ux-designer', 'INFJ', 0.80), ('ux-designer', 'ENFP', 0.70),
    ('product-manager', 'ENTJ', 1.00), ('product-manager', 'ENFJ', 0.70), ('product-manager', 'ESTJ', 0.70),
    ('marketing-strategist', 'ENFP', 1.00), ('marketing-strategist', 'ENFJ', 0.80), ('marketing-strategist', 'ENTP', 0.70),
    ('financial-analyst', 'ISTJ', 1.00), ('financial-analyst', 'INTJ', 0.80), ('financial-analyst', 'ESTJ', 0.70),
    ('operations-analyst', 'ESTJ', 0.90), ('operations-analyst', 'ISTJ', 1.00), ('operations-analyst', 'ENTJ', 0.70),
    ('customer-success-manager', 'ENFJ', 1.00), ('customer-success-manager', 'ESFJ', 0.80), ('customer-success-manager', 'ENFP', 0.70)
) AS x(slug, mbti_code, weight)
ON c.slug = x.slug
ON CONFLICT (career_id, mbti_code) DO UPDATE
SET weight = EXCLUDED.weight;

INSERT INTO career_skill_requirements (career_id, skill_id, importance, min_level)
SELECT c.id, s.id, x.importance, x.min_level
FROM careers c
JOIN (
  VALUES
    ('data-scientist', 'Data Analysis', 1.00, 'advanced'),
    ('data-scientist', 'Research', 0.80, 'working'),
    ('data-scientist', 'Critical Thinking', 0.80, 'advanced'),
    ('data-scientist', 'Problem Solving', 0.70, 'advanced'),

    ('software-engineer', 'Software Development', 1.00, 'advanced'),
    ('software-engineer', 'Problem Solving', 0.80, 'advanced'),
    ('software-engineer', 'Critical Thinking', 0.70, 'working'),
    ('software-engineer', 'Quality Assurance', 0.60, 'working'),

    ('ux-designer', 'UI/UX Design', 1.00, 'advanced'),
    ('ux-designer', 'Research', 0.70, 'working'),
    ('ux-designer', 'Communication', 0.70, 'working'),
    ('ux-designer', 'Product Strategy', 0.50, 'basic'),

    ('product-manager', 'Product Strategy', 1.00, 'advanced'),
    ('product-manager', 'Project Management', 0.90, 'advanced'),
    ('product-manager', 'Communication', 0.70, 'working'),
    ('product-manager', 'Data Analysis', 0.60, 'working'),

    ('marketing-strategist', 'Digital Marketing', 1.00, 'advanced'),
    ('marketing-strategist', 'Content Writing', 0.70, 'working'),
    ('marketing-strategist', 'Communication', 0.70, 'working'),
    ('marketing-strategist', 'Data Analysis', 0.60, 'working'),

    ('financial-analyst', 'Financial Analysis', 1.00, 'advanced'),
    ('financial-analyst', 'Data Analysis', 0.80, 'advanced'),
    ('financial-analyst', 'Critical Thinking', 0.70, 'working'),
    ('financial-analyst', 'Operations Planning', 0.40, 'basic'),

    ('operations-analyst', 'Operations Planning', 1.00, 'advanced'),
    ('operations-analyst', 'Project Management', 0.80, 'working'),
    ('operations-analyst', 'Data Analysis', 0.70, 'working'),
    ('operations-analyst', 'Quality Assurance', 0.60, 'working'),

    ('customer-success-manager', 'Customer Support', 1.00, 'advanced'),
    ('customer-success-manager', 'Communication', 0.90, 'advanced'),
    ('customer-success-manager', 'Project Management', 0.70, 'working'),
    ('customer-success-manager', 'Negotiation', 0.70, 'working')
) AS x(slug, skill_name, importance, min_level)
ON c.slug = x.slug
JOIN skills s ON s.name = x.skill_name
ON CONFLICT (career_id, skill_id) DO UPDATE
SET importance = EXCLUDED.importance,
    min_level = EXCLUDED.min_level;

INSERT INTO career_certification_requirements (career_id, certification_id, is_required, notes)
SELECT c.id, cert.id, x.is_required, x.notes
FROM careers c
JOIN (
  VALUES
    ('data-scientist', 'Google Data Analytics Professional Certificate', FALSE, 'Useful for entry transitions.'),
    ('software-engineer', 'AWS Certified Developer', FALSE, 'Cloud roles prefer this.'),
    ('product-manager', 'PMP', FALSE, 'Helpful for complex programs.'),
    ('operations-analyst', 'Scrum Master Certification', FALSE, 'Helpful for agile operations.'),
    ('marketing-strategist', 'Meta Social Media Marketing', FALSE, 'Useful for social channel roles.')
) AS x(slug, cert_name, is_required, notes)
ON c.slug = x.slug
JOIN certifications cert ON cert.name = x.cert_name
ON CONFLICT (career_id, certification_id) DO UPDATE
SET is_required = EXCLUDED.is_required,
    notes = EXCLUDED.notes;

INSERT INTO job_sources (source_key, base_url)
VALUES ('remotive', 'https://remotive.com/api/remote-jobs')
ON CONFLICT (source_key) DO UPDATE
SET base_url = EXCLUDED.base_url,
    is_active = TRUE;

INSERT INTO job_sources (source_key, base_url)
VALUES ('custom', 'https://your-custom-jobs-api.example.com/jobs')
ON CONFLICT (source_key) DO UPDATE
SET base_url = EXCLUDED.base_url,
    is_active = TRUE;

INSERT INTO jobs (
  source_id,
  external_id,
  career_id,
  title,
  company,
  location,
  remote_type,
  employment_type,
  salary_min,
  salary_max,
  salary_currency,
  apply_url,
  source_url,
  description,
  posted_at,
  raw_payload
)
SELECT
  src.id AS source_id,
  'seed-' || c.slug || '-' || gs.n AS external_id,
  c.id AS career_id,
  CASE
    WHEN gs.n % 4 = 1 THEN 'Junior ' || c.title
    WHEN gs.n % 4 = 2 THEN c.title
    WHEN gs.n % 4 = 3 THEN 'Senior ' || c.title
    ELSE c.title || ' Specialist'
  END AS title,
  CASE (gs.n % 8)
    WHEN 0 THEN 'Northstar Labs'
    WHEN 1 THEN 'Apex Orbit'
    WHEN 2 THEN 'Bluewave Systems'
    WHEN 3 THEN 'Futuregrid'
    WHEN 4 THEN 'Prime Vector'
    WHEN 5 THEN 'Nextline Group'
    WHEN 6 THEN 'Stratos Works'
    ELSE 'Catalyst Core'
  END AS company,
  CASE
    WHEN gs.n % 3 = 0 THEN 'Remote - Global'
    WHEN gs.n % 3 = 1 THEN 'United States'
    ELSE 'Remote - EMEA'
  END AS location,
  'remote' AS remote_type,
  CASE
    WHEN gs.n % 5 = 0 THEN 'contract'
    ELSE 'full_time'
  END AS employment_type,
  (c.median_salary_usd * 0.75)::numeric(12,2) AS salary_min,
  (c.median_salary_usd * 1.15)::numeric(12,2) AS salary_max,
  'USD' AS salary_currency,
  'https://www.linkedin.com/jobs/search/?keywords=' || replace(c.title, ' ', '%20') AS apply_url,
  'https://www.linkedin.com/jobs/search/?keywords=' || replace(c.title, ' ', '%20') AS source_url,
  'Seeded baseline listing for ' || c.title || ' to ensure minimum platform inventory.' AS description,
  NOW() - ((gs.n * 2) || ' days')::interval AS posted_at,
  jsonb_build_object('seeded', TRUE, 'batch', 'baseline-64', 'index', gs.n) AS raw_payload
FROM careers c
CROSS JOIN generate_series(1, 15) AS gs(n)
JOIN job_sources src ON src.source_key = 'remotive'
WHERE c.is_active = TRUE
ON CONFLICT (source_id, external_id) DO UPDATE
SET
  career_id = EXCLUDED.career_id,
  title = EXCLUDED.title,
  company = EXCLUDED.company,
  location = EXCLUDED.location,
  remote_type = EXCLUDED.remote_type,
  employment_type = EXCLUDED.employment_type,
  salary_min = EXCLUDED.salary_min,
  salary_max = EXCLUDED.salary_max,
  salary_currency = EXCLUDED.salary_currency,
  apply_url = EXCLUDED.apply_url,
  source_url = EXCLUDED.source_url,
  description = EXCLUDED.description,
  posted_at = EXCLUDED.posted_at,
  raw_payload = EXCLUDED.raw_payload,
  fetched_at = NOW();

INSERT INTO world_stats (metric_key, label, value, unit, source_name, source_url, snapshot_date, sort_order, metadata)
VALUES
  ('global_unemployment_rate', 'Global unemployment rate', 5.00, '%', 'ILO World Employment and Social Outlook 2025', 'https://www.ilo.org/', DATE '2025-05-15', 1, '{"region":"global"}'),
  ('global_youth_unemployment_rate', 'Global youth unemployment rate', 12.60, '%', 'ILO World Employment and Social Outlook 2025', 'https://www.ilo.org/', DATE '2025-05-15', 2, '{"region":"global"}'),
  ('estimated_jobs_added_2025', 'Estimated jobs added globally in 2025', 53.00, 'million', 'ILO 2025 Update', 'https://www.ilo.org/', DATE '2025-05-15', 3, '{"region":"global"}')
ON CONFLICT (metric_key) DO UPDATE
SET label = EXCLUDED.label,
    value = EXCLUDED.value,
    unit = EXCLUDED.unit,
    source_name = EXCLUDED.source_name,
    source_url = EXCLUDED.source_url,
    snapshot_date = EXCLUDED.snapshot_date,
    sort_order = EXCLUDED.sort_order,
    metadata = EXCLUDED.metadata;
