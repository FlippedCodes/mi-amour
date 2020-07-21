const { RichEmbed } = require('discord.js');

// TODO: rewrite

module.exports.run = async (client, message, args, con, config) => {
  let server = message.guild;
  let pic = 'https://pbs.twimg.com/profile_images/715852271389655041/s-VdeDI5_400x400.jpg';
  if (server.iconURL) pic = server.iconURL;

  let embed = new RichEmbed()
    .setAuthor(server.name)
    .setColor(message.member.displayColor)
    .setImage(pic)
    .addField(
      'Server created on',
      `${server.createdAt.toLocaleDateString()} ${server.createdAt.toLocaleTimeString()}`, true,
    )
    .addField(lang.chat_command_serverinfo_embed_acronym(), server.nameAcronym, true)
    .addField(lang.chat_command_serverinfo_embed_name(), server.name, true)
    .addField(lang.chat_command_serverinfo_embed_owner(), server.owner.user.tag, true)
    .addField(lang.chat_command_serverinfo_embed_ID(), server.id, true)
    .addField(lang.chat_command_serverinfo_embed_channels(), server.channels.size, true)
    .addField(lang.chat_command_serverinfo_embed_emojis(), server.emojis.size, true)
    .addField(lang.chat_command_serverinfo_embed_membercount(), server.memberCount, true)
    .addField(lang.chat_command_serverinfo_embed_verificationLevel(), server.verificationLevel, true)
    .addField(lang.chat_command_serverinfo_embed_contentFilter(), server.explicitContentFilter, true)
    .addField(lang.chat_command_serverinfo_embed_vcRegion(), server.region, true);

  message.channel.send({ embed });
};

module.exports.help = {
  name: 'serverinfo',
  desc: lang.chat_command_serverinfo_desc(),
};
