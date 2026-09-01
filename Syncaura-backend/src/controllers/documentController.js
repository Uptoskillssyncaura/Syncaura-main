import pool from "../config/db.js";
import { createPDF } from "../utils/exportUtils.js";
import ExcelJS from "exceljs";

/**
 * CREATE DOCUMENT
 */
export const createDocument = async (req, res) => {
  try {
    const { title, content, projectId, category, type, description } = req.body;

    const docTitle = (
      title ||
      (category && category !== "Select category" ? `${category} - ${type || "Report"}` : null) ||
      type ||
      description ||
      "New Document"
    ).trim();

    const docContent = content || description || "";

    const result = await pool.query(
      "INSERT INTO documents (title, content, project_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [docTitle, docContent, projectId || null, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE DOCUMENT
 */
export const getDocumentById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents WHERE id = $1", [req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Document not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL DOCUMENTS
 */
export const getAllDocuments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE DOCUMENT (with version control)
 */
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const currentResult = await pool.query("SELECT * FROM documents WHERE id = $1", [id]);
    if (currentResult.rowCount === 0) return res.status(404).json({ message: "Document not found" });

    const currentDoc = currentResult.rows[0];

    // Save version
    await pool.query(
      "INSERT INTO document_versions (document_id, content, edited_by) VALUES ($1, $2, $3)",
      [id, currentDoc.content, req.user.id]
    );

    // Update doc
    const updateResult = await pool.query(
      "UPDATE documents SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [title || currentDoc.title, content || currentDoc.content, id]
    );

    res.json({ message: "Document updated", document: updateResult.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE DOCUMENT
 */
export const deleteDocument = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM documents WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET DOCUMENT VERSIONS
 */
export const getDocumentVersions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT dv.*, u.name as editor_name FROM document_versions dv LEFT JOIN users u ON dv.edited_by = u.id WHERE dv.document_id = $1 ORDER BY dv.edited_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exportDocumentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM documents WHERE id = $1", [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Document not found" });

    const doc = result.rows[0];
    const pdfData = await createPDF(doc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${doc.title}.pdf`);
    res.send(pdfData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export document as Excel
export const exportDocumentExcel = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const doc = result.rows[0];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Document");

    sheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Content", key: "content", width: 50 },
      { header: "Project ID", key: "projectId", width: 30 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    sheet.addRow({
      title: doc.title,
      content: doc.content,
      projectId: String(doc.project_id),
      createdAt: doc.created_at.toISOString(),
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="document.xlsx"'
    );
    res.setHeader("Content-Length", buffer.length);

    res.end(buffer);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: error.message });
  }
};

