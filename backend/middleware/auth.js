// VARIABLE(S) D'ENVIRONNEMENT(S)
require("dotenv").config(); // Importation du package 'dotenv'

// IMPORTS
const jwt = require("jsonwebtoken"); // Importation du package 'jsonwebtoken' pour l'encodage des 'token'

// EXPORTS
// AUTHENTIFICATION : Middleware d'authentification de requête
module.exports = function (request, response, next) {
  try {
    // Récupération du token dans le header authorization de 'En-tête de requête'
    const token = request.headers.authorization.split(" ")[1];
    // Décoder le token
    // En argument 1 : token à vérifier
    // En argument 2 : clé d'encodage
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    // Extraire le 'userId' qui est à l'intérieur
    const userId = decodedToken.userId;
    // Vérifier si 'userId' de la requête correspond à celui du token
    if (request.body.userId && request.body.userId !== userId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    response.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
