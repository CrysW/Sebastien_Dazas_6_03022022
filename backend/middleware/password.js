// IMPORTS
const passwordValidator = require("password-validator"); // Importation du package 'password-validator'

// Création du schéma
const passwordSchema = new passwordValidator();

// Le schéma que doit respecter le mot de passe
passwordSchema
  .is()
  .min(8) // Longueur minimal 8
  .is()
  .max(15) // Longueur maximal 15
  .has()
  .uppercase(1) // Doit avoir des lettres majuscules
  .has()
  .lowercase() // Doit avoir des lettres minuscules
  .has()
  .digits(1) // Doit avoir au moins 1 chiffres
  .has()
  .not()
  .spaces() // Ne doit pas avoir d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist des mots de passe

// EXPORTS
// VERIFICATION DU MOT DE PASSE : Middleware de vérification de la qualité du mot de passe par rapport au schéma
module.exports = function (request, response, next) {
  // Si le mot de passe n'est pas validé
  if (!passwordSchema.validate(request.body.password)) {
    return response.status(400).json({
      message:
        "Le mot de passe doit contenir entre 8 et 15 caractères, avec au moins une majuscule et un chiffre !",
    });
  } else {
    next();
  }
};
