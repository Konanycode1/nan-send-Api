import ValidateCode from "../models/validateCode.js";

class ValidateCodeController{
    static async getByIdAndCode(req, res){
        const {code, id} = req.params;
        const isValideCode = await ValidateCode.findOne({_id, code});
        if(!isValideCode) return res.status(203).json({message: "Code de valittion expiré.", status: false});
        res.status(201).json({status: true, isValideCode});
    }
}

export default ValidateCodeController;