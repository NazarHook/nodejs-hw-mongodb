import nodemailer from 'nodemailer';
import 'dotenv/config.js'
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
const sendEmail = async (options) => {
    return await transporter.sendMail(options);
  };

export default sendEmail;
