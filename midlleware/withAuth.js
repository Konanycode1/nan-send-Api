import { verifyToken } from "../util/token.js";

const verify_token = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.cookies.token
    const tokenStatut = verifyToken(token);
    if (!tokenStatut) { res.status(404).json({ status: false, message: "Token inspiré !!!", }) }
    req.auth = tokenStatut;
    next();
  } catch (error) {
    console.log("Erreur produite au niveau du token", error.message);
    res.status(404).json({ error });
  }
};
export default verify_token;
