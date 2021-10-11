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
    await db.schema.dropTableIfExists("goals");
    await db.schema.dropTableIfExists("users");

    await db.schema.withSchema("public").createTable("users", (table) => {
      table.increments();
      table.string("user_email");
      table.string("user_password");
      table.string("user_name");
      table.timestamps();

      table.dropPrimary();
      table.primary(["user_email"]);
    });
    console.log("Created users table!");

    await db.schema.withSchema("public").createTable("goals", (table) => {
      table.increments();
      table.string("user_email")
        .references("user_email")
        .inTable("users");
      table.string("goal_name");
      table.integer("goal_times");
      table.timestamps();
    });
    console.log("Created goals table!");

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
})();
