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
      // Sauce.deleteOne() permet de supprimer un objet
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

// MODIFIER UNE SAUCE : Middleware pour modifier une sauce
exports.modifyASauce = function (request, response, next) {
  // Vérification de la présence ou non de 'request.file'
  if (request.file) {
    // Récupération de la sauce dans la base de données
    Sauce.findOne({ _id: request.params.id })
      .then(function (sauce) {
        // Récupération du nom de la photo à supprimer dans la base de données
        const filename = sauce.imageUrl.split("/images")[1];
        // Suppression de l'image dans le dossier 'images' du serveur
        fs.unlink(`images/${filename}`, function (error) {
          if (error) {
            throw error;
          }
        });
      })
      .catch(function (error) {
        response.status(400).json({ error: error });
      });
  }
  // 2 cas possibles : si il y a un nouveau fichier pour la photo ou si la photo n'est pas modifiée
  const sauceObject = request.file
    ? {
        ...JSON.parse(request.body.sauce),
        imageUrl: `${request.protocol}://${request.get("host")}/images/${
          request.file.filename
        }`,
      }
    : { ...request.body };
  // Mise à jour de la base de données
  // Sauce.updateOne() permet de modifier un objet
  // Argument 1 : Objet de comparaison '_id' doit être le même que le paramètre de requête
  // Argument 2 : nouvel objet
  Sauce.updateOne(
    { _id: request.params.id },
    { ...sauceObject, _id: request.params.id }
  )
    .then(function () {
      response
        .status(201)
        .json({ message: "Sauce modifiée !", contenu: sauceObject });
    })
    .catch(function (error) {
      response.status(400).json({ error: error });
    });
};

// LIKER UNE SAUCE : Middleware pour liker une sauce
exports.likeASauce = function (request, response, next) {
  Sauce.findOne({ _id: request.params.id })
    .then(function (sauce) {
      switch (request.body.like) {
        // Like = 1 => L'utilisateur aime la sauce (like = +1)
        case 1:
          if (
            !sauce.usersLiked.includes(request.body.userId) &&
            request.body.like === 1
          ) {
            // console.log(
            //   "Le 'userId' n'est pas contenu dans 'usersLiked' et le 'userId aime la sauce"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: request.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour l'incrémentation du champ 'like' à '1' dans la base de données
              // Utilisation de l'opérateur '$push' de mongoDB pour l'ajout du 'userId' dans le champ 'usersLiked' dans la base de données
              { $inc: { likes: 1 }, $push: { usersLiked: request.body.userId } }
            )
              .then(function () {
                response
                  .status(201)
                  .json({ message: "La sauce a été likée !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;

        // Like = -1 => L'utilisateur n'aime pas la sauce (dislike = +1)
        case -1:
          if (
            !sauce.usersDisliked.includes(request.body.userId) &&
            request.body.like === -1
          ) {
            // console.log(
            //   "Le 'userId' n'est pas contenu dans 'usersDisliked' et le 'userId' n'aime pas la sauce"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: request.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour l'incrémentation du champ 'dislike' à '1' dans la base de données
              // Utilisation de l'opérateur '$push' de mongoDB pour l'ajout du 'userId' dans le champ 'usersDisliked' dans la base de données
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: request.body.userId },
              }
            )
              .then(function () {
                response
                  .status(201)
                  .json({ message: "La sauce a été dislikée !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;

        case 0:
          // Like = 0  => L'utilisateur annule son like (like = 0)
          // Si le 'userId' est contenu dans 'usersLiked' et que le 'userId' annule son vote
          if (sauce.usersLiked.includes(request.body.userId)) {
            // console.log(
            //   "Le 'userId' est contenu dans la 'userLiked' et le 'userId' annule son vote"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: request.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour la décrémentation du champ 'likes' de '-1' dans la base de données
              // Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: request.body.userId },
              }
            )
              .then(function () {
                response
                  .status(201)
                  .json({ message: "Le like de la sauce a été annulé !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          if (sauce.usersDisliked.includes(request.body.userId)) {
            // Like = 0  => L'utilisateur annule son dislike (dislike = 0)
            // Si le 'userId' est contenu dans 'usersDisliked' et que le 'userId' annule son vote
            // console.log(
            //   "Le 'userId' est contenu dans la 'userDisliked' et le 'userId' annule son vote"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: request.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour la décrémentation du champ 'dislike' à '-1' dans la base de données
              // Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: request.body.userId },
              }
            )
              .then(function () {
                response
                  .status(201)
                  .json({ message: "Le dislike de la sauce a été annulé !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch(function (error) {
      response.status(404).json({ error: error });
    });
};
