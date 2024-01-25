const express = require("express");
const Message = require("./messageModel");
const CryptoJS = require("crypto-js");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const messages = await Message.find();
    const uniqueEmails = Array.from(
      new Set(
        messages.map((msg) =>
          CryptoJS.AES.decrypt(msg.email, process.env.Secret_Key).toString(
            CryptoJS.enc.Utf8
          )
        )
      )
    );
    res.json({ emails: uniqueEmails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
