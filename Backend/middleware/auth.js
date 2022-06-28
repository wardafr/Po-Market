const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  const token = req.cookies.jwt;

  // vérifier que le Token Web json existe et est vérifié
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.send("error");
      } else {
        next();
      }
    });
  } else {
    res.send("pas de token");
  }
};

exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  if (
    !loggedInUserId ||
    !req.userDetails._id ||
    loggedInUserId != req.userDetails._id
  ) {
    res.status(403).json({ error: "Vous n'êtes pas authentifié" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.body.loggedInUserId);
    // Si le rôle d'utilisateur 0 signifie que ce n'est pas un administrateur, c'est un client
    if (reqUser.userRole === 0) {
      res.status(403).json({ error: "Accès refusé" });
    }
    next();
  } catch {
    res.status(404);
  }
};
