// creates a embed messagetemplate for succeded actions
function messageSuccess(client, channel, body) {
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
async function messageFail(client, channel, body) {
  const result = client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, channel, body, '', 16449540, false);
  return result;
}

module.exports.run = async (client, reaction, user, config) => {
  if (user.bot) return;
  if (reaction.message.channel.parentID !== config.checkin.categoryID) return;
  const member = await reaction.message.guild.members.fetch(user);
  if (!member.roles.cache.get(config.teamRole)) {
    reaction.users.remove(user);
    messageFail(client, reaction.message.channel, 'The reactions are not meant for you.\nPlease wait for a Teammember to check you in.')
      .then((msg) => msg.delete({ timeout: 10000 }));
    return;
  }
  switch (reaction.emoji.name) {
    case '👌':
      // add role
      reaction.message.member.roles.add(config.checkin.checkinRole);
      // post welcome message
      const welcomeChannel = member.guild.channels.cache.get(config.checkin.welcomeChannel);
      welcomeChannel.send(`${reaction.message.author}, you are checked-in now!\nHave a great time on the server! :3`);
      // delete channel
      reaction.message.channel.delete();
      return;

    case '✋':
      // dm user
      messageFail(client, reaction.message.author, 'It seems like your check-in got declined. Please get in touch with the team.');
      // delete channel
      reaction.message.channel.delete();
      return;

    default:
      return;
  }
};

module.exports.help = {
  name: 'FUNC_checkinCompletedReaction',
};
