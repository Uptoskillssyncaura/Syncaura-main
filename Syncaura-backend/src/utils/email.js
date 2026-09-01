import nodemailer from 'nodemailer';
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

if (!isEmailEnabled) {
  console.log("⚠️  [Email Utility] Disabled or using placeholder credentials. OTP/Reset emails will be simulated.");
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

export const sendPasswordOtpEmail = async ({ to, name, otp }) => {
  if (!isEmailEnabled) {
    console.log(`[Email Skipped] OTP email for ${name} (${to}): OTP is ${otp}`);
    return;
  }

  const html = `
    <p>Hi ${name},</p>
    <p>Your OTP for password reset is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || emailUser,
    to,
    subject: 'Your Password Reset OTP',
    html
  });
};

export const sendPasswordChangedEmail = async ({ to, name }) => {
  if (!isEmailEnabled) {
    console.log(`[Email Skipped] Password changed confirmation for ${name} (${to})`);
    return;
  }

  const html = `
    <p>Hi ${name},</p>
    <p>Your password has been successfully changed.</p>
    <p>If you did not perform this action, please contact support immediately.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || emailUser,
    to,
    subject: 'Password Changed Successfully',
    html
  });
};

export const sendResetEmail = async ({ to, name, token }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;

  if (!isEmailEnabled) {
    console.log(`[Email Skipped] Password reset email for ${name} (${to}): Reset URL is ${resetUrl}`);
    return;
  }

  const html = `
    <p>Hi ${name},</p>
    <p>You requested a password reset. Click the link below to reset your password. This link expires in ${process.env.RESET_TOKEN_EXPIRES_MIN} minutes.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || emailUser,
    to,
    subject: 'Reset your password',
    html
  });
};
