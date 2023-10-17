import Entreprise from '../models/entreprise.js';
import Article from '../models/stock/article.js';
import Stocke from '../models/stock/stocke.js';
class StockeController {
    static async create(req, res){
        let reference = 100;
        const {_id} = req.auth
        try {
            Stocke.find({})
            .then(allStocke=>{
                if(allStocke.length > 0){
                    reference = Number(allStocke[allStocke.length-1].reference.split('K')[1])+1;
                }
            })
            Entreprise.findOne({_id})
            .then((data)=>{
                if(!data){
                    res.status(404).json({msg: "Cet compte est introuvable , Veuillez vous connecter à nouveau"})
                    return
                }
                else{
                    let stok = new Stocke ({
                        libelle:req.body.libelle,
                        reference:`STOCK${reference}`,
                        montant: req.body.montant,
                        statut:1,
                        etat: true,
                        admins:data._id
                    })
                    stok.save()
                    .then(()=> res.status(200).json({msg: "Stocke ajouté !!"}))
                    .catch((error)=> res.status(401).json({error: error.message}));
                }
            })
            .catch((error)=> res.status(500).json({error: error.message}));
           
        } catch (error){
            res.status(500).json({message: error.massege});
        }
    }

    static async read(req, res){
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id, statut:1})
            .then(admin=>{
                if(admin){
                    Stocke.find({statut:1})
                    .then(allStocke=> {
                        const msg = `Il y'a ${allStocke.length} élémnents disponible(s).`;
                        res.status(200).json({msg: msg, data: allStocke});
                    })
                    .catch((error)=>{
                        const msg = "Aucun élément trouvé";
                        res.status(400).json({msg: msg, data: error.message});
                    })
                }else{
                    res.status(500).json({msg: "Veuillez d'abord vous authentifier !"});
                    return
                }
            })
            
        }catch(error){
            res.status(500).json({data: error.message});
        }
    }

    static async indexById(req, res){ // On trouve en fonction de la cle primière du stocke
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(admin){
                    Stocke.findById(req.params.id)
                    .then(stock=>{
                        if(stock.length===0 || stock.statut === 0){
                            const msg = `Le stocke dont l'identifiant est ${req.params.id} n'existe pas`;
                            res.status(200).json({msg: msg});
                        }else{
                            const msg = `Un élément est trouvé.`;
                            res.status(200).json({msg: msg,data: stock});
                        }
                    })
                    .catch((error)=>{
                        const msg = `Rien n'est trouvé. Utilisez la bonne référence !`;
                        res.status(200).json({msg: msg, data: error.message});
                    })
                }else{
                    res.status(500).json({msg: "Veuillez d'abord vous authentifier !"});
                    return
                }
            })
            .catch((error)=>{
                res.statut(500);json({error: error.message});
            })
        }catch(error){
            const msg = `URL non valable`;
            res.status(500).json({msg: msg, data: error.message});
        }
    }

    static async indexByRef(req, res){  // On trouve en fonction de la référence du stocke
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(admin){
                    Stocke.find({reference: req.params.reference})
                    .then(stock=>{
                        if(stock.length===0 || stock.statut === 0){
                            const msg = `Le stocke dont l'identifiant est ${req.params.reference} n'existe pas`;
                            res.status(200).json({msg: msg});
                        }else{
                            const msg = `Un élément est trouvé.`;
                            res.status(200).json({msg: msg,data: stock});
                        }
                    })
                    .catch((error)=>{
                        const msg = `Rien n'est trouvé. Utilisez la bonne référence !`;
                        res.status(200).json({msg: msg, data: error.message});
                    })
                }else{
                    res.status(500).json({msg: "Veuillez d'abord vous authentifier !"});
                    return
                }
            })
            .catch((error)=>{
                res.statut(500);json({error: error.message});
            })
        }catch(error){
            const msg = `URL non valable.`;
            res.status(500).json({msg: msg,data: error.message});
        }
    }


    static async update(req,res){
        try {
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(!admin) return res.json({msg: "Veuillez-vous authentifier !"});
                Stocke.findOne({_d:req.body.id, statut:1})
                .then((data)=>{
                    if(data){
                        let updat = {...req.body};
                        Stocke.updateOne({id: req.body.id},{...updat,_id:req.body._id})
                        .then((newData)=>{
                            res.status(201).json({msg: "Modification effectué avec succès", newData: newData});
                        })
                        .catch((error)=> {
                            console.log(error);
                            res.status(404).json({error: error.message});
                        })
                    }
                    else{
                        console.log('Compte introuvable');
                        res.status(401).json({msg: "Compte introuvable !!!"});
                    }
                })
                .catch(error=> {
                    console.log(error)
                    res.status(404).json({error: error.message})
                })
            })
            
            
        } catch (error) {
            console.log(error)
            res.status(400).json({error})
        }
    }


    static async delete(req,res){
        try {
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(!admin) return res.json({msg: "Veuillez-vous authentifier !"});
                Stocke.findOne({_d:req.body.id, statut:1})
                .then((data)=>{
                    if(data){
                        Stocke.updateOne({id: req.body.id},{statut:0})
                        .then((newData)=>{
                            res.status(201).json({msg: "Suppression effectué avec succès !!"})})
                        .catch((error)=> {
                            console.log(error)
                            res.status(404).json({error: error.message})
                        })
                    }
                    else{
                        console.log('Compte introuvable');
                        res.status(401).json({msg: "Compte introuvable !!!"})
                    }
                })
                .catch(error=> {
                    console.log(error)
                    res.status(404).json({error: error.message})
                })
            })
            
            
        } catch (error) {
            console.log(error)
            res.status(400).json({error})
        }
    }
}
export default StockeController;