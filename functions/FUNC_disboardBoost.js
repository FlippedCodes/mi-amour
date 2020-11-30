module.exports.run = async (client, message, config) => {
  // check if message is from disboard in the correct channel
  if (message.author.id !== config.disboard.userID) return;
  if (message.channel.id !== config.disboard.channelID) return;
  // check if message is a successful boost
  const recievedEmbed = message.embeds[0];
  const desc = recievedEmbed.description;
  if (!desc.startsWith('<@')) return;
  if (recievedEmbed.hexColor !== config.disboard.successfulHex) return;

  const role = await message.guild.roles.fetch(config.disboard.lastBoostedRoleID);
  // remove all members from role
  role.members.forEach((member) => member.roles.remove(role));
  // assign role to new member
  const userID = desc.substring(
    desc.lastIndexOf('@') + 1,
    desc.lastIndexOf('>'),
  );
  if (!userID) return;
  const member = await message.guild.member(userID);
  member.roles.add(role);
};

module.exports.help = {
  name: 'FUNC_disboardBoost',
};
