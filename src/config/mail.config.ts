import nodemailer from "nodemailer";
import ENV from "./env";

export const transporter = nodemailer.createTransport({
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  secure: ENV.EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});
