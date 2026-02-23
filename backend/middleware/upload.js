// import multer from "multer";
// import path from "path";
// import fs from "fs";

// /* ===============================
//    DYNAMIC DESTINATION
// =============================== */
// const getUploadDir = (req, file) => {
//   // multiple product images
//   if (file.fieldname === "images") {
//     return "uploads/products";
//   }

//   // single subcategory image
//   if (file.fieldname === "image") {
//     return "uploads/subcategories";
//   }

//   // fallback
//   return "uploads/others";
// };

// /* ===============================
//    ENSURE DIR EXISTS
// =============================== */
// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// /* ===============================
//    STORAGE CONFIG
// =============================== */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = getUploadDir(req, file);
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// /* ===============================
//    FILE FILTER
// =============================== */
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/webp"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG, PNG, WEBP images allowed"), false);
//   }
// };

// /* ===============================
//    UPLOAD INSTANCE
// =============================== */
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// export default upload;
import multer from "multer";
import path from "path";
import fs from "fs";

/* ===============================
   DYNAMIC DESTINATION
=============================== */
const getUploadDir = (file) => {
  // Product multiple images
  if (file.fieldname === "images") {
    return "uploads/products";
  }

  // Subcategory single image
  if (file.fieldname === "image") {
    return "uploads/subcategories";
  }

  // ✅ Delivery partner license
  if (file.fieldname === "license_image") {
    return "uploads/delivery";
  }

  // Fallback
  return "uploads/others";
};

/* ===============================
   ENSURE DIR EXISTS
=============================== */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* ===============================
   STORAGE CONFIG
=============================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUploadDir(file);
    ensureDir(dir);
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* ===============================
   FILE FILTER
=============================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images allowed"), false);
  }
};

/* ===============================
   UPLOAD INSTANCE
=============================== */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
