const { getCustomError } = require("../../helpers/errorHandler");
const { getAuthenticatedUser } = require("../../helpers/authenticationHelpers");

async function addGoal(req, res, db) {
  if (
    !req.body ||
    !req.body.data ||
    !req.body.data.goal
  ) {
    return res.status(400).json(getCustomError(400));
  }

  const authenticatedUser = getAuthenticatedUser(req.headers);

  if (!authenticatedUser) {
    return res.status(401).json(getCustomError(401));
  }

  const { name, time, startDate, endDate } = req.body.data.goal;

  const record = await db('goals').insert({
    user_email: authenticatedUser.email,
    goal_name: name,
    goal_times: time,
    goal_start_date: startDate,
    goal_end_date: endDate
  }, ['id']);

  if (!record || !record[0] || !record[0].id) {
    return res.status(400).json(getCustomError(400));
  }

  return res.json({
    type: "Goal created",
    attributes: {
      value: record[0].id,
    }
  });
}

module.exports = addGoal;
