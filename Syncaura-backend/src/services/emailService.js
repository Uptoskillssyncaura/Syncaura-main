import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER || "";
const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || "";

const hasPlaceholders =
  !emailUser ||
  emailUser === "your_ethereal_username" ||
  !emailPass ||
  emailPass === "your_ethereal_password";

const isEmailEnabled = process.env.EMAIL_ENABLED !== "false" && !hasPlaceholders;

// Log status on module load
if (!isEmailEnabled) {
  console.log("⚠️  [Email Service] Disabled or using placeholder credentials. SMTP emails will be skipped.");
}

const transporter = isEmailEnabled
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true" || false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  : null;

export const sendEmail = async (toOrObj, subject, text) => {
  const to = typeof toOrObj === "object" && toOrObj !== null ? toOrObj.to : toOrObj;

  if (!isEmailEnabled) {
    console.log(`[Email Skipped] SMTP not configured. Would send email to: ${to}`);
    return { messageId: "skipped-not-configured" };
  }

  const fromAddress = process.env.EMAIL_FROM || emailUser;
  
  if (typeof toOrObj === "object" && toOrObj !== null) {
    const { subject: objSubject, text: objText, html } = toOrObj;
    return await transporter.sendMail({
      from: fromAddress,
      to,
      subject: objSubject,
      text: objText,
      html,
    });
  }

  return await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
  });
};