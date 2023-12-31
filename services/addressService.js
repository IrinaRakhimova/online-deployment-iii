import { sql } from "../database/database.js";

const topFive = async () => {
  return await sql `SELECT * FROM messages ORDER BY id DESC LIMIT 5`;
};

const create = async (sender, message) => {
  await sql`INSERT INTO messages (sender, message)
    VALUES (${ sender }, ${ message })`;
};
export { topFive, create };