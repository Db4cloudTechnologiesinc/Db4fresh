import multer from "multer";

const storage = multer.memoryStorage(); // required for cloudinary upload_stream

const upload = multer({ storage });

export default upload;
