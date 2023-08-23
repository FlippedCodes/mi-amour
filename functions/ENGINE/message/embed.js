const { EmbedBuilder } = require('discord.js');

module.exports.run = async (channel, body, title, color, footer, fetchReply = false) => {
  // needs to be local as settings overlap from different embed-requests
  const embed = new EmbedBuilder();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter(footer);

  return channel.send({ embeds: [embed], fetchReply });
};

module.exports.data = {
  name: 'embed',
};
