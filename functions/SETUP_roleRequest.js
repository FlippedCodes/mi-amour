/* eslint-disable no-restricted-syntax */
const { MessageEmbed } = require('discord.js');

async function buildEmbed(config, roleData) {
  const embed = new MessageEmbed();
  await roleData.forEach(async (reaction) => {
    await embed.addField(reaction.name, reaction.emoji, true);
  });
  const result = embed
    .setTitle(lang.chat_function_SETUP_roleRequest_embed_title())
    .setDescription(lang.chat_function_SETUP_roleRequest_embed_desc({ channelID: config.info_channelID }));
  return result;
}

async function postReactions(message, roleData) {
  await roleData.forEach(async (reaction) => {
    await message.react(await reaction.emoji);
  });
}

module.exports.run = async (client, config) => {
  const roleRequest = config.setup.roleRequest.channelID;
  if (!client.channels.cache.get(roleRequest)) {
    console.log(lang.log_function_SETUP_roleRequest_warn_channelMissing({
      functionName: module.exports.help.name,
      channelID: roleRequest,
    }));
    return;
  }
  client.channels.cache.get(roleRequest).bulkDelete(10)
    .catch((err) => console.log(lang.log_global_error_title(), err));
  const roleData = config.setup.roleRequest.roles;
  let embed = await buildEmbed(config, roleData);
  client.channels.cache.get(roleRequest).send({ embed })
    .then(async (message) => postReactions(message, roleData));
};

module.exports.help = {
  name: 'SETUP_roleRequest',
};
