import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { ghostPingCommand } from './commands/ghostPing.js';
import { setChannelCommand } from './commands/setChannel.js';

const commands = [
  ghostPingCommand.toJSON(),
  setChannelCommand.toJSON()
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