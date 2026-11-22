import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
// Pool puede significar “piscina”, pero en informática se usa como “grupo de recursos disponibles”.
// Pool es el administrador de conexiones de la librería pg para PostgreSQL.

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
