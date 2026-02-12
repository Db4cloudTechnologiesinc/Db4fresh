import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const token = jwt.sign(
    {
      id: "admin123",
      role: "admin",
    },
    process.env.ADMIN_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
};
