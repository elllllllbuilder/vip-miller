import { createServer } from './server';
import { env } from './config/env';
import { logger } from './config/logger';

async function start() {
  try {
    const { fastify } = await createServer();
    
    // Render OBRIGATORIAMENTE usa process.env.PORT
    const port = process.env.PORT || 3000;
    
    await fastify.listen({
      port: Number(port),
      host: '0.0.0.0', // OBRIGATÓRIO no Render
    });

    console.log(`🚀 API running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
