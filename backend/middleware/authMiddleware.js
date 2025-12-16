// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];

//   if (!token)
//     return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, "SECRET123", (err, decoded) => {
//     if (err)
//       return res.status(401).json({ message: "Invalid token" });

//     req.user = decoded;  // user id, email inside token
//     next();
//   });
// };
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization?.split(" ")[1];
    if (!auth) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}
