const fs = require('fs');

const version = require('../package.json');

// check userperms
async function checkPermissions(message) {
  const permissions = await message.client.functions.get('FUNC_checkPermissions').run(message.member, message, 'MANAGE_CHANNELS');
  return permissions;
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_EmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, con, config) => {
  if (!await checkPermissions(message)) return messageFail(client, message, 'Hold on! You dont have permissions to use this command!');

  fs.readFile('./changelog.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      messageFail(client, message, 'Something went wrong opening the changelog file! Please report this.');
      message.react('❌');
      return;
    }
    message.channel.send(`My current maw-version is \`${version.version}\``);
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'changelog',
  title: 'Changelog',
};
