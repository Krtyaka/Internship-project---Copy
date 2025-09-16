import bcrypt from "bcryptjs";

// Function to hash a plain text password
export const hashPassword = async (plainPassword) => {
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
