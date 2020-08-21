const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (client, reaction, config) => {
  // check channel
  if (reaction.channel_id !== config.checkin.reaction.channel) return;
  if (reaction.message_id !== config.checkin.reaction.message) return;
  if (reaction.emoji.name !== config.checkin.reaction.emoji) return;
  // console.log(reaction);
  const username = `${reaction.member.user.username}-${reaction.member.user.discriminator}`;
  const guild = await client.guilds.cache.find((guild) => guild.id === reaction.guild_id);
  const user = await client.users.cache.find((user) => user.id === reaction.member.user.id);
  // const channel = await guild.createChannel(username, 'text')
  await guild.channels.create(username, { type: 'text' })
    .then((channel) => channel.setParent(config.checkin.categoryID))
    .then((channel) => channel.lockPermissions())
    .then((channel) => channel.createOverwrite(user, { VIEW_CHANNEL: true }))
    .then((channel) => channel.send('fuck you'))
    .catch(errHander);
};

module.exports.help = {
  name: 'FUNC_checkinReaction',
};
