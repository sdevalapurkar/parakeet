const { getCustomError } = require("../../../helpers/errorHandler");
const { getAuthenticatedUser } = require("../../../helpers/authenticationHelpers");

async function updateGoalProgress(req, res, db) {
  if (
    !req.body ||
    !req.body.data ||
    !req.body.data.goal ||
    !req.body.data.goal.id ||
    !req.body.data.goal.practiceTimes
  ) {
    return res.status(400).json(getCustomError(400));
  }

  const authenticatedUser = getAuthenticatedUser(req.headers);

  if (!authenticatedUser) {
    return res.status(401).json(getCustomError(401));
  }

  await db('goals').where({
    user_email: authenticatedUser.email,
    id: req.body.data.goal.id
  }).update({
    goal_practice_times: Number(req.body.data.goal.existingPracticeTimes) + Number(req.body.data.goal.practiceTimes)
  });

  return res.json({
    type: "Goal progress updated",
    attributes: {
      value: req.body.data.goal.id
    }
  });
}

module.exports = updateGoalProgress;
