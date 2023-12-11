import Entreprise from "../models/entreprise.js";
import User from "../models/user.js";
import ValidateCode from "../models/validateCode.js";


class ValidateCodeController{
    static async getByIdAndCode(req, res){
        const {code, email} = req.params;
        const isValideCode = await ValidateCode.findOne({code, email});
        if(!isValideCode) return res.status(203).json({message: "Email expiré.", status: false});
        res.status(200).json({status: true, data: isValideCode});
    }


    static async deleteIfExpires(req, res){
        try {
            const {email, code} = req.params;
            
            const isValideCode = await ValidateCode.findOne({email, code});
            const isUser = await User.findOne({email});
            let deleted = null;
            let isEntreprise = null;
            if(isValideCode && !isUser && isValideCode.expireIn > Date.now()){
                console.log(1);
                res.status(201).json({message: 'register entreprise', status: true, data: isValideCode});
            }else if(isValideCode && !isUser && isValideCode.expireIn <= Date.now()){
                console.log(2);
                deleted = await ValidateCode.deleteOne({email, code});
                res.status(203).json({message: 'register user', status: false, data: deleted});
            }else if(isValideCode && isUser && isValideCode.expireIn <= Date.now()){
                console.log(3);
                deleted = await ValidateCode.deleteOne({email, code});
                res.status(203).json({message: 'register entreprise', status: false, data: deleted});
            }else if(isValideCode && isUser && isValideCode.expireIn > Date.now()){
                console.log(4);
                isEntreprise = await Entreprise.findOne({user: isUser._id});
                if(isEntreprise){
                    console.log(5);
                    deleted = await ValidateCode.deleteOne({email, code});
                    res.status(201).json({message: 'location dashboard', status: false, data: deleted});
                }else{
                    console.log(6);
                    res.status(203).json({message: 'register entreprise', status: true, data: isValideCode});
                }
            }else if(!isValideCode && isUser){
                console.log(7);
                isEntreprise = await Entreprise.findOne({user: isUser._id});
                if(isEntreprise){
                    console.log(8);
                    delete isEntreprise.user;
                    res.status(203).json({message: 'location dashboard', status: false, data: isEntreprise});
                }else{
                    console.log(9);
                    res.status(203).json({message: 'register entreprise', status: true, data: isValideCode});
                }
            }else if(!isValideCode && !isUser){
                console.log(10);
                res.status(203).json({message: 'location user', status: true, data: [0]});
            }
        } catch (error) {
            console.log(11);
            res.status(501).json({status: false, message: error.message})
        }
    }

    static async deleteExpired(req, res){
        console.log(12);
        const { email } = req.params;
        const fetchAll = await ValidateCode.findOne({email});
        if(!fetchAll) return res.status(203).json({message: "Email expiré.", status: false});
        console.log(13);
        if(fetchAll.expireIn < Date.now()) await ValidateCode.deleteOne({_id: fetchAll._id});
        console.log(14);
        res.status(200).json({status: true, data: [1]});
    }

    static async delete(req, res){
        console.log(15);
        const {_id, code, email} = req.params;
        const isSave = await User.findOne({email});
        if(isSave) await ValidateCode.deleteOne({_id, code});
        console.log(16);
        const isPresente = await ValidateCode.findOne({_id, code, email});
        if(isPresente) await ValidateCode.deleteOne({_id, code, email});
        console.log(17);
        res.status(202).json({message: 'ok', status: true})
    }
}

export default ValidateCodeController;