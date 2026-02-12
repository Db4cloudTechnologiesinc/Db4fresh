import jwt from "jsonwebtoken";

export default function userAuth(req, res, next) {
  console.log("🔥 AUTH MIDDLEWARE HIT");
  console.log("Authorization header:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    console.error("User auth error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }

}