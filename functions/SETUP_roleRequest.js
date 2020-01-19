const { RichEmbed } = require('discord.js');

function buildEmbed(embed) {
  return embed
    .setTitle(lang.chat_function_SETUP_roleRequest_embed_title())
    .setDescription(lang.chat_function_SETUP_roleRequest_embed_desc({ channelID: config.info_channelID }))
    .addField(lang.chat_function_SETUP_roleRequest_embed_field_title_prey(), lang.chat_function_SETUP_roleRequest_embed_field_desc_prey(), true)
    .addField(lang.chat_function_SETUP_roleRequest_embed_field_title_switch(), lang.chat_function_SETUP_roleRequest_embed_field_desc_switch(), true)
    .addField(lang.chat_function_SETUP_roleRequest_embed_field_title_pred(), lang.chat_function_SETUP_roleRequest_embed_field_desc_pred(), true)
    .addField(lang.chat_function_SETUP_roleRequest_embed_field_title_nsfwAccess(), lang.chat_function_SETUP_roleRequest_embed_field_desc_nsfwAccess(), true)
    .addField(lang.chat_function_SETUP_roleRequest_embed_field_title_nsflAccess(), lang.chat_function_SETUP_roleRequest_embed_field_desc_nsflAccess(), true)
    .setTimestamp();
}

async function postReactions(message) {
  await message.react(lang.chat_function_SETUP_roleRequest_reaction_prey());
  await message.react(lang.chat_function_SETUP_roleRequest_reaction_switch());
  await message.react(lang.chat_function_SETUP_roleRequest_reaction_pred());
  await message.react(lang.chat_function_SETUP_roleRequest_reaction_nsfwAcess());
  await message.react(lang.chat_function_SETUP_roleRequest_reaction_nsflAccess());
}

module.exports.run = async (client, config) => {
  // for each server
  [config.setup.roleRequestChannels].forEach((roleRequest) => {
    if (!client.channels.get(roleRequest)) {
      console.log(lang.log_function_SETUP_roleRequest_warn_channelMissing({
        functionName: module.exports.help.name,
        channelID: roleRequest,
      }));
      return;
    }
    client.channels.get(roleRequest).bulkDelete(10)
      .catch((err) => console.log(lang.log_global_error_title(), err));
    let embed = buildEmbed(new RichEmbed());
    client.channels.get(roleRequest).send({ embed })
      .then(async (message) => postReactions(message));
  });
};

module.exports.help = {
  name: 'SETUP_roleRequest',
};
