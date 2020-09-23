const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  // prepare title and user CMDs
  let embed = new MessageEmbed()
    // .setTitle(lang.chat_command_help_embed_title())
    // .setDescription(lang.chat_command_help_embed_desc())
    .setAuthor('How to uwse me:');
  if (message.channel.type !== 'dm') embed.setColor(message.member.displayColor);
  // creating embed fields for every command
  client.commands.forEach((CMD) => {
    if (!CMD.help.title) return;
    embed.addField(CMD.help.title,
      `\`${config.prefix}${CMD.help.name} ${CMD.help.usage || ''}\`
      ${CMD.help.desc}`, false);
  });

  // set help command
  // embed
  //   .addField(
  //     lang.chat_command_help_embed_field_title({ prefix: config.prefix }),
  //     lang.chat_command_help_embed_field_desc(), true,
  //   );
  message.channel.send({ embed });
  return;
};

module.exports.help = {
  name: 'help',
  title: 'HALP',
  desc: lang.chat_command_help_desc(),
};
