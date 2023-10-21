module.exports.run = async (memberLeftServer) => {
  // return if member has left the non-mail guild
  if (memberLeftServer.guild.id === config.guildId) return;

  client.functions.get('ENGINE_checkout_stripCheckinRole').run(memberLeftServer);
};

module.exports.data = {
  name: 'guildMemberRemove',
};
