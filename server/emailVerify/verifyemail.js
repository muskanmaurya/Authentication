import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyemail = async (token, email) => {
    // Build verification link (override with VERIFY_BASE_URL in .env, e.g. http://localhost:5173/verify)
    const base = process.env.VERIFY_BASE_URL || "http://localhost:5173/verify";
    const verificationLink = `${base}?token=${token}`;

    // Load HTML template and inject the verification link
    const templatePath = path.join(__dirname, "template.hbs");
    const template = fs.readFileSync(templatePath, "utf8");
    const htmlToSend = template.replace(/{{\s*verificationLink\s*}}/g, verificationLink);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailconfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email verification",
        html: htmlToSend,
        text: `Verify your email: ${verificationLink}`
    };

    try {
        const info = await transporter.sendMail(mailconfigurations);
        console.log("email sent successfully", info.messageId);
    } catch (error) {
        console.error("email send failed", error);
        throw error;
    }
};