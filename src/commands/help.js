import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export const helpCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Shows information about the ghost ping bot');

export async function executeHelp(interaction) {
  const colors = ['#FF69B4', '#FF4500', '#1E90FF', '#32CD32', '#FFD700'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const embed = new EmbedBuilder()
    .setColor(randomColor)
    .setTitle('👻 Ghost Ping Bot Help')
    .setDescription('This bot automatically ghost pings new members in configured channels.')
    .addFields(
      {
        name: '🛠️ Commands',
        value: [
          '`/setchannel` - Configure channels for ghost pings (Admin only)',
          '`/ping` - Check bot\'s latency',
          '`/help` - Shows this help message'
        ].join('\n')
      },
      {
        name: '❓ How it works',
        value: 'When a new member joins the server, they will be automatically ghost pinged in all configured channels.'
      },
    )
    .setFooter({ text: 'Ghost Ping Bot by faydonK - V1.1.0' });

  const button = new ButtonBuilder()
    .setLabel('📎 Ghost Ping Bot')
    .setStyle(ButtonStyle.Link)
    .setURL('https://github.com/faydonK/discordbot-ghostping');

  const row = new ActionRowBuilder()
    .addComponents(button);

  await interaction.reply({ 
    embeds: [embed],
    components: [row] // Corrected the property name to lowercase 'components'
  });
}