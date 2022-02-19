//++++++++++++++++++++++++++++++++++++++++++++++++++ LOGIQUE METIER ++++++++++++++++++++++++++++++++++++++++++++++++++

// VARIABLE(S) D'ENVIRONNEMENT(S)
require("dotenv").config(); // Importation du package 'dotenv'

// IMPORTS
const User = require("../models/User"); // Importation du modéle de données 'Utilisateur'
const bcrypt = require("bcrypt"); // Importation du package de cryptage 'bcrypt'
const jwt = require("jsonwebtoken"); // Importation du package 'jsonwebtoken' pour l'encodage des 'Token'

// INSCRIPTION : Middleware pour l'enregistrement de nouveaux utilisateurs
exports.signup = function (request, response, next) {
  // Hashage du mot de passe avant de l'envoyer dans la base de données
  // En argument 1 : passage du mot de passe du corps de la requête envoyé par le front end
  // En argument 2 : nombre de tous de l'algorythme de cryptage => 10 tours
  bcrypt
    .hash(request.body.password, 10)
    .then(function (hash) {
      // Création du nouvel utilisateur
      const user = new User({
        email: request.body.email,
        password: hash,
      });
      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(function () {
          response.status(201).json({ message: "Utilisateur crée !" });
        })
        .catch(function (error) {
          response.status(400).json({ message: "Utilisateur existant !" });
        });
    })
    .catch(function (error) {
      response.status(500).json({ error: error });
    });
};

// CONNEXION : Middleware pour connecter les utilisateurs existants
exports.login = function (request, response, next) {
  // Chercher l'utilisateur dans la base de données
  User.findOne({ email: request.body.email })
    .then(function (user) {
      // Utilisateur non trouvé
      if (!user) {
        return response
          .status(401)
          .json({ message: "Utilisateur non trouvé !" });
      }
      // Utilisateur trouvé
      // Comparaison du mot de passe envoyé par l'utilisateur qui essai de se connecter avec le hash qui est enregistré dans la base de données
      // bcrypt.compare(mot de passe envoyé dans la requête, hash enregistré dans le document user)
      bcrypt
        .compare(request.body.password, user.password)
        .then(function (valid) {
          // Le mot de passe ne correspond pas
          if (!valid) {
            return response
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          // Le mot de passe correspond
          response.status(200).json({
            userId: user._id, // Identifiant de l'utilisateur dans la base
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
              expiresIn: "48h",
            }),
          });
        })
        .catch(function (error) {
          response.status(500).json({ error: error });
        });
    })
    .catch(function (error) {
      response.status(500).json({ error: error });
    });
};
