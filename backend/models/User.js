// IMPORTS
const mongoose = require("mongoose"); // Importation du package 'mongoose'
const uniqueValidator = require("mongoose-unique-validator"); // Importation du package 'unique-validator'

// SCHEMA DE DONNEES
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // 'unique: true' signifie que deux utilisateurs ne pourront pas partager la même adresse mail
  password: { type: String, required: true },
});

// APPLICATION DE 'unique-validator' AU SCHEMA DE DONNEES
userSchema.plugin(uniqueValidator); // 'mongoose-unique-validator' s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.

// EXPORTS
module.exports = mongoose.model("User", userSchema); // Exportation du modéle de données avec en arguments ("nom du modéle", "nom du schéma")
