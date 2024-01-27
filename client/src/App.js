import React, { useState } from "react";
import axios from "axios";

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const encryptMessage = async () => {
    try {
      if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
      }

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
    <div className="container mt-5">
      <h1 className="mb-4">Encryption and Decryption App</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <label>
            Text for Encryption:
            <input
              className="form-control"
              type="text"
              value={encryptionText}
              onChange={(e) => setEncryptionText(e.target.value)}
            />
          </label>
        </div>
        <div className="col-md-3">
          <label>
            Algorithm:
            <select
              className="form-control"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="caesar">Caesar</option>
              <option value="vigenere">Vigenere</option>
              <option value="rsa">RSA</option>
            </select>
          </label>
        </div>
        <div className="col-md-3">
          <label>
            Email:
            <input
              className="form-control"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>

        </div>
        <div className="col-md-12 mt-2">
          <button className="btn btn-primary" onClick={encryptMessage}>
            Encrypt
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label>
            Text for Decryption:
            <input
              className="form-control"
              type="text"
              value={decryptionText}
              onChange={(e) => setDecryptionText(e.target.value)}
            />
          </label>
        </div>
        <div className="col-md-12 mt-2">
          <button className="btn btn-primary" onClick={decryptMessage}>
            Decrypt
          </button>
        </div>
      </div>

      {encryptedResult && (
  <div className="row mb-4">
    <div className="col-md-12">
      <h2>Encrypted Result:</h2>
      <p className="result-text" style={{ wordWrap: "break-word" }}>
        {encryptedResult}
      </p>
      <button className="btn btn-secondary" onClick={copyToClipboard}>
        Copy to Clipboard
      </button>
    </div>
  </div>
)}

      {detectedAlgorithm && (
        <div className="row mb-4">
          <div className="col-md-12">
            <h2>Detected Algorithm:</h2>
            <p className="result-text">{detectedAlgorithm}</p>
          </div>
        </div>
      )}
      {decryptionError && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-danger" role="alert">
              {decryptionError}
            </div>
          </div>
        </div>
      )}

      {decryptedResult && (
        <div className="row mb-4">
          <div className="col-md-12">
            <h2>Decrypted Result:</h2>
            <p className="result-text">{decryptedResult}</p>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-12">
          <h2>Unique Emails:</h2>
          <button className="btn btn-primary" onClick={handleShowUsersClick}>
            Show Users
          </button>

          <ul>
            {uniqueEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
