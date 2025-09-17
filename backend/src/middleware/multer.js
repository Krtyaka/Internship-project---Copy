import multer from "multer";

const storage = multer.memoryStorage(); // store files in memory for Cloudinary upload

// ✅ Allowed MIME types (PDF, DOC, DOCX, Images)
const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Allowed: pdf, doc, docx, jpg, png, gif"
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 120 * 1024 * 1024 }, // 120 MB max
  fileFilter,
});

export default upload;
