// const commandName = DEBUG ? interaction.commandName.replace('_dev', '') : interaction.commandName;
module.exports.run = async (interaction) => client.functions.get(`AUTOCOMPLETE_${interaction.commandName}`).run(interaction).catch(ERR);

module.exports.data = {
  name: 'isAutocomplete',
};
