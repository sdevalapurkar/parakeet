const express = require("express");
const morgan = require("morgan");
const knex = require("knex");

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

// API is listening and server is up
app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`));
