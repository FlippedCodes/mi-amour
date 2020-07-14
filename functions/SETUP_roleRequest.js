const { RichEmbed } = require('discord.js');

async function buildEmbed(config, langVarNames) {
  const embed = new RichEmbed();
  await langVarNames.forEach(async (message) => {
    let messageTitle = await eval(`lang.chat_function_SETUP_roleRequest_embed_field_title_${message}()`);
    let messageDesc = await eval(`lang.chat_function_SETUP_roleRequest_embed_field_desc_${message}()`);
    await embed.addField(messageTitle, messageDesc, true);
  });
  const result = embed
    .setTitle(lang.chat_function_SETUP_roleRequest_embed_title())
    .setDescription(lang.chat_function_SETUP_roleRequest_embed_desc({ channelID: config.info_channelID }));
  return result;
}

async function postReactions(message, langVarNames) {
  // FIXME: Random-ass emoji order
  await langVarNames.forEach(async (reaction) => {
    let reactionComplete = eval(`lang.chat_function_SETUP_roleRequest_reaction_${reaction}()`);
    await message.react(await reactionComplete);
  });
}

module.exports.run = async (client, config) => {
  // for each server
  config.setup.roleRequest.channels.forEach(async (roleRequest) => {
    if (!client.channels.get(roleRequest)) {
      console.log(lang.log_function_SETUP_roleRequest_warn_channelMissing({
        functionName: module.exports.help.name,
        channelID: roleRequest,
      }));
      return;
    }
    client.channels.get(roleRequest).bulkDelete(10)
      .catch((err) => console.log(lang.log_global_error_title(), err));
    const langVarNames = ['prey', 'switch', 'pred', 'nsfwAccess', 'nsflAccess'];
    let embed = await buildEmbed(config, langVarNames);
    client.channels.get(roleRequest).send({ embed })
      .then(async (message) => postReactions(message, langVarNames));
  });
};

module.exports.help = {
  name: 'SETUP_roleRequest',
};
