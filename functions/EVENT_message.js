module.exports.run = async (client, message, config) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // checking if staffmember
  // TODO: foreach, with more roles
  if (message.member.roles.find((role) => role.id === config.teamRole)) config.env.set('isTeam', true);

  // put comamnd in array
  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  // return if not prefix
  if (!command.startsWith(config.prefix)) return;

  // check if server is on ParticipatingServers Table
  let serverID = null;
  if (message.channel.guild) serverID = message.channel.guild.id;

  // remove prefix and lowercase
  let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  // run cmd if existent
  if (cmd) {
    cmd.run(client, message, args, config)
      .catch(console.log);
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
