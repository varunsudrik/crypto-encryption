import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [encryptionText, setEncryptionText] = useState("");
  const [decryptionText, setDecryptionText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [email, setEmail] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  const [detectedAlgorithm, setDetectedAlgorithm] = useState("");
  const [uniqueEmails, setUniqueEmails] = useState([]);
  const [decryptionError, setDecryptionError] = useState(null);

  // useEffect(() => {
  //   fetchUniqueEmails();
  // });

  let url = process.env.REACT_APP_BASE_URL;

  const validateEmail = (input) => {
    //  email Validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const encryptMessage = async () => {
    try {
      // Validate email
      if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
      }

      // Check if encryption text is provided
      if (!encryptionText.trim()) {
        alert("Please enter data for encryption");
        return;
      }

      const response = await axios.post(`${url}/encrypt`, {
        algorithm,
        text: encryptionText,
        email,
      });

      setEncryptedResult(response.data.result);
      setDecryptionError(null);
      setDetectedAlgorithm("");
      setDecryptedResult("");
      setEncryptionText("");
      setEmail("");
    } catch (error) {
      console.error("Encryption error:", error);
    }
  };

  const decryptMessage = async () => {
    try {
      // Check if decryption text is provided
      if (!decryptionText.trim()) {
        alert("Please enter data for decryption");
        return;
      }

      const response = await axios.post(`${url}/decrypt`, {
        text: decryptionText,
      });

      setDetectedAlgorithm(response.data.detectedAlgorithm);
      setDecryptedResult(response.data.result);
      setDecryptionError(null);
    } catch (error) {
      console.error("Decryption error:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.error === "Unable to detect encryption algorithm"
      ) {
        setDecryptionError("Unable to detect encryption algorithm");
      } else {
        setDecryptionError("An error occurred during decryption");
      }
    }
  };

  const fetchUniqueEmails = async () => {
    try {
      const response = await axios.get(`${url}/users`);
      setUniqueEmails(response.data.emails);
    } catch (error) {
      console.error("Error fetching unique emails:", error);
    }
  };

  const handleShowUsersClick = () => {
    fetchUniqueEmails();
  };

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = encryptedResult;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copied to clipboard!");
  };

  return (
    <div className="app-container">
      <h1>Encryption and Decryption App</h1>
      <div className="input-container">
        <label>
          Text for Encryption:
          <input
            type="text"
            value={encryptionText}
            onChange={(e) => setEncryptionText(e.target.value)}
          />
        </label>
        <div>
          <label>
            Algorithm:
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="caesar">Caesar</option>
              <option value="vigenere">Vigenere</option>
              <option value="rsa">RSA</option>
            </select>
          </label>
        </div>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button onClick={encryptMessage}>Encrypt</button>
      </div>

      <div className="input-container">
        <label>
          Text for Decryption:
          <input
            type="text"
            value={decryptionText}
            onChange={(e) => setDecryptionText(e.target.value)}
          />
        </label>
        <button onClick={decryptMessage}>Decrypt</button>
      </div>

      {encryptedResult && (
        <div className="result-container">
          <h2>Encrypted Result:</h2>
          <p className="result-text">{encryptedResult}</p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}

      {detectedAlgorithm && (
        <div className="result-container">
          <h2>Detected Algorithm:</h2>
          <p className="result-text">{detectedAlgorithm}</p>
        </div>
      )}
      {decryptionError && (
        <div className="error-container">
          <p className="error-text">{decryptionError}</p>
        </div>
      )}

      {decryptedResult && (
        <div className="result-container">
          <h2>Decrypted Result:</h2>
          <p className="result-text">{decryptedResult}</p>
        </div>
      )}

      <div className="result-container">
        <h2>Unique Emails:</h2>
        <button onClick={handleShowUsersClick}>Show Users</button>

        <ul>
          {uniqueEmails.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
