const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categories");
const multer = require("multer");
const { loginCheck } = require("../middleware/auth");

// Paramètre de téléchargement d'image
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Afficher les catégories
router.get("/all-category", categoryController.getAllCategory);

//Créer une catégorie
router.post(
  "/add-category",
  loginCheck,
  upload.single("cImage"),
  categoryController.postAddCategory
);

//Modifier une catégorie
router.put("/edit-category", loginCheck, categoryController.EditCategory);

//Supprimer une catégorie
router.delete(
  "/delete-category",
  loginCheck,
  categoryController.DeleteCategory
);

module.exports = router;
