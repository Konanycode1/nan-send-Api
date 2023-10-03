import express from "express";
import Teams from "../models/teams.js";
class teamController {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  static async createTeam(req, res) {
    try {
      const { name, ...body } = req.body;
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
      const { name, ...body } = req.body;
      const existTeam = await Teams.findById(id);
      if (!existTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Cette Team n'existe pas" });
      }
      const updateTeam = await Teams.updateOne({ _id: id }, { name, ...body });

      if (!updateTeam) {
        return res.status(400).json({
          statut: false,
          message: "Erreur lors de la modification de la Team",
        });
      }
      res
        .status(200)
        .json({ statut: true, message: { ...updateTeam.toObject() } });
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
      res.status(200).json({ statut: true, message: "Team supprimée" });
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
      const allTeam = await Teams.find();

      if (!allTeam) {
        return res
          .status(400)
          .json({ statut: false, message: "Aucune Team n'existe" });
      }
      res
        .status(200)
        .json({ statut: true, message: { ...allTeam.toObject() } });
    } catch (e) {
      res.status(500).json({ statut: false, message: e.message });
    }
  }
}

export default teamController;
