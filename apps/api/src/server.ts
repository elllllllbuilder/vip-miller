import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { logger } from './config/logger';
import { AppError } from './shared/http/errors';

// Repositories
import { UsersRepository } from './modules/users/users.repo';
import { PaymentsRepository } from './modules/payments/payments.repo';
import { SubscriptionsRepository } from './modules/subscriptions/subscriptions.repo';
import { StateRepository } from './modules/state/state.repo';

// Services
import { UsersService } from './modules/users/users.service';
import { PaymentsService } from './modules/payments/payments.service';
import { SubscriptionsService } from './modules/subscriptions/subscriptions.service';
import { TelegramService } from './modules/telegram/telegram.service';
import { WebhooksService } from './modules/webhooks/webhooks.service';
import { FunnelsService } from './modules/funnels/funnels.service';

// Controllers
import { healthRoutes } from './modules/health/health.controller';
import { paymentsRoutes } from './modules/payments/payments.controller';
import { webhooksRoutes } from './modules/webhooks/webhooks.controller';

export async function createServer() {
  const fastify = Fastify({ 
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    }
  });
  const prisma = new PrismaClient();

  // Repositories
  const usersRepo = new UsersRepository(prisma);
  const paymentsRepo = new PaymentsRepository(prisma);
  const subscriptionsRepo = new SubscriptionsRepository(prisma);
  const stateRepo = new StateRepository(prisma);

  // Services
  const usersService = new UsersService(usersRepo);
  const paymentsService = new PaymentsService(paymentsRepo);
  const subscriptionsService = new SubscriptionsService(subscriptionsRepo);
  const telegramService = new TelegramService();
  const funnelsService = new FunnelsService(stateRepo);
  const webhooksService = new WebhooksService(
    paymentsService,
    subscriptionsService,
    telegramService,
    prisma
  );

  // Error handler
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }

    logger.error(error);
    return reply.status(500).send({
      error: 'Internal server error',
    });
  });

  // Routes
  await healthRoutes(fastify as any, prisma);
  await paymentsRoutes(fastify as any, paymentsService, usersService);
  await webhooksRoutes(fastify as any, webhooksService);

  // Admin routes
  fastify.get('/users', async (request, reply) => {
    const { limit = 100, offset = 0 } = request.query as any;
    const users = await usersService.listUsers(limit, offset);
    return reply.send({ users });
  });

  fastify.post('/users', async (request, reply) => {
    const body = request.body as any;
    const user = await usersService.ensureUserExists({
      id: body.telegram_user_id,
      username: body.username,
      first_name: body.first_name,
      last_name: body.last_name,
    });
    return reply.status(201).send(user);
  });

  fastify.get('/subscriptions', async (request, reply) => {
    const { limit = 100, offset = 0 } = request.query as any;
    const subscriptions = await subscriptionsService.listSubscriptions(limit, offset);
    return reply.send({ subscriptions });
  });

  // Graceful shutdown
  const closeGracefully = async (signal: string) => {
    logger.info(`Received ${signal}, closing gracefully`);
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => closeGracefully('SIGINT'));
  process.on('SIGTERM', () => closeGracefully('SIGTERM'));

  return { fastify, prisma };
}
