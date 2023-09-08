module.exports.run = async (interaction) => {
  const user = interaction.options.getUser('user', true);
  const bioID = interaction.options.getString('bio', true);

  const bios = await client.functions.get('ENGINE_bio_getBios').run(interaction, user);
  const bio = bios.filter((bio) => bio.ID === bioID);
  console.log(bio);
};

module.exports.data = { subcommand: true };
