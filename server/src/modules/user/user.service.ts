import { UserModel } from './user.model';
import crypto from 'crypto';
import argon2 from 'argon2';

export function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}

export async function generateHash(password: string) {
  return argon2.hash(password);
}

export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    password: input.hashedPassword,
  });
}

export async function findUserByEmailAndPassword({
  email,
  hashedPassword,
}: {
  hashedPassword: string;
  email: string;
}) {
  const user = await UserModel.findOne({ email });
  const hash = await generateHash(hashedPassword);
  if (!user || !argon2.verify(user.password, hash)) {
    return null;
  }
  return user;
}
