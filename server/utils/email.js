const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const brevo = require('@getbrevo/brevo');

dotenv.config();

const instance = new brevo.TransactionalEmailsApi();
instance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// const transport = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.BREVO_LOGIN,
//         pass: process.env.BREVO_PASS
//     }
// });

// const gmailTransport = nodemailer.createTransport({
//     host: process.env.EMAIL_API,
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_APP_PASSWORD
//     }
// });

const sendEmail = async (to, subject, html) => {
    try {
        await instance.sendTransacEmail({
            sender: {
                name: "TIME Watches",
                email: "gvinjilian2@gmail.com" 
            },
            to: [{ email: to }],
            subject,
            htmlContent: html
        });
    } catch(err){
        console.log('Error', err);
    }
};

// const sendRealGmail = async (to, subject, html) => {
//     try {
//         await gmailTransport.sendMail({
//             from: '"TIME" <gvinjilian2@gmail.com>',
//             to,
//             subject,
//             html
//         });
//     } catch(err){
//         console.log(err);
//     }
// };

module.exports = sendEmail;