import { verifyToken } from "../util/token.js";

const verify_token = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    const tokenStatut = verifyToken(token);
    console.log(tokenStatut);
    if (!tokenStatut) { res.status(404).json({ status: false, message: "Token inspiré !!!", }) }
    req.auth = tokenStatut;
    next();
  } catch (error) {
    console.log("Erreur produite au niveau du token", error.message);
    res.status(404).json({ error });
  }
};
export default verify_token;
