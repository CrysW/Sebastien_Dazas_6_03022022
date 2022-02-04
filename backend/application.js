// VARIABLE(S) D'ENVIRONNEMENT(S)
require("dotenv").config(); // Importation du package 'dotenv'

// IMPORTS
const express = require("express"); // Importation du package 'express'
const mongoose = require("mongoose"); // Importation du package 'mongoose'

// CONNEXION A LA BASE DE DONNEES
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGODB_ACCESS +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(function () {
    console.log("Connexion à MongoDB réussie !");
  })
  .catch(function () {
    console.log("Connexion à MongoDB échouée !");
  });

// Création de l'application 'express'
const application = express();

// EXPORTS
module.exports = application; // Exportation de l'application 'express'
