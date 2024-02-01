import User from "../models/user.js";
import { generateToken } from "../util/token.js";
import { crypt, comparer } from "../util/bcrypt.js";
import Agent from "../models/agent.js";
import Administrateur from "../models/administrateur.js";

class UserController {
  // FUNCTION POUR CREER UN UTILISATEUR
  static async create(req, res) {
    try {
      const { email, password, ...body } = req.body;
      const user = await User.findOne({ email, statut: 1 });
      if (user)
        return res
          .status(203)
          .json({ status: false, message: "Utilisateur existe déjà" });
      req.body.password = await crypt(password);
      const newUser = await User.create(req.body);
      if (!newUser)
        return res
          .status(204)
          .json({ status: false, message: "inscription echouée" });
      res.cookie("token", generateToken(newUser.toObject()));
      res.status(201).json({
        status: true,
        token: generateToken(newUser.toObject()),
        message: "Compte crée Merci  !!!!",
        data: newUser,
      });
    } catch (e) {
      res.status(501).json({ message: e.message });
    }
  }

  // OBTENIR TOUT LES UTILISATEUR
  static async getAll(req, res) {
    try {
      const { _id, email, plateforme } = req.auth;
      const admin = await Administrateur.findOne({
        _id,
        email,
        plateforme,
        statut: 1,
      });
      if (!admin)
        return res.status(203).json({
          message: "Mot de passe ou email incorrects !",
          status: false,
        });
      const listUser = await User.find({ statut: 1 }).populate("entreprise");
      if (!listUser.length)
        return res
          .status(203)
          .json({ message: "Aucun utilisateur trouvé !", statut: false });

      res
        .status(202)
        .json({ total: listUser.length, data: listUser, status: true });
    } catch (error) {
      res.status(400).json({ message: error.message, status: false });
    }
  }

  //  OBTENIR UN UTILISATEUR UNIQUE
  static async getById(req, res) {
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const admin = await Administrateur.findOne({
        _id,
        email,
        plateforme,
        statut: 1,
      });
      const isUser = await User.findOne({ _id, email, entreprise, statut: 1 });
      const agent = await Agent.findOne({ email, entreprise, statut: 1 });
      if (!admin && !isUser && !agent)
        return res.status(203).json({
          message: "Mot de passe ou email incorrects !",
          status: false,
        });
      const user = await User.findOne({ _id, email, statut: 1 }).populate(
        "entreprise"
      );
      if (!user)
        return res
          .status(203)
          .json({ message: "Aucun utilisateur trouvé !", status: false });
      res
        .status(200)
        .json({ message: "Un utilisateur trouvé !", status: true, data: user });
    } catch (error) {
      res.status(501).json({ message: error });
    }
  }

  // SUPPRIMER UTILISATEUR AVEC SON ID
  static async delete(req, res) {
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const { id } = req.params;
      const isAdmin = await Administrateur.findOne({
        _id,
        email,
        plateforme,
        statut: 1,
      });
      // const agent = await Agent.findOne({ email, entreprise, statut:1});
      if (!isAdmin)
        return res.status(203).json({
          message: "Mot de passe ou email incorrects !",
          status: false,
        });
      const user = await User.findOne({ _id: id, statut: 1 });
      if (!user)
        return res.status(203).json({
          message: "L'utilisateur à modifier n'existe pas !",
          status: false,
        });
      const updated = await User.updateOne(
        { _id: req.params.id, entreprise, statut: 1 },
        { statut: 0 }
      );
      if (!updated.acknowledged || !updated.modifiedCount)
        return res
          .status(203)
          .json({ statut: false, message: "Suppression non effectué." });
      res.status(201).json({
        message: "Suppression effectué avec succès",
        data: updated,
        status: true,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  // SUPPRIMER UTILISATEUR AVEC SON ID
  static async destroy(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email, statut: 1 });
      if (!user)
        return res.status(203).json({
          message: "L'utilisateur à modifier n'existe pas !",
          status: false,
        });
      if (!user.entreprise)
        await User.deleteOne({ _id: user._id, email, statut: 1 });
      res.status(201).json({ message: "ok", data: [true], status: true });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  // METTRE A JOUR LES INFORMATION DE L'UTILISATEUR
  static async update(req, res) {
    try {
      const { _id, email, entreprise } = req.auth;
      const { id } = req.params;
      const isUser = await User.findOne({ _id, email, entreprise, statut: 1 });
      const agent = await Agent.findOne({ email, entreprise, statut: 1 });
      if (!isUser && !agent)
        return res.status(203).json({
          message: "Mot de passe ou email incorrects !",
          status: false,
        });
      const user = await User.findOne({ _id: id, statut: 1 });
      if (!user)
        return res.status(203).json({
          message: "L'utilisateur à modifier n'existe pas !",
          status: false,
        });
      delete req.body.statut;
      delete req.body.delete_id;
      const updated = await User.updateOne(
        { _id: req.params.id, entreprise, statut: 1 },
        req.body
      );
      if (!updated.acknowledged || !updated.modifiedCount)
        return res
          .status(203)
          .json({ statut: false, message: "Mise à jour non effectué." });
      res.status(201).json({
        message: "Mise à jour effectué avec succès",
        data: true,
        status: true,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}

export default UserController;
