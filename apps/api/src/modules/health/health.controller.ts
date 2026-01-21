import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export async function healthRoutes(fastify: any, prisma: PrismaClient) {
  fastify.get('/health', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error) {
      return reply.status(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  });
}
