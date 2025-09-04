import express from "express";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Routes
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.get("/download/:id", downloadDocument);
router.delete("/:id", deleteDocument);

export default router;