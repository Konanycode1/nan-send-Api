import bcrypt, {hash, compare} from 'bcrypt'

/**
 * 
 * @param {string} pass 
 */
export const crypt = async (pass)=>{
    return await hash(pass,await bcrypt.genSalt())
}

/**
 * 
 * @param {String} to 
 * @param {String} from 
 */
export const comparer = (to, from)=>{
    try {
        return compare(to, from)
    } catch (e) {
        console.log(e.message)
    }
    
}