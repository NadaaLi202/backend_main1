import nodemailer from 'nodemailer';//  mailtrap  
import jwt from 'jsonwebtoken'
import { templeteEmail } from './emailTemplete.js';

  async function sendEmail(email){//email
const transporter = nodemailer.createTransport({
   service:'gmail',
 
  auth: {
    user: "s4alpy@gmail.com",
    pass: "ejsh gyoe lnuj zrqf",
  },
});

// async..await is not allowed in global scope, must use a wrapper
   let token=jwt.sign(email,"school")
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"E-Learning  App👻" <s4alpy@gmail.com>', 
    to: email, 
    subject: "Hello ✔", 
    text: "Verify Your Email?", 
    html: templeteEmail(token), 
  });

  console.log("Message sent: %s", info.messageId);
  
}
export default sendEmail;
