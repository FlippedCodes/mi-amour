const { RichEmbed } = require('discord.js');

module.exports.run = async (client, config) => {
  // for each server
  [config.setup.roleRequestChannels].forEach((roleRequest) => {
    if (!client.channels.get(roleRequest)) return;
    client.channels.get(roleRequest).bulkDelete(10);
    let embed = new RichEmbed()
      .setTitle(lang.chat_function_SETUP_roleRequest_embed_title())
      .setDescription(lang.chat_function_SETUP_roleRequest_embed_desc({ channelID: config.info_channelID }))
      .addField('Prey', '🦌', true)
      .addField('Prey/Pred', '🔄', true)
      .addField('Pred', '🐉', true)
      .addField('NSFW Access', '🔞', true)
      .addField('NSFL Access', '💩', true)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    client.channels.get(roleRequest).send({ embed })
      .then(async (message) => {
        await message.react('🦌');
        await message.react('🔄');
        await message.react('🐉');
        await message.react('🔞');
        await message.react('💩');
      });
  });
};

module.exports.help = {
  name: 'SETUP_roleRequest',
};
