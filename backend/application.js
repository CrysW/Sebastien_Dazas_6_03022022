// VARIABLE(S) D'ENVIRONNEMENT(S)
require("dotenv").config(); // Importation du package 'dotenv'

// IMPORTS
const express = require("express"); // Importation du package 'express'
const mongoose = require("mongoose"); // Importation du package 'mongoose'
const userRoutes = require("./routes/user"); // Importation du 'router' pour le parcours des utilisateurs

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

// Gestion des requêtes 'POST' : Middleware qui permet d'accédé aux corps de la requête
application.use(express.json()); // Intercepte toutes les requêtes qui ont un content-type json.

// Levée de la sécurité CORS : Middleware général qui sera appliqué à toutes les routes
application.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*"); // Permet d'accéder l'API depuis n'importe quelle origine ('*')
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Permet d'envoyer des requêtes avec les méthodes mentionnées
  next(); // Renvoie au prochain Middleware
});

// Enregistrement du 'router' pour toutes les demandes effectuées
application.use("/api/auth", userRoutes);

// EXPORTS
module.exports = application; // Exportation de l'application 'express'
