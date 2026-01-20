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
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PORT: parseInt(process.env.API_PORT || '3000', 10),
  DATABASE_URL: assertEnv('DATABASE_URL'),
  
  TELEGRAM_BOT_TOKEN: assertEnv('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_VIP_CHAT_ID: assertEnv('TELEGRAM_VIP_CHAT_ID'),
  TELEGRAM_API_URL: process.env.TELEGRAM_API_URL || 'https://api.telegram.org',
  
  SYNCPAY_API_KEY: assertEnv('SYNCPAY_API_KEY'),
  SYNCPAY_WEBHOOK_SECRET: assertEnv('SYNCPAY_WEBHOOK_SECRET'),
  SYNCPAY_API_URL: process.env.SYNCPAY_API_URL || 'https://api.syncpay.com.br',
  
  PLAN_MONTHLY_ID: process.env.PLAN_MONTHLY_ID || 'monthly_vip',
  PLAN_MONTHLY_PRICE: parseInt(process.env.PLAN_MONTHLY_PRICE || '2990', 10),
};
