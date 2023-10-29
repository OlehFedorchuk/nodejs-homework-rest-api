import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;


const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  secure: true,
  auth:{
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  }
};
const transport  = nodemailer.createTransport(nodemailerConfig);
// const data = {
// //from: UKR_NET_EMAIL,
//   to: 'yehohad414@qianhost.com',
//   subject: 'Nodemailer test email!!!',
//   html: "<strong>Test email</strong>"
// };
// transport .sendMail(emailOptions).then(info => console.log(info)).catch((err => console.log(err)));
const sendEmail = (data) => {
    const email = {...data, from: UKR_NET_EMAIL}
    return transport.sendMail(email);
}
export default sendEmail;