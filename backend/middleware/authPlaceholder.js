// Simple placeholder — replace with real JWT auth in production
export default function authPlaceholder(req, res, next) {
  // Try Authorization Bearer token (if you have JWT) or x-user-id header (quick test)
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    // TODO: verify JWT here and set req.userId
    // For now, we assume token is user id string for testing (not secure)
    req.userId = header.slice(7);
    return next();
  }

  const quick = req.headers["x-user-id"];
  if (quick) {
    req.userId = String(quick);
    return next();
  }

  return res.status(401).json({ success: false, message: "Unauthorized. Provide x-user-id or Authorization header." });
}
