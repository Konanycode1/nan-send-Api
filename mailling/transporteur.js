import nodemailer from "nodemailer";
const transporteur =  auth =>{
    const connectivite = !auth.user.includes('@outlook') ?
    {
        service: 'gmail'
    } : 
    {
        host: 'smtp.office365.com',
        port: 587,
        secureConnection:false,
        tls:{ciphers: "SSLv3"},
    };
    connectivite.debug = true;
    connectivite.auth = auth;
    return nodemailer.createTransport(connectivite);
    // return nodemailer.createTransport({host:"smtp-mail.outlook.com", port:587, secureConnection:false, tls:{ciphers:"SSLv3"}, auth:auth})
};
export default transporteur;
