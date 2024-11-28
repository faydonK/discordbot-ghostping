import { Bot } from './bot.js';
import config from './config.js';

console.log('🤖 Starting Discord Ghost Ping Bot...');

process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled Promise Rejection:');
  console.error(error);
  process.exit(1);
});

const bot = new Bot(config);

bot.start().catch((error) => {
  console.error('\n❌ Failed to start bot:');
  console.error(error.message);
  process.exit(1);
});