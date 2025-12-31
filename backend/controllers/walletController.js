import db from "../config/db.js";

/* GET WALLET + REWARDS */
export const getWallet = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT 
      w.balance,
      r.points
    FROM wallet w
    LEFT JOIN reward_points r ON w.user_id = r.user_id
    WHERE w.user_id = ?
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        return res.json({ balance: 0, points: 0 });
      }

      res.json(rows[0]);
    }
  );
};
