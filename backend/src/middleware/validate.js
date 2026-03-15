export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid request body.", details: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
