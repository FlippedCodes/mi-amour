module.exports.run = async (interaction) => {
  const body = `The Bios are getting pulled from teh Bios channels below. Add yours there for others to get your Bio.\n${config.bio.bioChannels.map((channelID) => `- <#${channelID}>`).join('\n')}`;
  messageSuccess(interaction, body);
};

module.exports.data = { subcommand: true };
