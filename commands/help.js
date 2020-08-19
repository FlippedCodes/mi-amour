const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  // prepare title and user CMDs
  let embed = new MessageEmbed()
    .setTitle(lang.chat_command_help_embed_title())
    .setColor(message.member.displayColor)
    .setDescription(lang.chat_command_help_embed_desc())
    .addField(
      lang.chat_command_help_embed_field_title({ prefix: config.prefix }),
      lang.chat_command_help_embed_field_desc(), true,
    );

  // set footer
  embed
    .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
  return;
};

module.exports.help = {
  name: 'help',
  desc: lang.chat_command_help_desc(),
};
