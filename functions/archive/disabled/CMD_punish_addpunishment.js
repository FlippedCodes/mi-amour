const userDoB = require('../database/models/UserDoB');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_EmbedBuilderMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_EmbedBuilderMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function addTag(tag, serverID, managementServerID) {
  if (await userDoB.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(errHander)) return false;
  await userDoB.findOrCreate({ where: { serverID, tag } }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config, EmbedBuilder, prefix) => {
  // check if user is teammember
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(message, 'You don\'t have access to this command! òwó');
  const [subcmd, tag] = args;
  if (!tag) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} TAGNAME\`\`\``);
  }
  if (tag.length > 30) {
    return messageFail(message, 'Your tawg is too long. The maximum length is 30 characters.');
  }
  const added = await addTag(tag, message.guild.id, config.managementServerID);
  if (added) {
    messageSuccess(message, `\`${tag}\` has been added to the serwers blacklist.`);
  } else {
    messageFail(message, `\`${tag}\` is already added to thwis serwers backlist.`);
  }
};

module.exports.help = {
  name: 'CMD_punish_add',
  parent: 'punish',
};
