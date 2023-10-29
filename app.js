import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/api/contactsRouter.js';
import authRouter from "./routes/api/auth.js";
// import nodemailer from 'nodemailer';
// import dotenv from "dotenv";
// dotenv.config();

// const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;


// const nodemailerConfig = {
//   host: "smtp.ukr.net",
//   port: 465, // 25, 465, 2525
//   secure: true,
//   auth:{
//     user: UKR_NET_EMAIL,
//     pass: UKR_NET_PASSWORD,
//   }
// };
// const transport  = nodemailer.createTransport(nodemailerConfig);
// const emailOptions = {
//   from: UKR_NET_EMAIL,
//   to: 'yehohad414@qianhost.com',
//   subject: 'Nodemailer test email!!!',
//   text: "Hello, I`m tested email"
// };
// transport .sendMail(emailOptions).then(info => console.log(info)).catch((err => console.log(err)));

export const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use("/api/users", authRouter)
app.use('/api/contacts', contactsRouter)

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message })
})


