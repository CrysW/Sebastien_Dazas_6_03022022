//++++++++++++++++++++++++++++++++++++++++++++++++++ LOGIQUE DE ROUTING ++++++++++++++++++++++++++++++++++++++++++++++++++

// IMPORTS
const express = require("express"); // Importation du package 'express'
const sauceCtrl = require("../controllers/sauce"); // Importation du controller
const auth = require("../middleware/auth"); // Importation du middleware d'authentification
const multer = require("../middleware/multer-config"); // Importation du middleware multer

// CREATION DU ROUTER
const router = express.Router();

// CREATION DES 3 ROUTES (CREATE, READ ET DELETE)
// C => CREATE (Créer) -> Ajout d'une sauce
// R => READ (Lire) -> Lecture d'une ou des sauces
// U => UPDATE (Mettre à jour) ->
// D => DELETE (Supprimer) -> Suppression d'une sauce
router.post("/", auth, multer, sauceCtrl.addSauce); // Route pour l'ajout d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce); // Route pour supprimer une sauce
router.get("/", auth, sauceCtrl.seeAllSauce); // Route pour voir toutes les sauces
router.get("/:id", auth, sauceCtrl.seeOneSauce); // Route pour voir une sauce

// EXPORTS
module.exports = router; // Exportation du router
