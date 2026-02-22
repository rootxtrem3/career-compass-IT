export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode || 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error.details || null
  });
}
