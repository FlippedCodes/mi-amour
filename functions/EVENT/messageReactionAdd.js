module.exports.run = async (reaction, user) => {
  if (user.bot) return;

  // reaction logging
  client.functions.get('ENGINE_logger_reaction').run('added', reaction, user);

  // rolerequest
  if (reaction.message.channel.id === config.setup.roleRequest.channelID) return client.functions.get('ENGINE_roleRequest_manager').run(reaction, user);
};

module.exports.data = {
  name: 'messageReactionAdd',
};
