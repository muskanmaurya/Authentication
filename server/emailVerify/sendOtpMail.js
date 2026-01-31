import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (email, otp) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD
		}
	});

	const htmlToSend = `
		<div style="font-family: Arial, sans-serif; color: #1f2937;">
			<h2 style="color: #111827;">Password Reset OTP</h2>
			<p>Your OTP for password reset is:</p>
			<div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 16px 0;">
				${otp}
			</div>
			<p>This OTP will expire in 10 minutes.</p>
			<p>If you did not request this, please ignore this email.</p>
		</div>
	`;

	const mailconfigurations = {
		from: process.env.MAIL_USER,
		to: email,
		subject: "Password reset OTP",
		html: htmlToSend,
		text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`
	};

	try {
		const info = await transporter.sendMail(mailconfigurations);
		console.log("OTP email sent successfully", info.messageId);
	} catch (error) {
		console.error("OTP email send failed", error);
		throw error;
	}
};
