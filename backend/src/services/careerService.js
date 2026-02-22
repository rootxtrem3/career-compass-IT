import { getCareerProfiles } from '../repositories/careerRepository.js';

export async function getCareerPathCatalog({ q = '' } = {}) {
  const careers = await getCareerProfiles();
  const search = q.trim().toLowerCase();

  const filtered = search
    ? careers.filter((career) => {
        const haystack = `${career.title} ${career.description} ${career.experience_level}`.toLowerCase();
        return haystack.includes(search);
      })
    : careers;

  return filtered.map((career) => ({
    careerId: career.id,
    slug: career.slug,
    title: career.title,
    description: career.description,
    experienceLevel: career.experience_level,
    medianSalaryUsd: career.median_salary_usd,
    requiredSkills: (career.required_skills || []).map((skill) => ({
      skillId: Number(skill.skillId),
      name: skill.name,
      category: skill.category,
      importance: Number(skill.importance),
      minLevel: skill.minLevel
    })),
    certifications: (career.certifications || []).map((cert) => ({
      certificationId: cert.certificationId,
      name: cert.name,
      provider: cert.provider,
      isRequired: Boolean(cert.isRequired),
      notes: cert.notes || null
    }))
  }));
}
