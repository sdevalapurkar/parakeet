const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/authenticationHelpers");
const {
  getCustomError
} = require("../helpers/errorHandler");

async function registerUser(req, res, db) {
  if (
    !req.body ||
    !req.body.data ||
    !req.body.data.name ||
    !req.body.data.email ||
    !req.body.data.password
  ) {
    return res.status(400).json(getCustomError(400));
  }

  const hashedPassword = await bcrypt.hash(req.body.data.password, 10);

  const userToRegister = {
    user_name: req.body.data.name,
    user_email: req.body.data.email,
    user_password: hashedPassword,
  };

  try {
    await db("users").insert(userToRegister);
  } catch (e) {
    return res.status(500).json(getCustomError(500));
  }
  const accessToken = generateAccessToken({ email: req.body.data.email, name: req.body.data.name });

  return res.json({
    type: 'token',
    attributes: {
      value: accessToken
    }
  });
}

module.exports = registerUser;
