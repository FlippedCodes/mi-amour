const { RichEmbed } = require('discord.js');

// TODO: rewrite

module.exports.run = async (client, message, args, con, config) => {
  let server = message.guild;
  let pic = 'https://pbs.twimg.com/profile_images/715852271389655041/s-VdeDI5_400x400.jpg';
  if (server.iconURL) pic = server.iconURL;

  let embed = new RichEmbed()
    .setTimestamp()
    .setAuthor(server.name)
    .setColor(message.member.displayColor)
    .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
    .setImage(pic)
    .addField(
      'Server created on',
      `${server.createdAt.toLocaleDateString()} ${server.createdAt.toLocaleTimeString()}`, true,
    )
    .addField('Acronym', server.nameAcronym, true)
    .addField('Name', server.name, true)
    .addField('Owner', server.owner.user.tag, true)
    .addField('ID', server.id, true)
    .addField('Channels', server.channels.size, true)
    .addField('Emojis', server.emojis.size, true)
    .addField('Membercount', server.memberCount, true)
    .addField('Verification level', server.verificationLevel, true)
    .addField('Content filter', server.explicitContentFilter, true)
    .addField('VC Region', server.region, true);

  message.channel.send({ embed });
};

module.exports.help = {
  name: 'serverinfo',
  desc: 'Displays serverinfo from the provided server ID',
};
