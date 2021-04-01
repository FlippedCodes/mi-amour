const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, config) => {
  // non command function: disboard boost
  // client.functions.get('FUNC_disboardBoost').run(client, message, config);

  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // checking if staffmember
  // TODO: foreach, with more roles
  if (message.member.roles.cache.find((role) => role.id === config.teamRole)) config.env.set('isTeam', true);

  // non command function: checkin complete questioning Reaction adding
  client.functions.get('FUNC_checkinPostReaction').run(client, message, config);

  if (message.guild.id === '300051375914483715') {
    const msg = message.content.toLowerCase();
    if (msg.startsWith('im')) client.functions.get('FUNC_april').run(message, 'im');
    if (msg.startsWith('i`m')) client.functions.get('FUNC_april').run(message, 'i`m');
    if (msg.startsWith('i\'m')) client.functions.get('FUNC_april').run(message, 'i\'m');
  }

  // put comamnd in array
  const messageArray = message.content.split(/\s+/g);
  const command = messageArray[0];
  const args = messageArray.slice(1);

  // return if not prefix
  if (!command.startsWith(config.prefix)) return;

  // remove prefix and lowercase
  const cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  // run cmd if existent
  if (cmd) {
    cmd.run(client, message, args, config, MessageEmbed)
      .catch(console.log);
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
