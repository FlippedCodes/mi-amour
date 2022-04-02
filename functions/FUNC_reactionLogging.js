const { MessageEmbed } = require('discord.js');

module.exports.run = async (action, client, reaction, user, config) => {
  const embed = new MessageEmbed()
    .setColor(action === 'added' ? 'GREEN' : 'RED')
    .setAuthor(`Reaction got ${action}`)
    .setTitle('Message Link')
    .setURL(reaction.message.url)
    .setDescription(`UserID: ${user} (${user.id})
    Reaction ${reaction.emoji.name}
    Channel: <#${reaction.message.channel.id}> (${reaction.message.channel.id})`)
    .setTimestamp();
  client.channels.cache.get(config.reactionLoggingChannel).send(embed);
};

module.exports.help = {
  name: 'FUNC_reactionLogging',
};
