const moment = require('moment');

const userDoB = require('../database/models/UserDoB');

const errHander = (err) => { console.error('ERROR:', err); };

function sendMessage(MessageEmbed, channel, userTag, userID, age, DoB, allow, teammemberTag, config) {
  // needs to be local as settings overlap from different embed-requests
  const embed = new MessageEmbed();

  let color = 16741376;
  if (allow) color = 4296754;

  embed
    .setColor(color)
    .setDescription(`${userTag} got added to the DB!`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Age', value: age, inline: true },
      { name: 'DoB', value: DoB, inline: true },
      { name: 'Allow', value: allow, inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
    ]);

  // send feedback
  channel.send(embed);
  // send in log
  channel.guild.channels.cache.find(({ id }) => id === config.DoBchecking.logChannelID).send(embed);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function addUser(ID, DoB, allow, teammemberID) {
  if (await userDoB.findOne({ where: { ID } }).catch(errHander)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { DoB, allow, teammemberID } }).catch(errHander);
  return true;
}

function checkAllowed(DoB) {
  const age = moment().diff(DoB, 'years');
  return [age >= 18, age];
}

// validate provided info
async function validate(client, message, prefix, subcmd, userID, date) {
  if (!userID) {
    messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID DoB\`\`\``);
    return false;
  }
  if (isNaN(userID)) {
    messageFail(message,
      `**Your provided ID is not a number!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID DoB\`\`\``);
    return false;
  }
  const checkedUID = await client.functions.get('FUNC_checkID').run(userID, client, 'user');
  if (!checkedUID) {
    messageFail(message,
      `**Your provided ID is not from a user!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID DoB\`\`\``);
    return false;
  }
  if (!date.isValid()) {
    messageFail(message,
      `**Your provided DoB is not a date!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${userID} DoB\`\`\``);
    return false;
  }
  return true;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // split args
  const [subcmd, userID, newDoB] = args;
  // get date
  const date = moment(newDoB, config.DoBchecking.dateFormats, false);

  // validate data
  if (!await validate(client, message, prefix, subcmd, userID, date)) return;

  // get allow
  const [allow, age] = checkAllowed(date);
  // format date
  const formatDate = date.format('YYYY-MM-DD');
  // add entry
  const added = await addUser(userID, formatDate, allow, message.author.id);
  // report to user if entry added
  if (added) {
    // remove NSFW roles
    if (!allow) client.functions.get('FUNC_userRemoveNsfwRoles').run(userID, message.guild, config.setup.roleRequest.roles);
    const userTag = await client.users.cache.find(({ id }) => id === userID).tag;
    // send log and user confirmation
    sendMessage(MessageEmbed, message.channel, userTag, userID, age, formatDate, allow, message.author.tag, config);
  } else {
    messageFail(message, `\`${userID}\` is already added.`);
  }
};

module.exports.help = {
  name: 'CMD_nsfw_add',
  parent: 'nsfw',
};
