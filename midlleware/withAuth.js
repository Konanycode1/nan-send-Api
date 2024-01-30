import { verifyToken } from "../util/token.js";

const verify_token = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const tokenStatut = verifyToken(token);
    if (!tokenStatut) { res.status(404).json({ status: false, message: "Token inspiré !!!", }) }
    req.auth = tokenStatut;
    next();
  } catch (error) {
    res.status(501).json({ message: 'Expired token', status: false, errorMessage: error.message });
  }
};
export default verify_token;
