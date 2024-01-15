import nodemailer from "nodemailer";
const transporteur =  auth =>{
    console.table(auth);
    return nodemailer.createTransport({host:"smtp-mail.outlook.com", port:587, secureConnection:false, tls:{ciphers:"SSLv3"}, auth:auth})
};
export default transporteur;
