module.exports.run = async (client, message, config) => {
  if (message.mentions.has(config.teamRole)
  && message.channel.parentID === config.checkin.categoryID) {
    await message.react('👌');
    await message.react('✋');
    client.functions.get('FUNC_MessageEmbedMessage')
      .run(null, message.channel,
        'Please wait for a teammember to review your answers.',
        null, 4296754, false);
  }
};

module.exports.help = {
  name: 'FUNC_checkinPostReaction',
};
