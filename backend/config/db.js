
// import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Nikhilch@45",
//   database: "db4fresh",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// export default db;
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Nikhilch@45",
  database: process.env.DB_NAME || "db4fresh",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Optional: Test DB connection at startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
  }
})();

export default pool;