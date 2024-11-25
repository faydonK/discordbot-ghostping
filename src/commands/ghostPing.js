import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const ghostPingCommand = new SlashCommandBuilder()
  .setName('ghostping')
  .setDescription('Ghost ping a user')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addUserOption(option =>
    option
      .setName('target')
      .setDescription('The user to ghost ping')
      .setRequired(true)
  );

export async function executeGhostPing(interaction, ghostChannels) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ 
      content: '❌ You need Administrator permissions to use this command!',
      ephemeral: true 
    });
    return;
  }

  if (ghostChannels.size === 0) {
    await interaction.reply({ 
      content: 'Please configure ghost ping channels first using `/setchannel`',
      ephemeral: true 
    });
    return;
  }

  const target = interaction.options.getUser('target');
  
  await interaction.deferReply({ ephemeral: true });
  
  let successCount = 0;
  let failCount = 0;

  for (const channelId of ghostChannels) {
    const channel = interaction.client.channels.cache.get(channelId);
    if (channel) {
      try {
        const ghostMessage = await channel.send(`<@${target.id}>`);
        await ghostMessage.delete();
        successCount++;
      } catch (error) {
        console.error(`Failed to ghost ping in channel ${channelId}:`, error);
        failCount++;
      }
    }
  }

  const status = [];
  if (successCount > 0) status.push(`✅ Sent ${successCount} ghost ping(s)`);
  if (failCount > 0) status.push(`❌ Failed to send ${failCount} ghost ping(s)`);

  await interaction.editReply({ 
    content: status.join('\n'),
    ephemeral: true 
  });
}