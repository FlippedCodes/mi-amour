const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (client, reaction, config) => {
  // check channel
  if (reaction.channel_id !== config.checkin.reaction.channel) return;
  if (reaction.message_id !== config.checkin.reaction.message) return;
  if (reaction.emoji.name !== config.checkin.reaction.emoji) return;
  console.log(reaction);
  const channel = await message.guild.createChannel(args.join('_').slice(subcmd.length + 1), 'text')
    .then((channel) => channel.setParent(config.parentRP))
    .then((channel) => channel.lockPermissions())
    .then((channel) => channel.overwritePermissions(message.author, { SEND_MESSAGES: true }))
    .catch(console.log);
};

module.exports.help = {
  name: 'FUNC_checkinReaction',
};
