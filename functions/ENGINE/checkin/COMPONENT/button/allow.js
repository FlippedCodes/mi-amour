module.exports.run = async (interaction) => {
  await interaction.deferUpdate();

  const checkinChannel = interaction.channel;

  const userID = checkinChannel.name;
  const member = await interaction.guild.members.fetch(userID);
  member.roles.add(config.checkin.checkinRole)

  // post welcome message
  const welcomeChannel = member.guild.channels.cache.get(config.checkin.welcomeChannel);
  welcomeChannel.send(`${member}, you are checked-in now!\nYou can check out some roles in <#${config.checkin.reaction.channel}>!\nHave a great time on the server! :3`);
  await client.functions.get('ENGINE_checkin_transcriptChannel').run(checkinChannel);
  // delete channel
  await checkinChannel.delete();
};

module.exports.data = {
  name: 'allow',
};
