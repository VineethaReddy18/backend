const mongoose = require("mongoose");

const uri =
  "mongodb+srv://ajay:ajay123@internship.72tr1xq.mongodb.net/?retryWrites=true&w=majority&appName=internship";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

const productsSchema = mongoose.Schema({
  prod: {
    type: String,
    required: false,
  },
  sap: {
    type: String,
    required: false,
  },
  prodD: {
    type: String,
    required: false,
  },
  client: {
    type: String,
    required: false,
  },
  qty: {
    type: String,
    required: false,
  },
  serialNo: {
    type: String,
    required: true,
  },
});

const product = mongoose.model("product", productsSchema);

module.exports = { product };
