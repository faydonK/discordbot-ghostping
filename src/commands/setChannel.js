import { 
  SlashCommandBuilder, 
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from 'discord.js';
import { createConfigEmbed, handleChannelAdd, handleChannelRemove, saveChannels } from '../utils/setChannelConfig.js';

export const setChannelCommand = new SlashCommandBuilder()
  .setName('setchannel')
  .setDescription('👻・Configure welcome ghost ping channels')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function executeSetChannel(interaction, ghostChannels) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return await interaction.reply({ 
      content: '❌ You need Administrator permissions to use this command!',
      ephemeral: true 
    });
  }

  const addButton = new ButtonBuilder()
    .setCustomId('add_channel')
    .setLabel('Add')
    .setStyle(ButtonStyle.Secondary);

  const removeButton = new ButtonBuilder()
    .setCustomId('remove_channel')
    .setLabel('Remove')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder()
    .addComponents(addButton, removeButton);

  const configEmbed = createConfigEmbed(ghostChannels);
  
  const message = await interaction.reply({
    embeds: [configEmbed],
    components: [row],
    fetchReply: true
  });

  const collector = message.createMessageComponentCollector({
    time: 300000 // 5 minutes
  });

  collector.on('collect', async i => {
    if (i.user.id !== interaction.user.id) {
      await i.reply({
        content: '❌ You cannot use these buttons.',
        ephemeral: true
      });
      return;
    }

    if (i.customId === 'add_channel') {
      await handleChannelAdd(i, ghostChannels, message, interaction.user.id);
    } else if (i.customId === 'remove_channel') {
      await handleChannelRemove(i, ghostChannels, message);
    }
  });

  collector.on('end', async () => {
    try {
      const fetchedMessage = await message.channel.messages.fetch(message.id);
      if (fetchedMessage) {
        await message.edit({
          components: [],
          embeds: [createConfigEmbed(ghostChannels)]
        });
      }
    } catch (error) {
      console.error('Error updating message after collector end:', error);
    }
  });
}