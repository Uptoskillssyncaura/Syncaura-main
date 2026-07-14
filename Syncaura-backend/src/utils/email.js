import nodemailer from 'nodemailer';
import dotenv from "dotenv";

// dotenv.config({ path: "../.env" }); 

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  return await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
};

export const sendPasswordOtpEmail = async ({ to, name, otp }) => {
  const html = `
    <p>Hi ${name},</p>
    <p>Your OTP for password reset is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Password Reset OTP',
    html
  });
};

export const sendPasswordChangedEmail = async ({ to, name }) => {
  const html = `
    <p>Hi ${name},</p>
    <p>Your password has been successfully changed.</p>
    <p>If you did not perform this action, please contact support immediately.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Password Changed Successfully',
    html
  });
};

export const sendResetEmail = async ({ to, name, token }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Hi ${name},</p>
    <p>You requested a password reset. Click the link below to reset your password. This link expires in ${process.env.RESET_TOKEN_EXPIRES_MIN} minutes.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your password',
    html
  });
};
