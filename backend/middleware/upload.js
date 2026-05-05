
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// /* ===============================
//    DYNAMIC DESTINATION (DISK STORAGE)
// =============================== */
// const getUploadDir = (file) => {
//   if (file.fieldname === "images") {
//     return "uploads/products";
//   }

//   if (file.fieldname === "image") {
//     return "uploads/subcategories";
//   }

//   if (file.fieldname === "license_image") {
//     return "uploads/delivery";
//   }
//   if (file.fieldname === "document") {
//   return "uploads/delivery";
// }

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
//    DISK STORAGE CONFIG
// =============================== */
// const diskStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = getUploadDir(file);
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
//    MEMORY STORAGE (FOR DB FILES)
// =============================== */
// const memoryStorage = multer.memoryStorage();

// /* ===============================
//    FILE FILTER
// =============================== */
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG, PNG, WEBP images allowed"), false);
//   }
// };

// /* ===============================
//    DISK UPLOAD (DEFAULT)
// =============================== */
// export const uploadDisk = multer({
//   storage: diskStorage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// /* ===============================
//    MEMORY UPLOAD (FOR DOCUMENTS)
// =============================== */
// export const uploadMemory = multer({
//   storage: memoryStorage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// export default uploadDisk;
import multer from "multer";
import path from "path";
import fs from "fs";

/* ===============================
   DYNAMIC DESTINATION (DISK STORAGE)
=============================== */
const getUploadDir = (file) => {
  if (file.fieldname === "images") {
    return "uploads/products";
  }

  if (file.fieldname === "image") {
    return "uploads/subcategories";
  }

  if (file.fieldname === "license_image") {
    return "uploads/delivery";
  }

  if (file.fieldname === "document") {
    return "uploads/delivery";
  }

  // ✅ Excel uploads
  if (file.fieldname === "file") {
    return "uploads/excel";
  }

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
   DISK STORAGE CONFIG
=============================== */
const diskStorage = multer.diskStorage({
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
   FILE FILTER (IMAGES + EXCEL)
=============================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",

    // Excel
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG, WEBP images & Excel files are allowed"),
      false
    );
  }
};

/* ===============================
   UPLOAD INSTANCE
=============================== */
export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;