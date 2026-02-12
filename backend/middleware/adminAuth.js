import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not an admin" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Admin auth failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}
