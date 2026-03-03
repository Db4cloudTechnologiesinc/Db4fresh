

// // import jwt from "jsonwebtoken";

// // export const requireAuth = (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return res.status(401).json({ message: "Authorization token required" });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     const decoded = jwt.verify(
// //       token,
// //       process.env.JWT_SECRET || "SECRET_KEY"
// //     );

// //     // 🔥 NORMALIZE USER ID (CRITICAL)
// //     const userId =
// //       decoded.id ||
// //       decoded.userId ||
// //       decoded.user_id;

// //     if (!userId) {
// //       console.error("JWT missing user id:", decoded);
// //       return res.status(401).json({ message: "Invalid token payload" });
// //     }

// //     req.user = {
// //       id: userId,
// //       email: decoded.email || null,
// //     };

// //     next();
// //   } catch (err) {
// //     console.error("JWT error:", err.message);
// //     return res.status(401).json({ message: "Invalid or expired token" });
// //   }
// // };

// // export default requireAuth;
// import jwt from "jsonwebtoken";

// const deliveryAuthMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Authorization token required"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     // ❌ Never use fallback secret
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     if (!decoded || !decoded.id) {
//       return res.status(401).json({
//         message: "Invalid token payload"
//       });
//     }

//     req.user = {
//       id: decoded.id,
//       email: decoded.email || null
//     };

//     next();

//   } catch (err) {
//     console.error("JWT error:", err.message);
//     return res.status(401).json({
//       message: "Invalid or expired token"
//     });
//   }
// };

// export default deliveryAuthMiddleware;
import jwt from "jsonwebtoken";

/* =========================
   REQUIRE AUTH (JWT CHECK)
========================= */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
<<<<<<< HEAD
      process.env.JWT_SECRET
=======
      process.env.ADMIN_SECRET || "ADMIN_SECRET"
>>>>>>> 1b1f779f33a8e28559a72481ec8b515e00342974
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    req.user = {
<<<<<<< HEAD
      id: decoded.id,
      email: decoded.email || null
=======
  id: decoded.id || decoded.user_id,
  email: decoded.email,
};
    /* =========================
       Attach user info
       decoded contains:
       { id, role, warehouse_id }
    ========================= */
    req.user = {
      id: decoded.id,
      role: decoded.role,
      warehouse_id: decoded.warehouse_id || null,
>>>>>>> 1b1f779f33a8e28559a72481ec8b515e00342974
    };

    next();

  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

<<<<<<< HEAD
// Also export as default
export default requireAuth;
=======
/* =========================
   AUTHORIZE ROLES
========================= */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default requireAuth;

>>>>>>> 1b1f779f33a8e28559a72481ec8b515e00342974
