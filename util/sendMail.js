import {createTransport} from 'nodemailer'
const apiKey = "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"

const transporter = createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: true,
    auth: {
        user: "nanSend",
        pass: process.env.SENDGRID_API_KEY
    }
})

export  const sendEmail =(from, to)=>{
    transporter.sendMail({
        from: from, // verified sender email
        to: to, // recipient email
        subject: "Test message subject", // Subject line
        text: "Hello world!", // plain text body
        html: "<b>Hello world!</b>", // html body
      }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}