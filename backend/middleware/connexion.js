// IMPORTS
const expressRateLimit = require("express-rate-limit"); // Importation du package 'express-rate-limit'

// CONFIGURATION
// LIMITATION DE CONNEXIONS : Middleware pour limiter les tentatives de connexion infructueuses répétées
const maximumAttempts = expressRateLimit({
  windowMs: 5 * 60 * 1000, // délai en ms
  max: 3, // nombre de tentatives authorisées
  message:
    "Votre compte est bloqué pendant 5 minutes suite à 3 tentatives infructueuses !",
});

// EXPORTS
module.exports = maximumAttempts;
