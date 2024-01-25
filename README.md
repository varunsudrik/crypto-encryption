# Encryption and Decryption App

This full-stack web application provides text encryption and decryption functionalities using various algorithms. The frontend is built with React, and the backend is powered by Node.js. The application supports containerization with Docker and Docker Compose.

## Features

- Encrypt text using algorithms like Caesar, Vigenere, and RSA.
- Decrypt encrypted text with automatic algorithm detection.
- Copy encrypted results to the clipboard.
- Fetch and display a list of unique user emails.

## Technologies Used

- Frontend: React
- Backend: Node.js, Express
- Containerization: Docker, Docker Compose


## Usage

- Enter text, choose an algorithm, and provide an email to encrypt the text.
- Click the "Encrypt" button to see the encrypted result.
- Enter encrypted text for decryption and click the "Decrypt" button.
- Use the "Copy to Clipboard" button to copy encrypted text.
- Click "Show Users" to fetch and display a list of unique user emails.

## Folder Structure

- `client`: React frontend code.
- `server`: Node.js backend code.

## Security

### API Security Validation

- The application employs API security validation to ensure that incoming requests are valid and secure.
- Input data is sanitized and validated on the server-side to prevent common security vulnerabilities.

### Rate Limiting

- To prevent abuse and protect against potential attacks, the API has rate-limiting measures in place.
- Rate limiting restricts the number of requests a user can make within a specified time frame.
- Exceeding the allowed number of requests results in temporary or permanent restrictions.

## How to Start

### Clone Project

```bash
git clone https://github.com/your-username/encryption-decryption-app.git
cd encryption-decryption-app
# Encryption and Decryption App

This full-stack web application provides text encryption and decryption functionalities using various algorithms. The frontend is built with React, and the backend is powered by Node.js. The application supports containerization with Docker and Docker Compose.


## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/encryption-decryption-app.git
    cd encryption-decryption-app
    ```

2. **Build and run the Docker Compose stack:**

    ```bash
    docker-compose up --build
    ```
    OR
# Navigate to the client folder:
cd client

# Install dependencies:
npm install

# Start the React client:
npm start

# Navigate to the server folder:
cd server

# Install dependencies:
npm install

# Start the Express client:
node server.js


3. **Access the application:**

    - React client: [http://localhost:3000]
    - Node.js server: [http://localhost:3005]

   Live URL: [https://crypto-encryption-varun.netlify.app/]



