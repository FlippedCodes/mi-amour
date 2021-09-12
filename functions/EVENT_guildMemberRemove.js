module.exports.run = async (client, member, config) => {
  // check if user had roles | 1 beacuse @everyone is also a counted role
  if (member.roles.cache.size !== 1) return;
  // get checkin channel
  const checkinChannel = await member.guild.channels.cache.find((channel) => channel.name === member.id);
  // delete checkin channel if existent
  if (checkinChannel) {
    await client.functions.get('FUNC_transcriptChannel').run(checkinChannel, config);
    checkinChannel.delete();
  }
};

module.exports.help = {
  name: 'EVENT_guildMemberRemove',
};
