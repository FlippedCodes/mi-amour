module.exports.run = async (client, reaction, user, config) => {
  if (user.bot) return;

  // reaction logging
  client.functions.get('FUNC_reactionLogging').run('removed', client, reaction, user, config);
};

module.exports.help = {
  name: 'EVENT_messageReactionRemove',
};
