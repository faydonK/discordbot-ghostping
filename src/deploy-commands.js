import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { setChannelCommand } from './commands/setChannel.js';
import { helpCommand } from './commands/help.js';
import { pingCommand } from './commands/ping.js';

// Load environment variables
config();

// Debug logs
console.log('Environment check:');
console.log('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
console.log('CLIENT_ID exists:', !!process.env.CLIENT_ID);

// Verify required environment variables
if (!process.env.DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN is missing in environment variables');
}

if (!process.env.CLIENT_ID) {
    throw new Error('CLIENT_ID is missing in environment variables');
}

const commands = [
    setChannelCommand.toJSON(),
    helpCommand.toJSON(),
    pingCommand.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('🔄 Starting command deployment...');
    
    const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );

    console.log(`✅ Successfully deployed ${data.length} commands!`);
} catch (error) {
    console.error('❌ Error deploying commands:', error);
}