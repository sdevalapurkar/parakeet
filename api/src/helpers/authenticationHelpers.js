const jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.API_SECRET, { expiresIn: "1h" });
}

function getAuthenticatedUser(headers) {
  let currentUser = null;

  if (!headers || !headers.authorization) {
    return currentUser;
  }

  const token = headers.authorization.split(" ")[1];

  if (!token) {
    return currentUser;
  }

  jwt.verify(token, process.env.API_SECRET, (err, decoded) => {
    if (!err && decoded) {
      currentUser = decoded;
    }
  });

  return currentUser;
}

module.exports = {
  generateAccessToken,
  getAuthenticatedUser
};
