const jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.API_SECRET, { expiresIn: "1h" });
}

module.exports = {
  generateAccessToken
};
