import Entreprise from "../models/entreprise.js";
import Article from "../models/stock/article.js";
import Categorie from "../models/stock/categorie.js";
import Stocke from "../models/stock/stocke.js";
class CategorieController {
    static async create(req, res){
        let reference = 100;
        try {
            const {_id} = req.auth
            Categorie.find({})
            .then(allCategorie=>{
                if(allCategorie.length > 0){
                    reference = Number(allCategorie[allCategorie.length-1].reference.split('EG')[1])+1;
                }
            })
            Entreprise.findOne({_id, statut:1})
            .then((data)=>{
                if(!data){
                    res.status(404).json({msg: "Cet compte est introuvable , Veuillez vous connecter à nouveau"})
                    return
                }else{
                    let categorie = new Categorie({
                        libelle:req.body.libelle,
                        reference:`CATEG${reference}`,
                        satut:1,
                        etat: true,
                        admins:data._id
                    })
                    categorie.save()
                    .then(()=> res.status(200).json({msg: "Catégorie ajouté !!"}))
                    .catch((error)=> res.status(401).json({error: error.message}))
                }
            })
            .catch((error)=> res.status(500).json({error: error.message}));
        }catch (error) {
            console.log(error.massege, 'erer');
            res.status(500).json({message: error.massege})
        }
    }

    static async read(req, res){
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id, statut:1})
            .then(admin=>{
                if(admin){
                    Categorie.find({statut:1})
                    .then(allCategorie=> {
                        const msg = `Il y'a ${allCategorie.length} élémnents disponible(s).`;
                        res.status(200).json({msg: msg, data: allCategorie});
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

    static async indexById(req, res){ // On trouve en fonction de la cle primière du catégorie
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(admin){
                    Categorie.findById(req.params.id)
                    .then(categorie=>{
                        if(categorie.length===0 || categorie.statut === 0){
                            const msg = `Le categorie dont l'identifiant est ${req.params.id} n'existe pas`;
                            res.status(200).json({msg: msg});
                        }else{
                            const msg = `Un élément est trouvé.`;
                            res.status(200).json({msg: msg,data: categorie});
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

    static async indexByRef(req, res){  // On trouve en fonction de la référence du catégorie
        try{
            const {_id} = req.auth
            Entreprise.findOne({_id})
            .then(admin=>{
                if(admin){
                    Categorie.find({reference: req.params.reference})
                    .then(categorie=>{
                        if(categorie.length===0 || categorie.statut === 0){
                            const msg = `Le categorie dont l'identifiant est ${req.params.reference} n'existe pas`;
                            res.status(200).json({msg: msg});
                        }else{
                            const msg = `Un élément est trouvé.`;
                            res.status(200).json({msg: msg,data: categorie});
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
                Categorie.findOne({_d:req.body.id, statut:1})
                .then((data)=>{
                    if(data){
                        let updat = {...req.body};
                        Categorie.updateOne({id: req.body.id},{...updat,_id:req.body._id})
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
                    console.log(error);
                    res.status(404).json({error: error.message});
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
                Categorie.findOne({_d:req.body.id, statut:1})
                .then((data)=>{
                    if(data){
                        Categorie.updateOne({id: req.body.id},{statut:0})
                        .then(()=>{
                            res.status(201).json({msg: "Suppression effectué avec succès !!"});
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
                    console.log(error);
                    res.status(404).json({error: error.message});
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({error});
        }
    }
}
export default CategorieController;