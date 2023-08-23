module.exports.run = async (interaction) => {
  // only guild command
  if (!await interaction.inGuild()) return messageFail(interaction, uwu('The bot is for server-use only.'));

  if (interaction.guild.id !== config.guildId) return;

  // command handler
  if (interaction.isCommand()) return client.functions.get('EVENT_interaction_isCommand').run(interaction).catch(ERR);
  if (interaction.isButton()) return client.functions.get('EVENT_interaction_isButton').run(interaction).catch(ERR);
  if (interaction.isModalSubmit()) return client.functions.get('EVENT_interaction_isModalSubmit').run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'interactionCreate',
};
