import { createServer } from './server';
import { env } from './config/env';
import { logger } from './config/logger';

async function start() {
  try {
    const { fastify } = await createServer();
    
    // Render usa a variável PORT automaticamente
    const port = process.env.PORT || env.API_PORT;
    
    await fastify.listen({
      port: Number(port),
      host: '0.0.0.0',
    });

    logger.info(`API running on port ${port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
