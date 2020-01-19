const { RichEmbed } = require('discord.js');

const rp = require('request-promise');

const fs = require('fs');

const uri = 'https://discordapp.com/api/users/';

let tokenAPI;

if (fs.existsSync('./config/config.json')) {
  const api = require('../config/config.json');
  tokenAPI = api.APItoken;
} else {
  tokenAPI = process.env.APItoken;
}

// TODO: make function out of command (more accessable from other commands)

module.exports.run = async (client, message, args, config) => {
  // if (!config.env.get('isTeam')) return message.react('❌');

  let [id] = args;

  if (!id) return message.channel.send(lang.chat_command_lookup_error_missingID());

  let embed = new RichEmbed()
    .setColor(message.member.displayColor)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();

  let request = {
    method: 'GET',
    uri: `${uri}${id}`,
    headers: {
      Authorization: `Bot ${tokenAPI}`,
    },
    json: true,
  };
  rp(request)
    .then((user) => {
      let creationDate = (user.id / 4194304) + 1420070400000;
      embed
        .addField(lang.chat_command_lookup_embed_field_userTag(), `\`${user.username}#${user.discriminator}\``)
        .addField(lang.chat_command_lookup_embed_field_userID(), `\`${user.id}\``)
        .addField(lang.chat_command_lookup_embed_field_userCreationDate(), new Date(creationDate), true)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`);
      message.channel.send({ embed });
    })
    .catch((err) => {
      if (err.statusCode === 404) embed.setAuthor(lang.chat_command_lookup_error_noUserException());
      else embed.setAuthor(lang.chat_command_lookup_error_unkownException_message());
      embed.addField(lang.chat_command_lookup_error_unkownException_stopCode(), err.message);
      message.channel.send({ embed });
    });
  // joined servers with dates on reaction press, if to many (use .length)
  // banned servers with dates on reaction press, if to many (use .length)
  // userinfo through discord api
};

module.exports.help = {
  name: 'lookup',
  desc: lang.chat_command_lookup_desc(),
};
