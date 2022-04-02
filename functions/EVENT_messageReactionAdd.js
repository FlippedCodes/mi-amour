module.exports.run = async (client, reaction, user, config) => {
  if (user.bot) return;

  // rolerequest
  client.functions.get('FUNC_userRoleRequest').run(client, reaction, user, config);
  // checkin
  client.functions.get('FUNC_checkinCompletedReaction').run(client, reaction, user, config);
  // reaction logging
  client.functions.get('FUNC_reactionLogging').run('added', client, reaction, user, config);
};

module.exports.help = {
  name: 'EVENT_messageReactionAdd',
};
