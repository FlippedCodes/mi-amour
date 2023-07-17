module.exports.run = async (interaction) => {
  // check if user is teammember
  if (!interaction.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(interaction, 'You don\'t have access to this command! òwó');

  const message = interaction.message;
  if (message.channel.parentId !== config.checkin.categoryID) return messageFail(interaction, 'This channel is not a checkin channel.');
  return client.functions.get('ENGINE_checkin_postReaction').run(message);
};

module.exports.data = new CmdBuilder()
  .setName('checkin')
  .setDescription('Shows the checkin menu without pinging team.');
