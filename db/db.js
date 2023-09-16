import dotenv from "dotenv";
import pg from "pg";
import logger from "../tools/logging.js";

const { Client } = pg;
dotenv.config({
  path: "local.env"
});

var client = new Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  host: process.env.PG_HOST,
  ssl: process.env.PG_SSL,
});

client.connect((err) => {
  const db = process.env.PG_DATABASE;
  const port = process.env.PG_PORT;
  try {
    logger.info("🛢 Connected to DB " + db + " on port " + port);
  } catch (error) {
    logger.error(err);
    return;
  }
});

export default client;
