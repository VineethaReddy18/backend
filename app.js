const express = require("express");
const cors = require("cors");

const { product } = require("./mongo");
const app = express();

app.use(express.json());

app.use(cors());

// ROOT ROUTE
// app.get("/", cors(), (req, res) => {});

app.post("/add-product", async (req, res) => {
  const { prod, sap, prodD, client, qty, serialNo } = req.body;

  const data = {
    prod,
    sap,
    prodD,
    client,
    qty,
    serialNo,
  };

  try {
    await product.insertMany([data]);
    res.send("Data added successfully");
  } catch (e) {
    res.send(e);
  }
});

app.listen(8000, () => {
  console.log("Port Connected");
});
