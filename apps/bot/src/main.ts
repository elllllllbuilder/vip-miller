import { createBot } from './bot';

async function start() {
  const bot = createBot();

  console.log('🤖 Bot starting...');
  
  await bot.start({
    onStart: (botInfo) => {
      console.log(`✅ Bot @${botInfo.username} is running!`);
    },
  });
}

start().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
