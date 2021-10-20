const express = require("express");
const morgan = require("morgan");
const knex = require("knex");
const registerUser = require("./paths/register");
const loginUser = require("./paths/login");
const addGoal = require("./paths/goal/add");
const getGoals = require("./paths/goal/get");
const getGoal = require("./paths/goal/{goalId}/get");
const updateGoalProgress = require("./paths/goal/{goalId}/updateProgress");

const db = knex({
  client: "postgres",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
const PORT = process.env.PORT || 5000;
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, responseType"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  next();
});

// Root endpoint (health check)
app.get("/", (req, res) => {
  res.send("Welcome to the Parakeet API!");
});

// Register as a new user
app.post("/v1/register", async (req, res) => {
  return registerUser(req, res, db);
});

// Login as an existing user
app.post("/v1/login", async (req, res) => {
  return loginUser(req, res, db);
});

// Adds a record to the goals table
app.post("/v1/goals", async (req, res) => {
  return addGoal(req, res, db);
});

app.get("/v1/goals", async (req, res) => {
  return getGoals(req, res, db);
});

app.get("/v1/goals/:goal_id", async (req, res) => {
  return getGoal(req, res, db);
});

app.put("/v1/goals/:goal_id/progress", async (req, res) => {
  return updateGoalProgress(req, res, db);
});

// API is listening and server is up
app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`));
