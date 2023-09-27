import pbkdf2 from 'crypto-js/pbkdf2';
import { AES, SHA256, enc } from 'crypto-js';

export function hashPassword(password: string): string {
  return SHA256(password).toString();
}

type GenerateVaultKeyProps = {
  email: string;
  hashedPassword: string;
  salt: string;
};

export function generateVaultKey({
  email,
  hashedPassword,
  salt,
}: GenerateVaultKeyProps): string {
  return pbkdf2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}

type EncryptVaultProps = {
  vaultKey: string;
  vault: string;
};

export function encryptVault({ vaultKey, vault }: EncryptVaultProps): string {
  return AES.encrypt(vault, vaultKey).toString();
}

export function decryptVault({ vaultKey, vault }: EncryptVaultProps) {
  const bytes = AES.decrypt(vault, vaultKey);
  const decrypted = bytes.toString(enc.Utf8);
  try {
    return JSON.parse(decrypted).vault;
  } catch (error) {
    return null;
  }
}
