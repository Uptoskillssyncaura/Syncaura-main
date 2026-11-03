import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

// Create PDF from document
export const createPDF = (doc) => {
  const pdfDoc = new PDFDocument();
  let buffers = [];

  pdfDoc.on("data", buffers.push.bind(buffers));
  pdfDoc.on("end", () => {});

  pdfDoc.fontSize(20).text(doc.title, { underline: true });
  pdfDoc.moveDown();
  pdfDoc.fontSize(14).text(doc.content);

  pdfDoc.end();

  return new Promise((resolve) => {
    pdfDoc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
};

// Create Excel from document
export const createExcel = async (doc) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Document");

  sheet.columns = [
    { header: "Title", key: "title", width: 30 },
    { header: "Content", key: "content", width: 50 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  sheet.addRow({
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });

  return workbook.xlsx.writeBuffer();
};
