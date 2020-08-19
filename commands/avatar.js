const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  let [userID] = args;
  if (!userID) userID = message.author.id;

  const embed = new RichEmbed().setColor(message.member.displayColor);
  const discordUser = await client.fetchUser(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      message.channel.send({ embed });
    });

  if (discordUser.tag) {
    embed.setAuthor(discordUser.tag, null, discordUser.avatarURL);
    if (discordUser.avatarURL) embed.setImage(discordUser.avatarURL);
    else embed.setDescription('No profile picture set!');
    message.channel.send({ embed });
  }
};

module.exports.help = {
  name: 'avatar',
  usage: 'USERID',
  desc: 'Retrieves the profile picture of the provided user ID.',
};
