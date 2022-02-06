//++++++++++++++++++++++++++++++++++++++++++++++++++ LOGIQUE METIER ++++++++++++++++++++++++++++++++++++++++++++++++++

// IMPORTS
const Sauce = require("../models/Sauce"); // Importation du modéle de données 'Sauce'
const fs = require("fs"); // Importation du package file system 'fs'

// AJOUTER UNE NOUVELLE SAUCE : Middleware pour ajouter une sauce
exports.addSauce = function (request, response, next) {
  // Transforme la chaîne de caractère en objet
  const sauceObject = JSON.parse(request.body.sauce);
  // Affichage du résultat dans la console
  console.log(sauceObject);
  // Création d'un nouvelle sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${request.protocol}://${request.get("host")}/images/${
      request.file.filename
    }`,
  });
  // Affichage du résultat dans la console
  console.log(sauce);
  // Enregistrement de la sauce dans la base de données
  sauce
    .save()
    .then(function () {
      response.status(201).json({ message: "Sauce ajoutée !" });
    })
    .catch(function (error) {
      response.status(400).json({ error: error });
    });
};

// SUPPRIMER UNE SAUCE : Middleware pour supprimer un sauce
exports.deleteSauce = function (request, response, next) {
  Sauce.findOne({ _id: request.params.id })
    .then(function (sauce) {
      // Récupération de la sauce dans la base de données
      if (!sauce) {
        return response.status(404).json({
          error: new Error("Sauce non trouvée !"),
        });
      }
      // Vérification que la sauce appartient à la personne qui effectue la requête
      if (sauce.userId !== request.auth.userId) {
        return response.status(401).json({
          error: new Error("Requête non autorisée !"),
        });
      }
      // Récupération du nom du fichier à supprimer
      const filename = sauce.imageUrl.split("/images")[1];
      // Affichage du résultat dans la console
      console.log(filename);
      // Suppression de ce fichier avec la methode 'unlink' du package 'fs'
      // En argument 1 : chaine de caractères correspondant au chemin du fichier
      // En argument 2 : ce que l'on doit faite après le fichier supprimé
      fs.unlink(`images/${filename}`, function () {
        // Suppression de la sauce dans la base de données
        Sauce.deleteOne({ _id: request.params.id })
          .then(function () {
            response.status(201).json({ message: "Sauce supprimée !" });
          })
          .catch(function (error) {
            response.status(400).json({ error: error });
          });
      });
    })
    .catch(function (error) {
      response.status(400).json({ error: error });
    });
};

// VOIR TOUTE LES SAUCES : Middleware pour voir toute les sauces
exports.seeAllSauce = function (request, response, next) {
  Sauce.find()
    .then(function (sauces) {
      response.status(200).json(sauces);
    })
    .catch(function (error) {
      response.status(400).json({ error: error });
    });
};

// VOIR UNE SAUCE : Middleware pour voir une sauce
exports.seeOneSauce = function (request, response, next) {
  Sauce.findOne({ _id: request.params.id })
    .then(function (sauce) {
      response.status(200).json(sauce);
    })
    .catch(function (error) {
      response.status(400).json({ error: error });
    });
};
