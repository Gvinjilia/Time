const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.EMAIL_PASSWORD);

const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const gmailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        await transport.sendMail({
            from: '"TIME" <TIME@gmail.com>',
            to: to,
            subject,
            html
        });
    } catch(err){
        console.log('Error', err);
    }
};

const sendRealGmail = async (to, subject, html) => {
    try {
        await gmailTransport.sendMail({
            from: '"TIME" <gvinjilian2@gmail.com>',
            to,
            subject,
            html
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = { sendEmail, sendRealGmail };