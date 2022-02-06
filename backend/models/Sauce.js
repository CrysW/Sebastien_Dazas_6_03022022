// IMPORTS
const mongoose = require("mongoose"); // Importation du package 'mongoose'

// SCHEMA DE DONNEES
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0, required: true },
  dislikes: { type: Number, default: 0, required: true },
  usersLiked: { type: Array, default: [], required: true },
  usersDisliked: { type: Array, default: [], required: true },
});

// EXPORTS
module.exports = mongoose.model("Sauce", sauceSchema); // Exportation du modéle de données avec en arguments ("nom du modéle", "nom du schéma")
