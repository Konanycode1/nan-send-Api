

import nodemailer from "nodemailer";

const transporteur = (auth) => {
    
    const connectivite = {
        auth,
        debug: true,
        timeout: 60000
    };

    if(!auth.user.includes('@outlook')){
        connectivite.service = 'gmail';
    }else{
        connectivite.host = 'smtp-mail.outlook.com';
        connectivite.port = 587;
        connectivite.secureConnection = false;
        connectivite.tls = { ciphers: "SSLv3" };
    }

    return nodemailer.createTransport(connectivite);
};

export default transporteur;
