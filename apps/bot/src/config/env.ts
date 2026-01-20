import dotenv from 'dotenv';

dotenv.config();

function assertEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  TELEGRAM_BOT_TOKEN: assertEnv('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_VIP_CHAT_ID: assertEnv('TELEGRAM_VIP_CHAT_ID'),
  API_URL: process.env.API_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
