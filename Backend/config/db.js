const mongoose = require("mongoose");

//Connexion à la DB

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "Lien de la DB";
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;
