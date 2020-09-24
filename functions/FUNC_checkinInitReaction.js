const errHander = (err) => { console.error('ERROR:', err); };

const welcomeMessage = (userID) => `
Hey there <@!${userID}>! Welcome to TDM.
Before we let you in im going to ask you some questions, before a staff member is going to let you in.

:one: - how did you find our server?
:two: - are you on any other vore servers?
:three: - do you like vore and what is your favorite?
:four: - how old are you?

When you are done please ping/mention \`@Team\`, so we know that you are done and ready to be reviewd.
`;

// async function getWelcomeMessage(config, user) {
//   const fs = require('fs');
//   const message = `
//   Hey there! Welcome to TDM
//   `;
//   // let message;
//   // await new Promise((resolve) => {
//   //   fs.readFile('./config/about.txt', 'utf8', (err, data) => {
//   //     if (err) {
//   //       errHander(err);
//   //       message = `I'm sowwy, but something went wrong setting up your welcome message, <@${user.id}>. A team member is going to assist you with this.

//   //       ~~<@&${config.teamRole}>, pls fix~~`;
//   //       return;
//   //     }
//   //     message = data;
//   //   });
//   // });
//   return message;
// }

// calculate user creation
function calcUserAge(user) {
  const currentDate = new Date();
  const creationDate = new Date(user.createdAt);
  const msDiff = Math.abs(currentDate - creationDate);
  return Math.ceil(msDiff / (1000 * 60 * 60 * 24));
}

function createChannel(guild, user, config, topic) {
  guild.channels.create(user.id, { type: 'text' })
    .then((channel) => channel.setParent(config.checkin.categoryID))
    .then((channel) => channel.lockPermissions())
    .then((channel) => channel.createOverwrite(user, { VIEW_CHANNEL: true }))
    .then((channel) => channel.setTopic(topic))
    .then(async (channel) => channel.send(welcomeMessage(user.id)))
    .catch(errHander);
}

module.exports.run = async (client, reaction, config) => {
  // check emoji and channel
  const configReaction = config.checkin.reaction;
  if (reaction.channel_id !== configReaction.channel) return;
  if (reaction.message_id !== configReaction.message) return;
  if (reaction.emoji.name !== configReaction.emoji) return;
  // get guild and user
  const guild = await client.guilds.cache.find((guild) => guild.id === reaction.guild_id);
  const user = await client.users.fetch(reaction.member.user.id, false);
  // check if user already has checkin channel
  const checkinChannel = await guild.channels.cache.find((channel) => channel.name === user.id);
  if (!checkinChannel) {
    const dayDiff = calcUserAge(user);
    // TODO: add DB table to check if user was in guild before
    // Create channel, set settings and edit channel topic
    const topic = `
    Username: ${user.tag}
    Avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}
    Days since creation: ${dayDiff};
    Creation date: ${user.createdAt}`;
    createChannel(guild, user, config, topic);
  }
  // remvove user reaction
  const reactionChannel = await guild.channels.cache.get(config.checkin.reaction.channel);
  const reactionMessage = await reactionChannel.messages.fetch(config.checkin.reaction.message);
  const initalReaction = await reactionMessage.reactions.cache.get(config.checkin.reaction.emoji);
  initalReaction.users.remove(user);
};

module.exports.help = {
  name: 'FUNC_checkinInitReaction',
};
