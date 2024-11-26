import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { setChannelCommand } from './commands/setChannel.js';
import { helpCommand } from './commands/help.js';
import { pingCommand } from './commands/ping.js';

const commands = [
  setChannelCommand.toJSON(),
  helpCommand.toJSON(),
  pingCommand.toJSON()
];

const rest = new REST().setToken(config.token);

try {
  console.log('🔄 Started refreshing application (/) commands...');

  await rest.put(
    Routes.applicationCommands(config.clientId),
    { body: commands },
  );

  console.log('✅ Successfully reloaded application (/) commands!');
} catch (error) {
  console.error('❌ Error deploying commands:', error);
}