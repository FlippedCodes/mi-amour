module.exports.run = async (interaction) => {
  // check if command is run in correct server
  // check member for nsfw and nsfl roles

  // FIXME: deferReply already globally applied to all commands
  // await interaction.deferReply({ ephemeral: true });

  const subName = interaction.options.getSubcommand(true);

  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction);
};

module.exports.data = new CmdBuilder()
  .setName('bio')
  .setDescription('See details about the bios from someone else.')
  .setDMPermission(false)
  .addSubcommand((SC) => SC
    .setName('info')
    .setDescription('Show how this works.'))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('List all bios.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Provide the user you want to get the bios from.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('search')
    .setDescription('Show infos about one specific bio.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Provide the user you want to get the bios from.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('bio')
      .setDescription('Select a bio.')
      .setAutocomplete(true)
      .setRequired(true)));
