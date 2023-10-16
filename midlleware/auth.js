
// import { verify, sign } from "jsonwebtoken";
import Jwt from 'jsonwebtoken';

import private_key from "../laboratoire/private_key.js";

const verify_token = (req, res, next) => {
    try {
        const token_decoded = Jwt.verify(req.headers.authorization.split(" ")[1], private_key);
        req.auth = {id: token_decoded.id, email: token_decoded.email, entreprise: token_decoded.entreprise};
        next();
    }catch (error) {
        console.log("Erreur produite au niveau du token", error.message);
        res.status(404).json({error});
    }
};
const sign_token = data => Jwt.sign(data, private_key, {expiresIn: 24*60*60}, process.env.JWT_TOKEN_SECRET);
export default  { sign_token, verify_token };