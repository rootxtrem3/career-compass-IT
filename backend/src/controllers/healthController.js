export function getHealth(_req, res) {
  res.json({
    success: true,
    message: 'Career Compass API is healthy',
    timestamp: new Date().toISOString()
  });
}
