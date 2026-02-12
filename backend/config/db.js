
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nikhilch@45",
  database: "db4fresh",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
