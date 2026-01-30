import { Context, NextFunction } from 'grammy';

// Estender o tipo Context para incluir session
declare module 'grammy' {
  interface Context {
    session?: {
      user: any;
    };
  }
}

export async function attachUser(ctx: Context, next: NextFunction) {
  if (ctx.from) {
    ctx.session = {
      user: ctx.from,
    };
  }
  await next();
}
