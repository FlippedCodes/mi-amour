const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function checkUserAge(client, nsfw, ID) {
  if (nsfw) {
    const user = await client.functions.get('FUNC_checkUserAge').run(ID);
    return user.allow;
  }
  return true;
}

// check if role is unique and if other role needs to be removed
function checkUniqueRole(config) {

  return;
}

module.exports.run = async (client, reaction, user, config) => {
  const roleRequestConf = config.setup.roleRequest;
  if (reaction.message.channel.id !== roleRequestConf.channelID) return;
  // check name with the reaction name
  const requestedRole = roleRequestConf.roles.find((emojiEntry) => emojiEntry.emoji === reaction.emoji.name);
  if (requestedRole) {
    // check user age
    const allowed = await checkUserAge(client, requestedRole.mature, user.id);
    switch (allowed) {
      case true:
        console.log('pass');
        break;
      case false:
        messageFail(reaction.message, `\`${requestedRole.name}\` is a 18+ role. You are not old enough, that I can give you this role!`);
        break;
      case null:
        console.log('NULL');
        break;
      default:
        break;
    }
  }
  reaction.users.remove(user);
};

module.exports.help = {
  name: 'FUNC_userRoleRequest',
};
