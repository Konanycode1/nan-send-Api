import Jwt from "jsonwebtoken";
/**
 * 
 * @param {String} user 
 * @returns 
 */
export const generateToken = (user)=>{
    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret) throw new Error('Code introuvable !!!')
    return  Jwt.sign(id, jwtSecret, {expiresIn: 24*3600})
}

/**
 * 
 * @param {String} token 
 */
export const verifyToken = (token)=>{
    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret) throw new Error('Code introuvable !!!')
    return Jwt.verify(token, jwtSecret)
}