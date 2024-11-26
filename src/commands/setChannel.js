import { 
  SlashCommandBuilder, 
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType
} from 'discord.js';

export const setChannelCommand = new SlashCommandBuilder()
  .setName('setchannel')
  .setDescription('👻・Configure welcome ghost ping channels')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function executeSetChannel(interaction, ghostChannels) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ 
      content: '❌ You need Administrator permissions to use this command!',
      ephemeral: true 
    });
    return;
  }

  const guild = interaction.guild;
  const textChannels = guild.channels.cache
    .filter(channel => channel.isTextBased())
    .map(channel => ({
      label: channel.name,
      value: channel.id,
      default: ghostChannels.has(channel.id)
    }));

    const colors = ['#FF69B4', '#FF4500', '#1E90FF', '#32CD32', '#FFD700'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
    const embed = new EmbedBuilder()
      .setColor(randomColor)
    .setTitle('👻 Ghost Ping Channel Configuration')
    .setDescription('Select the channels where new members will be ghost pinged automatically.')
    .addFields(
      { 
        name: 'Currently Configured Channels', 
        value: ghostChannels.size > 0 
          ? Array.from(ghostChannels).map(id => `<#${id}>`).join('\n')
          : 'No channels configured'
      }
    );

  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ghost_channels')
        .setPlaceholder('Select channels for ghost pings')
        .setMinValues(0)
        .setMaxValues(textChannels.length)
        .addOptions(textChannels)
    );

  const response = await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true
  });

  try {
    const collector = response.createMessageComponentCollector({ 
      componentType: ComponentType.StringSelect,
      time: 60000 
    });

    collector.on('collect', async i => {
      if (i.user.id === interaction.user.id) {
        ghostChannels.clear();
        i.values.forEach(channelId => ghostChannels.add(channelId));
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const embed = new EmbedBuilder()
          .setColor(`#${randomColor}`)
          .setTitle('👻 Ghost Ping Channel Configuration')
          .setDescription('Configuration updated successfully!')
          .addFields(
            {
              name: 'Selected Channels',
              value: i.values.length > 0 
                ? i.values.map(id => `<#${id}>`).join('\n')
                : 'No channels selected'
            }
          );

        await i.update({ 
          embeds: [updatedEmbed],
          components: [] 
        });
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        await interaction.editReply({
          content: 'Channel selection timed out.',
          components: []
        });
      }
    });
  } catch (error) {
    console.error('Error in channel selection:', error);
    await interaction.editReply({
      content: 'An error occurred while configuring channels.',
      components: []
    });
  }
}