const errHander = (err) => { console.error('ERROR:', err); };

async function getWelcomeMessage(config, user) {
  const fs = require('fs');
  const message = await fs.readFile('./config/abo', 'utf8', (err, data) => {
    let output;
    if (err) {
      console.log(err);
      output = `I'm sowwy, but something went wrong setting up your welcome message, <@${user.id}>. A team member is going to assist you with this.
      
      ~~<@&${config.teamRole}>, pls fix~~`;
    } else output = data;
    return output;
  });
  return message;
}

module.exports.run = async (client, reaction, config) => {
  // check emoji and channel
  const configReaction = config.checkin.reaction;
  if (reaction.channel_id !== configReaction.channel) return;
  if (reaction.message_id !== configReaction.message) return;
  if (reaction.emoji.name !== configReaction.emoji) return;
  // TODO: check if user already has checkin channel
  const guild = await client.guilds.cache.find((guild) => guild.id === reaction.guild_id);
  const user = await client.users.fetch(reaction.member.user.id, false);
  // calculate user creation
  const currentDate = new Date();
  const creationDate = new Date(user.createdAt);
  const msDiff = Math.abs(currentDate - creationDate);
  const dayDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
  // TODO: add DB table to check if user was in guild before
  // Create channel, set settings and edit channel topic
  const topic = `
  Username: ${user.tag}
  Avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}
  Days since creation: ${dayDiff};
  Creation date: ${user.createdAt}`;
  const test = await getWelcomeMessage(config, user);
  await guild.channels.create(user.id, { type: 'text' })
    .then((channel) => channel.setParent(config.checkin.categoryID))
    .then((channel) => channel.lockPermissions())
    .then((channel) => channel.createOverwrite(user, { VIEW_CHANNEL: true }))
    .then((channel) => channel.setTopic(topic))
    .then(async (channel) => channel.send(test))
    .catch(errHander);
};

module.exports.help = {
  name: 'FUNC_checkinReaction',
};
