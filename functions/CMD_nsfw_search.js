const moment = require('moment');

const userDoB = require('../database/models/UserDoB');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID } }).catch(errHander);
  return result;
}

// validate provided info
async function validate(client, message, prefix, subcmd, userID) {
  if (!userID) {
    messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID\`\`\``);
    return false;
  }
  if (isNaN(userID)) {
    messageFail(message,
      `**Your provided ID is not a number!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID\`\`\``);
    return false;
  }
  const checkedUID = await client.functions.get('FUNC_checkID').run(userID, client, 'user');
  if (!checkedUID) {
    messageFail(message,
      `**Your provided ID is not from a user!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID\`\`\``);
    return false;
  }
  return true;
}

function sendMessage(MessageEmbed, channel, userTag, userID, age, DoB, allow, teammemberTag, updated, created) {
  let color = 16741376;
  if (allow) color = 4296754;

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(`${userTag}`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Age', value: age, inline: true },
      { name: 'DoB', value: DoB, inline: true },
      { name: 'Allow', value: allow, inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
      { name: 'Created at', value: created, inline: false },
      { name: 'Updated at', value: updated, inline: false },
    ]);

  // send message
  channel.send(embed);
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // split args
  const [subcmd, userID] = args;

  // validate data
  if (!await validate(client, message, prefix, subcmd, userID)) return;

  // search entry
  const DBentry = await searchUser(userID);
  // report to user if entry added
  if (!DBentry) return messageFail(message, `No data found for the ID \`${userID}\`!`);
  // get DoB
  const DoB = DBentry.DoB;
  // get age
  const age = moment().diff(DoB, 'years');
  // get user tags and format dates
  const [userTag, teammemberTag] = [userID, DBentry.teammemberID].map((uID) => client.users.cache.find(({ id }) => id === uID).tag);
  const [updatedAt, createdAt] = [DBentry.updatedAt, DBentry.createdAt].map((date) => moment(date).format('ddd, MMM Do YYYY, h:mm a'));
  const formatDoB = moment(DoB).format('YYYY-MM-DD');
  // send it
  sendMessage(MessageEmbed, message.channel, userTag, userID, age, formatDoB, DBentry.allow, teammemberTag, updatedAt, createdAt);
};

module.exports.help = {
  name: 'CMD_nsfw_search',
  parent: 'nsfw',
};
