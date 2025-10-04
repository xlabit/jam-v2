import bcrypt from 'bcrypt';

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, 10);
}
