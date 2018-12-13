const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/naluDB")
  .then(() => console.log("Conected to MongoDB"))
  .catch(err => console.log("Could not conect to MongoDB", err));

module.exports = mongoose;
