import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const PEPPER = process.env.AUTH_SECRET;

export function saltAndHashPassword(password: string): string {
  if (!password) {
    throw new Error("Password is required");
  }

  // Generate a salt
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);

  const hash = bcrypt.hashSync(password + PEPPER, salt);

  return hash;
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) {
    throw new Error("Password and hash are required");
  }
  // Compare the password with the hash
  const isMatch = await bcrypt.compare(password + PEPPER, hash);

  console.log("password match: " + isMatch);

  return Promise.resolve(isMatch);
}
