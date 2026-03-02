
import jwt from "jsonwebtoken";

const deliveryAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ MATCH CONTROLLERS
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default deliveryAuthMiddleware;