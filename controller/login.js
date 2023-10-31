import User from '../models/user.js';
import { generateToken } from '../util/token.js';
import { crypt, comparer } from '../util/bcrypt.js';
import Agent from '../models/agent.js';
import Administrateur from '../models/administrateur.js';

class LoginController{
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const admin = await Administrateur.findOne({ email, statut: 1 });
            const user = await User.findOne({ email, statut: 1 });
            const agent = await Agent.findOne({ email, statut: 1 });
            if(!user && !agent && !admin) return res.status(203).json({ message: 'Compte introuvable', status: false});
            const resultat = user ? user : (agent ? agent : admin);
            console.log(resultat)
            const data = {
                _id:resultat._id,
                email: resultat.email,
                password: resultat.password,
                entreprise: resultat.entreprise ? resultat.entreprise._id : undefined,
                plateforme: resultat.plateforme ? resultat.plateforme._id : undefined
            };
            // console.log(data)
            const isConforme = await comparer(password, user ? user.password : (agent ? agent.password : admin.password));
            if(!isConforme) return res.status(203).json({ message: 'Adresse mail / mot de passe incorrect' });
            res.cookie("token", generateToken(data))
            res.status(200).json({ message: "Connexion effectuée avec succès !", _id: data._id, token: generateToken(data), status: true })
        } catch (error) {
            console.log(error)
            res.status(501).json({ message: error.message })
        }
    }
}

export default LoginController