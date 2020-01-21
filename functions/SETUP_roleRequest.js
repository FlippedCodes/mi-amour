const { RichEmbed } = require('discord.js');

function buildEmbed(embed, config) {
  const langVarNames = ['prey', 'switch', 'pred', 'nsfwAccess', 'nsflAccess'];

  langVarNames.forEach((message) => {
    let messageTitle = eval(`lang.chat_function_SETUP_roleRequest_embed_field_title_${message}()`);
    let messageDesc = eval(`lang.chat_function_SETUP_roleRequest_embed_field_desc_${message}()`);
    embed.addField(messageTitle, messageDesc, true);
  });
  return embed
    .setTitle(lang.chat_function_SETUP_roleRequest_embed_title())
    .setDescription(lang.chat_function_SETUP_roleRequest_embed_desc({ channelID: config.info_channelID }))
    .setTimestamp();
}

function postReactions(message) {
  // FIXME: Random-ass emoji order
  const langVarNames = ['prey', 'switch', 'pred', 'nsfwAccess', 'nsflAccess'];
  langVarNames.forEach((reaction) => {
    let reactionComplete = eval(`lang.chat_function_SETUP_roleRequest_reaction_${reaction}()`);
    message.react(reactionComplete);
  });
}

module.exports.run = async (client, config) => {
  // for each server
  config.setup.roleRequest.channels.forEach((roleRequest) => {
    if (!client.channels.get(roleRequest)) {
      console.log(lang.log_function_SETUP_roleRequest_warn_channelMissing({
        functionName: module.exports.help.name,
        channelID: roleRequest,
      }));
      return;
    }
    client.channels.get(roleRequest).bulkDelete(10)
      .catch((err) => console.log(lang.log_global_error_title(), err));
    let embed = buildEmbed(new RichEmbed(), config);
    client.channels.get(roleRequest).send({ embed })
      .then(async (message) => postReactions(message));
  });
};

module.exports.help = {
  name: 'SETUP_roleRequest',
};
