import nodemailer from "nodemailer";
import config from "../app/config";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.node_mailer_sender_address, // Email service account
        pass: config.node_mailer_sender_app_password // Email service password
    }
});

export default transporter