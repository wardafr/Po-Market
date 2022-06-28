const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }
  //Tous les utilisateurs
  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  // Inscription
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Le champ ne doit pas être vide",
        email: "Le champ ne doit pas être vide",
        password: "Le champ ne doit pas être vide",
        cPassword: "Le champ ne doit pas être vide",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = {
        ...error,
        name: "Le nom doit être composé de 3 à 25 caractères",
      };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Le mot de passe doit comporter 8 caractères",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // Si l'email et numéro exitent dans la base de données donc :
          try {
            password = bcrypt.hashSync(password, 10);
            const data = await userModel.findOne({ email: email });
            if (data) {
              error = {
                ...error,
                password: "",
                name: "",
                email: "L'email existe deja",
              };
              return res.json({ error });
            } else {
              let newUser = new userModel({
                name,
                email,
                password,
                // ========= Ici le rôle 1 pour l'inscription de l'administrateur le rôle 0 pour l'inscription du client =========
                userRole: 1, // Modification du nom du champ en userRole à partir du rôle
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success:
                      "Le compte a été créé avec succès. Veuillez vous connecter",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        error = {
          ...error,
          password: "",
          name: "",
          email: "Email non valide",
        };
        return res.json({ error });
      }
    }
  }

  // Connexion
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Les champs ne doivent pas être vides",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "email ou mot de passe invalide",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole },
            JWT_SECRET
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
          });
          const encode = jwt.verify(token, JWT_SECRET);
          return res.json({
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "email ou mot de passe invalide",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const authController = new Auth();
module.exports = authController;
