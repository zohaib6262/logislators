import jwt from "jsonwebtoken";

// Generate Token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};
