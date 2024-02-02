// import nodemailer from "nodemailer";
// const transporteur =  auth =>{
//     const connectivite = !auth.user.includes('@outlook') ?
//     {
//         service: 'gmail',
//         auth:auth,
//         debug:true,
//     } : 
//     {
//         host: 'smtp.office365.com',
//         port: 587,
//         secureConnection:false,
//         tls:{ciphers: "SSLv3"},
//         auth:auth,
//         debug:true,
//     };
//     return nodemailer.createTransport(connectivite);
// };
// export default transporteur;

import nodemailer from "nodemailer";

const transporteur = (auth) => {
    const connectivite = {
        auth,
        debug: true,
    };

    if(!auth.user.includes('@outlook')) {
        connectivite.service = 'gmail';
    }else{
        connectivite.host = 'smtp.office365.com';
        connectivite.port = 587;
        connectivite.secureConnection = false;
        connectivite.tls = { ciphers: "SSLv3" };
    }

    return nodemailer.createTransport(connectivite);
};

export default transporteur;
