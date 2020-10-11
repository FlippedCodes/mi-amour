// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

module.exports.run = async (client, message, args, config, MessageEmbed) => {
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You don\'t have access to this command! òwó');
  const [subcmd] = args;
  const commandValues = ['add', 'allow', 'change', 'search', 'calc'];
  const currentCMD = module.exports.help;
  if (commandValues.includes(subcmd)) {
    client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
      .run(client, message, args, config, MessageEmbed, config.prefix);
  } else {
    messageFail(client, message, CommandUsage(config.prefix, currentCMD.name, commandValues.join('|')));
  }
};

module.exports.help = {
  name: 'nsfw',
  title: 'NSFW Management',
  desc: 'Autopost e621 pictures in a channel.',
};
