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

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function changeUser(ID, allow) {
  if (await !userDoB.findOne({ where: { ID } }).catch(errHander)) return false;
  await userDoB.update({ allow }, { where: { ID } }).catch(errHander);
  return true;
}

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID } }).catch(errHander);
  return result;
}

// validate provided info
async function validate(client, message, prefix, subcmd, userID, allow) {
  if (!userID) {
    messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID ALLOW\`\`\``);
    return false;
  }
  if (isNaN(userID)) {
    messageFail(message,
      `**Your provided ID is not a number!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID ALLOW\`\`\``);
    return false;
  }
  const checkedUID = await client.functions.get('FUNC_checkID').run(userID, client, 'user');
  if (!checkedUID) {
    messageFail(message,
      `**Your provided ID is not from a user!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID ALLOW\`\`\``);
    return false;
  }
  if (!allow || !allow === 'true' || !allow === 'false') {
    messageFail(message,
      `**Your provided ALLOW is not true or false!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${userID} ALLOW\`\`\``);
    return false;
  }
  return true;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // split args
  const [subcmd, userID, allowInput] = args;
  const newAllow = allowInput.toLowerCase();

  // validate data
  if (!await validate(client, message, prefix, subcmd, userID, newAllow)) return;
  // add entry
  const changed = await changeUser(userID, newAllow);
  // report to user if entry added
  if (changed) {
    // remove NSFW roles
    if (newAllow === 'false') client.functions.get('FUNC_userRemoveNsfwRoles').run(userID, message.guild, config.setup.roleRequest.roles);
    // search entry
    const DBentry = await searchUser(userID);
    // report to user if entry added
    if (!DBentry) return messageFail(message, `No data found for the ID \`${userID}\`!`);
    // get DoB
    const DoB = DBentry.DoB;
    // get age
    const age = moment().diff(DoB, 'years');
    const formatDoB = moment(DoB).format('YYYY-MM-DD');
    // get user tags
    const [userTag, teammemberTag] = [userID, DBentry.teammemberID].map((uID) => client.users.cache.find(({ id }) => id === uID).tag);
    // send log and user confirmation
    sendMessage(MessageEmbed, message.channel, userTag, userID, age, formatDoB, DBentry.allow, teammemberTag, config);
  } else {
    messageFail(message, `\`${userID}\` doesn't exist in the DB.`);
  }
};

module.exports.help = {
  name: 'CMD_nsfw_allow',
  parent: 'nsfw',
};
