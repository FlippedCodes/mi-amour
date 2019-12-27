const { RichEmbed } = require('discord.js');

// TODO: use API if user doesnt share server

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, null, 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  let target;
  if (args[0]) {
    if (message.mentions.members.first() || message.guild.members.get(args[0])) {
      target = message.mentions.members.first() || message.guild.members.get(args[0]);
    } else { return messageFail(client, message, 'Sorry, but there is no user on this server with the information provided.'); }
  } else { target = message.member; }

  message.guild.fetchMember(target)
    .then((member) => {
      let embed = new RichEmbed()
        .setAuthor(member.user.tag)
        .setColor(member.displayColor)
        .setImage(member.user.avatarURL);
      message.channel.send({ embed });
    });
};

module.exports.help = {
  name: 'avatar',
  desc: 'Retrieves the profile picture of the provided user ID.',
};
