module.exports.run = async (client, message, config) => {
  // check if message is from disboard in the correct channel
  if (message.author.id !== config.disboard.userID) return;
  if (message.channel.id !== config.disboard.channelID) return;
  // check if message is a successful boost
  console.log(message);
  // remote all members from role
  // assign role to new member
};

module.exports.help = {
  name: 'FUNC_disboardBoost',
};
