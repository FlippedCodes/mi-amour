module.exports.run = async (messageReaction, user) => {
  if (messageReaction.message.guild.id !== config.guildId) return;

  messageReaction.users.remove(user);

  client.functions.get('ENGINE_checkin_oAuthParentServer').run(await messageReaction.message.guild.members.fetch(user.id));
};

module.exports.data = {
  name: 'messageReactionAdd',
};
