module.exports.run = async (reaction, user) => {
  if (user.bot) return;

  // reaction logging
  client.functions.get('ENGINE_logger_reaction').run('removed', reaction, user);
};

module.exports.data = {
  name: 'messageReactionRemove',
};
