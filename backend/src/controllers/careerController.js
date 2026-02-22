import { getCareerPathCatalog } from '../services/careerService.js';

export async function getCareerPaths(req, res) {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const paths = await getCareerPathCatalog({ q });

  res.json({
    success: true,
    data: paths
  });
}
