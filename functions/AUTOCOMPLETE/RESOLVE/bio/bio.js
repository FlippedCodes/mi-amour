module.exports.run = async (interaction) => {
  const user = interaction.options.getUser('user', true);
  // check if member is set
  if (!user) return [{ name: null, value: 'Select a user first!' }];

  const bios = await client.functions.get('ENGINE_bio_getBios').run(interaction, user);
  const output = bios.map((entry) => {
    const value = entry.name;
    return { name: entry.id, value };
  });
  return output;
};

module.exports.data = {
  name: 'bio',
};
