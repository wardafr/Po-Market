const mongoose = require("mongoose");

//Connexion à la DB

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb+srv://vibess:FpqobGBgE7Dn7Gkb@cluster0.iuvoi.mongodb.net/Po-Market?retryWrites=true&w=majority";
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
