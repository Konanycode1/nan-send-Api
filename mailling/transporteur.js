
const transporteur = (mode, host, port,secureConnection,tls, auth) =>mode.createTransport({host:host, port:port, secureConnection:secureConnection,tls:tls, auth:auth});
export default transporteur;
