import { Pool } from "pg";

// Centralised PostgreSQL connection used by the app server.
export const pool = new Pool({
  host: "localhost",
  port: 5433,
  user: "dvf",
  password: "dvfpass",
  database: "dvfdb",
});
