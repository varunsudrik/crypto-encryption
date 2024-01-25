const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
var cors = require("cors");
const rateLimit = require("express-rate-limit");
const encryptionController = require("./encryptionController");
const userController = require("./userController");

const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max Request
});

app.use(limiter);

app.use(express.json());

connectDB();

app.use("/", limiter);

app.use("/", encryptionController);
app.use("/", userController);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
