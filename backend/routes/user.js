//++++++++++++++++++++++++++++++++++++++++++++++++++ LOGIQUE DE ROUTING ++++++++++++++++++++++++++++++++++++++++++++++++++

// IMPORTS
const express = require("express"); // Importation du package 'express'
const userCtrl = require("../controllers/user"); // Importation du controller
const password = require("../middleware/password"); // Importation du middleware de contrôle du password
const email = require("../middleware/email"); // Importation du middleware de contrôle de l'adresse mail

// CREATION DU ROUTER
const router = express.Router();

// CREATION DES 2 ROUTES (INSCRIPTION ET CONNEXION)
router.post("/signup", email, password, userCtrl.signup); // Route pour l'inscription de nouveaux utilisateurs
router.post("/login", userCtrl.login); // Route pour la connexion de nouveaux utilisateurs

// EXPORTS
module.exports = router; // Exportation du router
