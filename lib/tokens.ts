import { customAlphabet } from "nanoid";

const tokenFactory = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 40);

export function createSecureToken() {
  return tokenFactory();
}

export function expiryFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
