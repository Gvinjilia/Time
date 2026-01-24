const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const transport = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_PASS
    }
});

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
        await transport.sendMail({
            from: `"TIME" <gvinjilian2@gmail.com>`,
            to: to,
            subject,
            html
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