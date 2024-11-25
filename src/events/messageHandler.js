import { handleGhostPing } from '../commands/ghostPing.js';
import { handleSetChannel } from '../commands/setChannel.js';

export class MessageHandler {
  constructor() {
    this.ghostChannel = null;
  }

  async handleMessage(message) {
    if (message.author.bot) return;

    if (message.content.startsWith('!setchannel')) {
      this.ghostChannel = await handleSetChannel(message);
      return;
    }

    if (message.content.startsWith('!ghostping')) {
      await handleGhostPing(message, this.ghostChannel);
    }
  }
}