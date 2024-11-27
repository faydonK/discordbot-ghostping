import { SlashCommandBuilder } from 'discord.js';

export const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('📶・Shows the bot\'s current latency');

  export async function executePing(interaction) {
    await interaction.reply({ 
      content: `Ping: **${interaction.client.ws.ping}ms**`
    });
  }

// Compare this snippet from src/commands/ping.js: