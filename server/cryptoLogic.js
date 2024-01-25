const crypto = require("crypto");

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
};

const encryptRSA = (publicKey, text) => {
  return (
    crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(text, "utf-8")
      )
      .toString("base64") + ".$$"
  );
};

const decryptRSA = (privateKey, text) => {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(text, "base64"))
    .toString("utf-8");
};

// Caesar Cipher Logic
function caesarCipher(text, shift) {
  text = text.toUpperCase();

  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);

    if (char.match(/[A-Z]/)) {
      const encryptedChar = String.fromCharCode(
        ((char.charCodeAt(0) + shift - "A".charCodeAt(0)) % 26) +
          "A".charCodeAt(0)
      );
      result += encryptedChar;
    } else {
      result += char;
    }
  }

  return result;
}

// Vigenere Cipher Logic
function vigenereCipher(text, keyword) {
  text = text.toUpperCase();
  keyword = keyword.toUpperCase();

  let result = "";

  for (let i = 0, j = 0; i < text.length; i++) {
    const char = text.charAt(i);

    if (char.match(/[A-Z]/)) {
      const shift = keyword.charCodeAt(j) - "A".charCodeAt(0);
      const encryptedChar = String.fromCharCode(
        ((char.charCodeAt(0) + shift - "A".charCodeAt(0)) % 26) +
          "A".charCodeAt(0)
      );
      result += encryptedChar;

      j = (j + 1) % keyword.length;
    } else {
      result += char;
    }
  }

  return result;
}

function detectEncryptionAlgorithm(text) {
  if (text.endsWith(".$$$")) {
    return "caesar";
  } else if (text.endsWith(".$$$$")) {
    return "vigenere";
  } else if (text.endsWith(".$$")) {
    return "rsa";
  }

  return null;
}

function removeDetectionSuffix(text) {
  const caesarSuffix = ".$$$";
  const vigenereSuffix = ".$$$$";
  const rsaSuffix = ".$$";

  if (text.endsWith(caesarSuffix)) {
    return text.slice(0, -caesarSuffix.length);
  } else if (text.endsWith(vigenereSuffix)) {
    return text.slice(0, -vigenereSuffix.length);
  } else if (text.endsWith(rsaSuffix)) {
    return text.slice(0, -rsaSuffix.length);
  }

  return text;
}

function caesarDecipher(text, shift) {
  text = text.toUpperCase();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);

    if (char.match(/[A-Z]/)) {
      const originalPosition =
        (char.charCodeAt(0) - "A".charCodeAt(0) - shift + 26) % 26;
      const decryptedChar = alphabet.charAt(originalPosition);
      result += decryptedChar;
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

function vigenereDecipher(text, keyword) {
  text = text.toUpperCase();
  keyword = keyword.toUpperCase();

  let result = "";

  for (let i = 0, j = 0; i < text.length; i++) {
    const char = text.charAt(i);

    if (char.match(/[A-Z]/)) {
      const shift = keyword.charCodeAt(j) - "A".charCodeAt(0);
      const originalPosition =
        (char.charCodeAt(0) - "A".charCodeAt(0) - shift + 26) % 26;
      const decryptedChar = String.fromCharCode(
        originalPosition + "A".charCodeAt(0)
      );
      result += decryptedChar;

      j = (j + 1) % keyword.length;
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

module.exports = {
  generateKeyPair,
  encryptRSA,
  decryptRSA,
  caesarCipher,
  vigenereCipher,
  detectEncryptionAlgorithm,
  removeDetectionSuffix,
  caesarDecipher,
  vigenereDecipher,
};
