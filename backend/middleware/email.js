// IMPORTS
const validator = require("validator"); // Importation du package 'validator'

// EXPORTS
// VERIFICATION DE L'ADRESSE MAIL : Middleware de vérification de l'adresse mail
module.exports = function (request, response, next) {
  // Si l'adresse mail n'est pas valide
  if (!validator.isEmail(request.body.email)) {
    return response
      .status(400)
      .json({ message: "Veuillez saisir une adresse mail valide !" });
  } else {
    next();
  }
};
