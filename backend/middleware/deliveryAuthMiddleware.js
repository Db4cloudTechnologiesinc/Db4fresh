import jwt from "jsonwebtoken";


const deliveryAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // ⚠️ This must exist
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default deliveryAuthMiddleware;