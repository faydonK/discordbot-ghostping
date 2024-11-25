import { Client, Events, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';
import { executeGhostPing } from './commands/ghostPing.js';
import { executeSetChannel } from './commands/setChannel.js';

export class Bot {
  constructor(config) {
    this.config = config;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.reconnectAttempts = 0;
    this.isShuttingDown = false;
    this.ghostChannels = new Set();
  }

  async start() {
    try {
      this.setupEventHandlers();
      await this.connect();
    } catch (error) {
      this.handleFatalError(error);
    }
  }

  setupEventHandlers() {
    this.client.on(Events.ClientReady, () => {
      console.log('✅ Bot is ready!');
      console.log(`📡 Connected as ${this.client.user.tag}`);
      console.log('💭 Use /setchannel to configure the ghost ping channels (Admin only)');
      this.reconnectAttempts = 0;
    });

    this.client.on(Events.GuildMemberAdd, async (member) => {
      if (this.ghostChannels.size === 0) return;
      
      for (const channelId of this.ghostChannels) {
        const channel = member.guild.channels.cache.get(channelId);
        if (channel) {
          try {
            const message = await channel.send(`<@${member.id}>`);
            await message.delete();
          } catch (error) {
            console.error(`Failed to ghost ping in channel ${channelId}:`, error);
          }
        }
      }
    });

    this.client.on(Events.InteractionCreate, async interaction => {
      if (interaction.isButton()) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          await interaction.reply({ 
            content: '❌ You need Administrator permissions to use these buttons!',
            ephemeral: true 
          });
          return;
        }

        const [action, channelId] = interaction.customId.split(':');
        
        if (action === 'add_channel') {
          this.ghostChannels.add(interaction.channelId);
          await interaction.reply({ 
            content: '✅ Channel added to ghost ping list!',
            ephemeral: true 
          });
        } else if (action === 'remove_channel') {
          this.ghostChannels.delete(interaction.channelId);
          await interaction.reply({ 
            content: '✅ Channel removed from ghost ping list!',
            ephemeral: true 
          });
        }
        return;
      }

      if (!interaction.isChatInputCommand()) return;

      try {
        switch (interaction.commandName) {
          case 'ghostping':
            await executeGhostPing(interaction, this.ghostChannels);
            break;
          case 'setchannel':
            await executeSetChannel(interaction, this.ghostChannels);
            break;
        }
      } catch (error) {
        console.error('Error handling command:', error);
        const reply = {
          content: 'There was an error executing this command!',
          ephemeral: true
        };
        
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    });

    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
      this.handleReconnect();
    });

    this.client.on('disconnect', () => {
      console.log('🔌 Bot disconnected from Discord');
      this.handleReconnect();
    });
  }

  async connect() {
    try {
      console.log('🔄 Connecting to Discord...');
      await this.client.login(this.config.token);
    } catch (error) {
      if (error.code === 'TokenInvalid') {
        throw new Error(
          '❌ Invalid Discord token! Please check your .env file and ensure the token is correct.'
        );
      }
      throw error;
    }
  }

  async handleReconnect() {
    if (this.isShuttingDown) return;

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.handleFatalError(
        new Error('❌ Max reconnection attempts reached. Please check your internet connection and token.')
      );
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isShuttingDown) {
        this.connect().catch(error => {
          console.error('Reconnection attempt failed:', error);
        });
      }
    }, this.config.reconnectDelay);
  }

  handleFatalError(error) {
    this.isShuttingDown = true;
    console.error('\n⛔ Fatal error occurred:');
    console.error(error.message);
    console.error('\n📋 Troubleshooting steps:');
    console.error('1. Check your internet connection');
    console.error('2. Verify your Discord bot token in the .env file');
    console.error('3. Ensure the bot has the required permissions');
    console.error('4. Check Discord API status: https://discordstatus.com\n');
    process.exit(1);
  }
}