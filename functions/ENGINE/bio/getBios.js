const { PermissionsBitField } = require('discord.js');

// cache system was implemented cause i don't know if discord.js caches properly. and it was still pretty slow
let cache = [];

module.exports.run = async (interaction, user) => {
  const cachedEntry = cache.find((entry) => entry.id === user.id);
  if (cachedEntry) return cachedEntry.bios;

  const bioRawCollections = await Promise.all(
    config.bio.bioChannels.map(async (channelID) => {
      const channel = await interaction.guild.channels.fetch(channelID);
      const threads = await channel.threads.fetch();
      return threads.threads;
    }),
  );

  const biosRaw = [];
  bioRawCollections
    .filter((collection) => collection.size)
    .forEach((collection) => {
      const out = collection.map((thread) => thread);
      biosRaw.push(...out);
    });

  // horrible code IK, but JS didn't want as i wanted to do it

  const bios = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const thread of biosRaw) {
    const bioMessage = await thread.fetchStarterMessage().catch(() => null);
    // async await didn't want to play nicely, so I filter afterwards
    if (!bioMessage) bios.push({ name: null });
    else if (bioMessage.author.id !== user.id) bios.push({ name: null });
    else {
      await bios.push({
        id: bioMessage.id,
        name: thread.name,
        link: bioMessage.url,
        description: bioMessage.content,
        embed: bioMessage.embeds.length ? bioMessage.embeds[0] : null,
        // check if user can see channel and their for has permissions
        allowed: thread.parent.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ViewChannel),
      });
    }
  }
  // await biosRaw.forEach(async (thread) => {

  // });

  const biosFinal = bios.filter((bio) => bio.name);

  cache.push({ id: user.id, bios: biosFinal });
  setTimeout(() => {
    cache = cache.filter((entry) => entry.id !== user.id);
  }, 1.8e+6); // 30 mins

  return biosFinal;
};

module.exports.help = {
  name: 'getBios',
};
