import pool from "../config/db.js";
import { createPDF } from "../utils/exportUtils.js";
import ExcelJS from "exceljs";

/**
 * CREATE DOCUMENT
 */
export const createDocument = async (req, res) => {
  try {
    const { title, content, projectId, category, type, status, description, file_url, file_name } = req.body;

    const docTitle = (
      title ||
      (category && category !== "Select category" ? `${category} - ${type || "Report"}` : null) ||
      type ||
      description ||
      "New Document"
    ).trim();

    const docContent = content || description || "";
    const docCategory = category || "GENERAL";
    const docType = type || "DOCUMENT";
    const docStatus = status || "Active";

    const result = await pool.query(
      `INSERT INTO documents (title, content, project_id, created_by, category, type, status, file_url, file_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [docTitle, docContent, projectId || null, req.user?.id || null, docCategory, docType, docStatus, file_url || null, file_name || null]
    );

    const newDoc = result.rows[0];

    // Initial version
    await pool.query(
      "INSERT INTO document_versions (document_id, version_number, title, content, edited_by) VALUES ($1, $2, $3, $4, $5)",
      [newDoc.id, "v1.0", docTitle, docContent, req.user?.id || null]
    );

    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE DOCUMENT
 */
export const getDocumentById = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.name as creator_name, p.name as project_name,
      (SELECT COUNT(*) FROM document_versions dv WHERE dv.document_id = d.id) as version_count
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN projects p ON d.project_id = p.id
      WHERE d.id = $1
    `, [req.params.id]);

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
    const result = await pool.query(`
      SELECT d.*, u.name as creator_name, p.name as project_name,
      (SELECT COUNT(*) FROM document_versions dv WHERE dv.document_id = d.id) as version_count
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
    `);
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
    const { title, content, category, type, status } = req.body;

    const currentResult = await pool.query("SELECT * FROM documents WHERE id = $1", [id]);
    if (currentResult.rowCount === 0) return res.status(404).json({ message: "Document not found" });

    const currentDoc = currentResult.rows[0];

    // Count existing versions to increment version number
    const verCountRes = await pool.query("SELECT COUNT(*) FROM document_versions WHERE document_id = $1", [id]);
    const nextVerNum = `v${parseInt(verCountRes.rows[0].count) + 1}.0`;

    // Save version
    await pool.query(
      "INSERT INTO document_versions (document_id, version_number, title, content, edited_by) VALUES ($1, $2, $3, $4, $5)",
      [id, nextVerNum, title || currentDoc.title, content || currentDoc.content, req.user?.id || null]
    );

    // Update doc
    const updateResult = await pool.query(
      `UPDATE documents 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content), 
           category = COALESCE($3, category),
           type = COALESCE($4, type),
           status = COALESCE($5, status),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING *`,
      [title || currentDoc.title, content || currentDoc.content, category || currentDoc.category, type || currentDoc.type, status || currentDoc.status, id]
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
      `SELECT dv.*, u.name as editor_name, u.email as editor_email 
       FROM document_versions dv 
       LEFT JOIN users u ON dv.edited_by = u.id 
       WHERE dv.document_id = $1 
       ORDER BY dv.edited_at DESC`,
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
      { header: "Type", key: "type", width: 15 },
      { header: "Category", key: "category", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Content", key: "content", width: 50 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    sheet.addRow({
      title: doc.title,
      type: doc.type || "DOCUMENT",
      category: doc.category || "GENERAL",
      status: doc.status || "Active",
      content: doc.content,
      createdAt: doc.created_at ? new Date(doc.created_at).toISOString() : "",
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${doc.title}.xlsx"`);
    res.setHeader("Content-Length", buffer.length);

    res.end(buffer);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export All documents as Excel
export const exportAllDocumentsExcel = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.name as creator_name, p.name as project_name
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
    `);
    const docs = result.rows;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Documents & Reports");

    sheet.columns = [
      { header: "ID", key: "id", width: 36 },
      { header: "Title", key: "title", width: 30 },
      { header: "Type", key: "type", width: 15 },
      { header: "Category", key: "category", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Project", key: "project_name", width: 25 },
      { header: "Author", key: "creator_name", width: 20 },
      { header: "Details / Content", key: "content", width: 45 },
      { header: "Created At", key: "created_at", width: 25 },
    ];

    docs.forEach((doc) => {
      sheet.addRow({
        id: doc.id,
        title: doc.title,
        type: doc.type || "DOCUMENT",
        category: doc.category || "GENERAL",
        status: doc.status || "Active",
        project_name: doc.project_name || "General",
        creator_name: doc.creator_name || "Admin",
        content: doc.content || "",
        created_at: doc.created_at ? new Date(doc.created_at).toISOString() : "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="all_documents_report.xlsx"');
    res.setHeader("Content-Length", buffer.length);
    res.end(buffer);
  } catch (error) {
    console.error("Export all error:", error);
    res.status(500).json({ message: error.message });
  }
};

