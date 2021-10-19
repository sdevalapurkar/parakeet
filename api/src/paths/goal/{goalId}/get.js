const { getCustomError } = require("../../../helpers/errorHandler");
const { getAuthenticatedUser } = require("../../../helpers/authenticationHelpers");

async function getGoal(req, res, db) {
  if (
    !req.params ||
    !req.params.goal_id
  ) {
    return res.status(400).json(getCustomError(400));
  }

  const authenticatedUser = getAuthenticatedUser(req.headers);

  if (!authenticatedUser) {
    return res.status(401).json(getCustomError(401));
  }

  const record = await db('goals').where({
    user_email: authenticatedUser.email,
    id: req.params.goal_id
  });

  if (!record || !record.length) {
    return res.status(400).json(getCustomError(400));
  }

  return res.json({
    type: "Goal fetched",
    attributes: {
      value: record[0],
    }
  });
}

module.exports = getGoal;
