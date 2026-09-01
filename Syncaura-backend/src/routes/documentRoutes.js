import express from "express";
const router = express.Router();
import {
  createDocument,
  getDocumentById,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getDocumentVersions,
  exportDocumentPDF,
  exportDocumentExcel
} from "../controllers/documentController.js";
import { auth } from "../middlewares/auth.js";

// All routes protected
router.post("/", auth, createDocument);
router.get("/", auth, getAllDocuments); // optional
router.get("/:id", auth, getDocumentById);
router.put("/:id", auth, updateDocument);
router.delete("/:id", auth, deleteDocument);
router.get("/:id/versions", auth, getDocumentVersions);
// Export routes
router.get("/:id/export/pdf", exportDocumentPDF);
router.get("/:id/export/excel", (req, res, next) => {
  res.setTimeout(0); // prevent async timeout issues
  next();
}, exportDocumentExcel);

export default router;
