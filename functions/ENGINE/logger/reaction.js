const { EmbedBuilder } = require('discord.js');

module.exports.run = async (action, reaction, user) => {
  // FIXME: HOTFIX: remove reaction no longer working
  if (action !== 'added') return;
  const embed = new EmbedBuilder()
    .setColor(action === 'added' ? 'Green' : 'Red')
    .setAuthor({ name: `Reaction got ${action}` })
    .setTitle('Message Link')
    .setURL(reaction.message.url)
    .setDescription(`UserID: ${user} (${user.id})
    Reaction: ${reaction.emoji.name}
    Channel: <#${reaction.message.channel.id}> (${reaction.message.channel.id})`)
    .setTimestamp();
  client.channels.cache.get(config.reactionLoggingChannel).send({ embeds: [embed] });
};

module.exports.help = {
  name: 'FUNC_reactionLogging',
};
