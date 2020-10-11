const { MessageEmbed } = require('discord.js');

module.exports.run = async (channel, userTag, userID, age, DoB, allow, teammemberTag, log, config) => {
  // needs to be local as settings overlap from different embed-requests
  const embed = new MessageEmbed();

  let color = 16741376;
  if (allow) color = 4296754;

  embed
    .setColor(color)
    .setDescription(`${userTag} got added to the DB!`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Age', value: age, inline: true },
      { name: 'DoB', value: DoB, inline: true },
      { name: 'Allow', value: allow, inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
    ]);

  // send feedback
  channel.send(embed);
  // send in log
  if (log) channel.guild.channels.cache.find(({ id }) => id === config.DoBchecking.logChannelID).send(embed);
};

module.exports.help = {
  name: 'FUNC_richEmbedMessage_nsfw',
};
