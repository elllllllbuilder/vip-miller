import { Context, NextFunction } from 'grammy';

const userLastAction = new Map<number, number>();
const RATE_LIMIT_MS = 1000; // 1 segundo

export async function rateLimit(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    return next();
  }

  const userId = ctx.from.id;
  const now = Date.now();
  const lastAction = userLastAction.get(userId) || 0;

  if (now - lastAction < RATE_LIMIT_MS) {
    return; // Ignora ação muito rápida
  }

  userLastAction.set(userId, now);
  await next();
}
