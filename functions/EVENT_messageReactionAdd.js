module.exports.run = async (client, reaction, user, config) => {
  if (user.bot) return;

  // rolerequest
  // if (reaction.message.channel.id === config.setup.roleRequest.channel) {
  //   client.functions.get('FUNC_userRoleRequest').run(client, reaction, user, config);
  // }
};

module.exports.help = {
  name: 'EVENT_messageReactionAdd',
};
