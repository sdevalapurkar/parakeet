const { getCustomError } = require("../../helpers/errorHandler");
const { getAuthenticatedUser } = require("../../helpers/authenticationHelpers");

async function getGoals(req, res, db) {
  const authenticatedUser = getAuthenticatedUser(req.headers);

  if (!authenticatedUser) {
    return res.status(401).json(getCustomError(401));
  }

  const records = await db('goals').where({
    user_email: authenticatedUser.email
  });

  if (!records) {
    return res.status(400).json(getCustomError(400));
  }

  return res.json({
    type: "Goals fetched",
    attributes: {
      value: records,
    }
  });
}

module.exports = getGoals;
