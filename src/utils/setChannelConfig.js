import { 
  EmbedBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ActionRowBuilder,
  ChannelType
} from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

const colors = ['#FF69B4', '#FF4500', '#1E90FF', '#32CD32', '#FFD700'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const CONFIG_PATH = './data/channels.json';

async function loadChannels() {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    return new Set(config.ghostChannels);
  } catch (error) {
    console.log('No existing channels configuration found, creating new one...');
    return new Set();
  }
}

async function saveChannels(ghostChannels) {
  const config = {
    ghostChannels: Array.from(ghostChannels)
  };
  
  try {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving channels configuration:', error);
  }
}

function createConfigEmbed(ghostChannels) {
  return new EmbedBuilder()
    .setColor(getRandomColor())
    .setTitle('👻 Ghost Ping Channel Configuration')
    .setDescription('Use the buttons below to manage the configured channels.')
    .addFields({
      name: 'Configured Channels',
      value: ghostChannels.size > 0
        ? Array.from(ghostChannels).map(id => `<#${id}>`).join('\n')
        : 'No channels configured'
    })
    .setFooter({ 
      text: 'New members will be ghost pinged in these channels' 
    });
}

function findChannel(guild, input) {
  console.log('\n🔍 Searching for channel:');
  console.log(`   Input received: "${input}"`);
  
  input = input.trim();
  console.log(`   Cleaned input: "${input}"`);
  
  const mentionMatch = input.match(/<#(\d+)>/);
  if (mentionMatch) {
    console.log(`   Mention detected, ID: ${mentionMatch[1]}`);
    const channel = guild.channels.cache.get(mentionMatch[1]);
    console.log(`   Channel found by mention: ${channel ? channel.name : 'null'}`);
    return channel;
  }

  if (/^\d+$/.test(input)) {
    console.log(`   ID detected: ${input}`);
    const channel = guild.channels.cache.get(input);
    console.log(`   Channel found by ID: ${channel ? channel.name : 'null'}`);
    return channel;
  }

  const name = input.replace(/^#/, '').toLowerCase();
  console.log(`   Searching by name: "${name}"`);
  
  console.log('   Available channels:');
  guild.channels.cache
    .filter(c => c.type === ChannelType.GuildText)
    .forEach(c => console.log(`      - ${c.name} (${c.id})`));

  const channel = guild.channels.cache.find(
    channel => channel.name.toLowerCase() === name &&
               channel.type === ChannelType.GuildText
  );
  
  console.log(`   Channel found by name: ${channel ? channel.name : 'null'}`);
  return channel;
}

function validateChannel(channel) {
  if (!channel) {
    return {
      isValid: false,
      error: '❌ Channel not found. Make sure to mention a valid channel (e.g., #general).'
    };
  }

  if (channel.type !== ChannelType.GuildText) {
    return {
      isValid: false,
      error: '❌ Only text channels can be configured.'
    };
  }

  if (!channel.permissionsFor(channel.guild.members.me).has(['SendMessages', 'ViewChannel'])) {
    return {
      isValid: false,
      error: '❌ I do not have the necessary permissions in this channel.'
    };
  }

  return {
    isValid: true
  };
}

async function handleChannelAdd(interaction, ghostChannels, configMessage, userId) {
  await interaction.reply({
    content: '📝 Please type the channel to be configured (e.g., #general)',
    ephemeral: true
  });

  const filter = m => m.author.id === userId;
  const collector = interaction.channel.createMessageCollector({
    filter,
    time: 30000,
    max: 1
  });

  collector.on('collect', async message => {
    try {
      await message.fetch();
      
      const channel = message.mentions.channels.first();

      await new Promise(resolve => setTimeout(resolve, 700));
      await message.delete().catch(console.error);

      if (!channel) {
        await interaction.followUp({
          content: '❌ Channel not found. Make sure to mention a channel using #',
          ephemeral: true
        });
        return;
      }

      if (ghostChannels.has(channel.id)) {
        await interaction.followUp({
          content: '❌ This channel is already configured.',
          ephemeral: true
        });
        return;
      }

      ghostChannels.add(channel.id);
      await saveChannels(ghostChannels);
      
      await configMessage.edit({
        embeds: [createConfigEmbed(ghostChannels)]
      });

      await interaction.followUp({
        content: `✅ Channel ${channel} has been added to the ghost ping list.`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error processing channel:', error);
      await interaction.followUp({
        content: '❌ An error occurred while processing the channel.',
        ephemeral: true
      });
    }
  });
}

async function handleChannelRemove(interaction, ghostChannels, configMessage) {
  await interaction.reply({
    content: '📝 Please type the channel to be removed (e.g., #general)',
    ephemeral: true
  });

  const filter = m => m.author.id === interaction.user.id;
  const collector = interaction.channel.createMessageCollector({
    filter,
    time: 30000,
    max: 1
  });

  collector.on('collect', async message => {
    try {
      await message.delete();

      const channelMention = message.content.trim();
      console.log(`Collected message content: "${channelMention}"`);
      const channel = findChannel(interaction.guild, channelMention);

      if (!ghostChannels.has(channel.id)) {
        await interaction.followUp({
          content: '❌ This channel is not in the ghost ping list.',
          ephemeral: true
        });
        return;
      }

      ghostChannels.delete(channel.id);
      await saveChannels(ghostChannels); 
      await configMessage.edit({
        embeds: [createConfigEmbed(ghostChannels)]
      });

      await interaction.followUp({
        content: `✅ Channel <#${channel.id}> has been removed from the ghost ping list.`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error removing channel:', error);
      await interaction.followUp({
        content: '❌ An error occurred while removing the channel.',
        ephemeral: true
      });
    }
  });
}

export { createConfigEmbed, findChannel, handleChannelAdd, handleChannelRemove, loadChannels, saveChannels };