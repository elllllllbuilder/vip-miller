import { Context, NextFunction } from 'grammy';

export async function attachUser(ctx: Context, next: NextFunction) {
  if (ctx.from) {
    ctx.session = {
      user: ctx.from,
    };
  }
  await next();
}
