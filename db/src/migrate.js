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

(async () => {
  try {
    await db.schema.dropTableIfExists("users");
    await db.schema.withSchema("public").createTable("users", (table) => {
      table.increments();
      table.string("email");
      table.string("password");
      table.timestamps();

      table.dropPrimary();
      table.primary(["email"]);
    });
    console.log("Created users table!");
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
})();
