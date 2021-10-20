const { getCustomError } = require("../../../helpers/errorHandler");
const { getAuthenticatedUser } = require("../../../helpers/authenticationHelpers");

async function deleteGoal(req, res, db) {
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

  await db('goals').where({
    user_email: authenticatedUser.email,
    id: req.params.goal_id
  }).del();

  return res.json({
    type: "Goal deleted",
    attributes: {
      value: req.params.goal_id
    }
  });
}

module.exports = deleteGoal;
