const express = require("express");
const cryptoLogic = require("./cryptoLogic");
const Message = require("./messageModel");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");

const router = express.Router();

const {
  encryptRSA,
  decryptRSA,
  caesarCipher,
  vigenereCipher,
  detectEncryptionAlgorithm,
  removeDetectionSuffix,
  caesarDecipher,
  vigenereDecipher,
} = cryptoLogic;

const { publicKey, privateKey } = cryptoLogic.generateKeyPair();

router.post("/encrypt", async (req, res) => {
  try {
    const { algorithm, text, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let result;
    let shift = 8;
    let keyword = "cryptii";
    const encryptedEmail = CryptoJS.AES.encrypt(
      email,
      process.env.Secret_Key
    ).toString();

    switch (algorithm) {
      case "caesar":
        result = caesarCipher(text, shift) + ".$$$"; // Append .$$$ for Caesar
        break;
      case "vigenere":
        result = vigenereCipher(text, keyword) + ".$$$$"; // Append .$$$$ for Vigenere
        break;
      case "rsa":
        result = encryptRSA(publicKey, text); // Append .$$ for RSA
        break;
      default:
        return res.status(400).json({ error: "Invalid algorithm specified" });
    }

    const encryptedMessage = new Message({
      algorithm,
      text,
      email: encryptedEmail,
    });

    await encryptedMessage.save();

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/decrypt", (req, res) => {
  try {
    let { text } = req.body;
    const detectedAlgorithm = detectEncryptionAlgorithm(text);

    if (!detectedAlgorithm) {
      return res
        .status(400)
        .json({ error: "Unable to detect encryption algorithm" });
    }

    let result;

    switch (detectedAlgorithm) {
      case "caesar":
        text = removeDetectionSuffix(text);
        result = caesarDecipher(text, shift);
        break;
      case "vigenere":
        text = removeDetectionSuffix(text);
        result = vigenereDecipher(text, keyword);
        break;
      case "rsa":
        text = removeDetectionSuffix(text);
        result = decryptRSA(privateKey, text);
        break;
      default:
        return res.status(400).json({ error: "Invalid algorithm detected" });
    }

    res.json({ result, detectedAlgorithm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
