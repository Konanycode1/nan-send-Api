import ValidateCode from "../models/validateCode.js";
const DeleteExpired = async ()=>{
    let allValide = await ValidateCode.find();
    const now = Date.now();
    allValide = allValide.filter(element => element.expireIn < now);
    if(allValide.length){
        allValide.forEach(async element =>{
            const {_id,code, email} = element;
            await ValidateCode.deleteOne({_id, code, email})
        })
    }
}

export default DeleteExpired;