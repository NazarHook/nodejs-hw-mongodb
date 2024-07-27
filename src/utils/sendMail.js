import nodemailer from "nodemailer";
import "dotenv/config";

const {SMTP_USER, SMTP_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp-relay.brevo.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
    logger: true
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    try {
        const email = {...data, from: SMTP_USER};
    return transport.sendMail(email);
    console.log('email sent succesfully');
    } catch (error) {
        console.log(error.message);
    }
    
}

export default sendEmail;
