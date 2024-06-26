const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { product, PDF } = require("./mongo");
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
    const response1 = await product.insertMany([data]);

    res.send("Data added successfully");
  } catch (e) {
    res.send(e);
  }
});

app.post("/product/:prod", async (req, res) => {
  const { prod } = req.params;
  const { stationId, arrivalTime } = req.body;
  const newStatProd = { stationId, arrivalTime };
  // console.log(stationId, arrivalTime, prod);
  try {
    const result = await product.findOne({ prod: prod });
    const { productHistory, prevStation } = result;
    const updatedProductHistory = [...productHistory, newStatProd];
    const result2 = await product.updateMany(
      { prod: prod },
      {
        $set: {
          productHistory: updatedProductHistory,
          prevStation: prevStation + 1,
        },
      }
    );
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.get("/product/:prod", async (req, res) => {
  const { prod } = req.params;
  try {
    const result = await product.findOne({ prod: prod });
    // console.log(result);
    if (result !== null) {
      res.send({
        found: true,
        prevStation: result.prevStation,
        productDb: result,
      });
    } else if (result.length == 0) {
      res.send({ found: false });
    }
  } catch (e) {
    res.send(e);
  }
});

app.listen(8000, () => {
  console.log("Port Connected");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload PDF
app.post("/upload", upload.single("pdf"), async (req, res) => {
  const file = req.file;
  const newPDF = new PDF({
    filename: file.originalname,
    contentType: file.mimetype,
    data: file.buffer,
  });

  try {
    await newPDF.save();
    console.log("pdf uploaded");
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file");
  }
});

// Endpoint to retrieve PDF
app.get("/file/:filename", async (req, res) => {
  try {
    const file = await PDF.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving file");
  }
});
