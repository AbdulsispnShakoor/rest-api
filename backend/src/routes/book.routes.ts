import express from "express";
const router = express.Router();
import multer from "multer";
import { createBook } from "../controllers/book.controller";

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.fieldname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 },
}); // Limit files to 30MB    });

// routes for authentication purposes
router.get("/all-books");
router.get("/all-books/:id");
router.post(
  "/create-book",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);
router.patch("/update-book/:id");
router.delete("/delete-book/:id");
export default router;
