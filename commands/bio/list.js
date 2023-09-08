module.exports.run = async (interaction) => {
  const user = interaction.options.getUser('user', true);

  const bios = await client.functions.get('ENGINE_bio_getBios').run(interaction, user);
  if (!bios.length) return messageFail(interaction, `${user} doesn't have any.`);
  const body = `**${user}s Bio List**\n${bios.map((bio) => `- [${bio.name}](${bio.link})\n`)}`;
  messageSuccess(interaction, body);
};

module.exports.data = { subcommand: true };
