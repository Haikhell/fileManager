import bcrypt from "bcryptjs";

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 4);
}

function compare(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export {
  hashPassword,
  compare,
};
