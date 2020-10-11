const moment = require('moment');

const userDoB = require('../database/models/UserDoB');

const errHander = (err) => { console.error('ERROR:', err); };

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

async function addUser(userID, newDoB) {
  if (await userDoB.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(errHander)) return false;
  await userDoB.findOrCreate({ where: { serverID, tag } }).catch(errHander);
  return true;
}

function checkAge(newDoB) {
  return moment().diff(newDoB, 'years');
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  // split args
  const [subcmd, userID, newDoB] = args;

  // validate provided info
  if (!userID) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID DoB\`\`\``);
  }
  if (isNaN(userID)) {
    return messageFail(message,
      `Your provided ID is not a number!
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID AGE\`\`\``);
  }
  const checkedUID = await client.functions.get('FUNC_checkID').run(userID, client, 'user');
  if (!checkedUID) {
    return messageFail(message,
      `Your provided ID is not from a user!
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} USERID DoB\`\`\``);
  }
  if (!newDoB) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${userID} DoB\`\`\``);
  }
  const date = moment(newDoB, 'YYYY-MM-DD', true);
  if (!date.isValid()) {
    return messageFail(message,
      `Your provided DoB is not a date!
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${userID} DoB\`\`\``);
  }

  // add entry
  const age = checkAge(newDoB);
  // const added = await addUser(userID, newDoB);
  messageSuccess(message, `DEBUG: 
  DoB: \`${newDoB}\`
  parsedDoB: \`${date.toDate()}\`
  Age: \`${age}\``);
  // if (added) {
  //   messageSuccess(message, `\`${userID}\` has been added.`);
  // } else {
  //   messageFail(message, `\`${userID}\` is already added.`);
  // }
};

module.exports.help = {
  name: 'CMD_nsfw_add',
  parent: 'nsfw',
};
