

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    // 🔥 NORMALIZE USER ID (CRITICAL)
    const userId =
      decoded.id ||
      decoded.userId ||
      decoded.user_id;

    if (!userId) {
      console.error("JWT missing user id:", decoded);
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      id: userId,
      email: decoded.email || null,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default requireAuth;
