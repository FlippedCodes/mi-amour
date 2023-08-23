module.exports.run = async (member) => {
  if (member.guild.id !== config.guildId) return;

  client.functions.get('ENGINE_checkin_oAuthParentServer').run(member);
};

module.exports.data = {
  name: 'messageReactionAdd',
};
