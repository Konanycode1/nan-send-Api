import express from "express";
import Teams from "../models/teams.js";
import User from "../models/user.js";
class teamController {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async createTeam(req, res) {
    try {
      const { name, ...body } = req.body;
      const {_id, email} = req.auth
      const user = await User.findById(_id)
      if(!user) return res.status(400).json({ statut: false, message: "Utilisateur introuvable !!!" })
      const existTeam = await Teams.findOne({ name });
      if (existTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Cette Team existe déjà" });
      }
      const newTeam = await Teams.create({ name, ...body });

      if (!newTeam) {
        return res.status(400).json({
          statut: false,
          message: "Erreur lors de la création de la Team",
        });
      }
      res
        .status(200)
        .json({ statut: true, message: { ...newTeam.toObject() } });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async editTeam(req, res) {
    try {
      const { id } = req.params;
      const { newContact, contactUpdate, contactsToDelete, ...body } = req.body;
      const {_id, email} = req.auth
      const user = await User.findById(_id)
      if(!user) return res.status(400).json({ statut: false, message: "Utilisateur introuvable !!!" })
      const existTeam = await Teams.findById(id);

      if (!existTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Cette Team n'existe pas" });
      }

      if (Array.isArray(newContact)) {
        // Ajouter les nouveaux contacts au tableau existant
        existTeam.contact = [...existTeam.contact, ...newContact];
      }

      if (Array.isArray(contactUpdate)) {
        // Parcourir les contacts à mettre à jour
        for (const updateInfo of contactUpdate) {
          const { index, newEmail } = updateInfo;

          // Vérifier si l'index est valide
          if (index >= 0 && index < existTeam.contact.length) {
            // Mettre à jour l'email du contact à l'index spécifié
            existTeam.contact[index] = newEmail;
          }
        }
      }

      if (Array.isArray(contactsToDelete)) {
        // Parcourir les contacts à supprimer
        for (const contactIndex of contactsToDelete) {
          // Vérifier si l'index est valide
          if (contactIndex >= 0 && contactIndex < existTeam.contact.length) {
            // Supprimer le contact à l'index spécifié
            existTeam.contact.splice(contactIndex, 1);
          }
        }
      }

      // Mettre à jour les autres données de l'équipe
      const updateTeam = await Teams.updateOne(
        { _id: id },
        { contact: existTeam.contact, ...body }
      );

      if (!updateTeam) {
        return res.status(400).json({
          statut: false,
          message: "Erreur lors de la modification de la Team",
        });
      }

      return res
        .status(200)
        .json({ statut: true, message: "bien modifié !!!" });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async deleteTeam(req, res) {
    try {
      const { id } = req.params;
      const {_id, email} = req.auth
      const user = await User.findById(_id)
      if(!user) return res.status(400).json({ statut: false, message: "Utilisateur introuvable !!!" })
      const existTeam = await Teams.findById(id);
      if (!existTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Cette Team n'existe pas" });
      }

      const deleteTeam = await Teams.deleteOne({ _id: id });

      if (!deleteTeam) {
        return res.status(400).json({
          statut: false,
          message: "Erreur lors de la suppression de la Team",
        });
      }
      res.status(200).json({ statut: true, message: "Team supprimée !!!" });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async getTeam(req, res) {
    try {
      const { id } = req.params;
      const {_id, email} = req.auth
      const user = await User.findById(_id)
      if(!user) return res.status(400).json({ statut: false, message: "Utilisateur introuvable !!!" })
      const existTeam = await Teams.findById(id);

      if (!existTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Cette Team n'existe pas" });
      }
      res
        .status(200)
        .json({ statut: true, message: { ...existTeam.toObject() } });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async getAllTeam(req, res) {
    try {
     
      const {_id, email} = req.auth
      const user = await User.findById(_id)
      if(!user) return res.status(400).json({ statut: false, message: "Utilisateur introuvable !!!" })
      const allTeam = await Teams.find({});
      if (!allTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Aucune Team n'existe" });
      }
      res.status(200).json({ statut: true, message: allTeam });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
}

export default teamController;
