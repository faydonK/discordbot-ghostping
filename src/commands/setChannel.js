import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const setChannelCommand = new SlashCommandBuilder()
  .setName('setchannel')
  .setDescription('Configure ghost ping channels')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function executeSetChannel(interaction, ghostChannels) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ 
      content: '❌ You need Administrator permissions to use this command!',
      ephemeral: true 
    });
    return;
  }

  const colors = ['#FF69B4', '#FF4500', '#1E90FF', '#32CD32', '#FFD700'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const embed = new EmbedBuilder()
    .setColor(randomColor)
    .setTitle('👻 Ghost Ping Channel Configuration')
    .setDescription('Configure channels where new members will be ghost pinged automatically.')
    .addFields(
      { 
        name: 'Current Channel', 
        value: `<#${interaction.channelId}>` 
      },
      {
        name: 'Status',
        value: ghostChannels.has(interaction.channelId) ? '✅ Enabled' : '❌ Disabled'
      }
    )
    .setFooter({ text: 'Use the buttons below to enable or disable ghost pings in this channel' });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('add_channel')
        .setLabel('Enable')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('remove_channel')
        .setLabel('Disable')
        .setStyle(ButtonStyle.Danger)
    );

  await interaction.reply({ 
    embeds: [embed],
    components: [row],
    ephemeral: true 
  });
}