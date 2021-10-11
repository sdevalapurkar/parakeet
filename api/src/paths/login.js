const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/authenticationHelpers");
const {
  getCustomError
} = require("../helpers/errorHandler");

async function loginUser(req, res, db) {
  if (
    !req.body ||
    !req.body.data ||
    !req.body.data.email ||
    !req.body.data.password
  ) {
    return res.status(400).json(getCustomError(400));
  }

  const record = await db
    .first()
    .from("users")
    .where("user_email", req.body.data.email);

  if (!record) {
    return res.status(401).json(getCustomError(401));
  }

  const isValidUser = await bcrypt.compare(
    req.body.data.password,
    record.user_password
  );

  if (!isValidUser) {
    return res.status(401).json(getCustomError(401));
  }

  const userToLogin = {
    name: record.user_name,
    email: req.body.data.email,
  };

  const accessToken = generateAccessToken(userToLogin);

  return res.json({
    type: "token",
    attributes: {
      value: accessToken,
    }
  });
}

module.exports = loginUser;
