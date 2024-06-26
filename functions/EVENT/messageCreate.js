module.exports.run = async (message) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (message.guild.id !== config.guildId) return;

  if (message.channel.parentId === config.openChannelCategory) return message.delete();

  if (config.contentWarning.checkChannels.includes(message.channel.id)) return client.functions.get('ENGINE_contentWarning_check').run(message);

  if (config.linkReplace.checkChannels.includes(message.channel.id)) return client.functions.get('ENGINE_linkReplace_check').run(message);
};

module.exports.data = {
  name: 'messageCreate',
};
