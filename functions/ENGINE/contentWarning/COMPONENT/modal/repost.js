const { AttachmentBuilder } = require('discord.js');

async function addUser(ID, DoB, allow, teammemberID) {
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { DoB, allow, teammemberID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction) => {
  const IDregEx = /[0-9]/g;
  const customID = interaction.components[0].components[0].customId;
  const userCW = interaction.fields.getTextInputValue(customID);

  const messageID = customID.match(IDregEx).join('');
  const message = await interaction.channel.messages.fetch(messageID);

  const content = `${message.content}\n**Content Warning: \`${userCW}\`**`;

  const username = message.member.nickname;
  const avatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 512 });
  const files = message.attachments.map((file) => new AttachmentBuilder(file.url).setName(file.name).setSpoiler(true));

  const channel = message.channel;
  const channelWebhooks = await channel.fetchWebhooks();
  let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
  if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
  hook.send({
    content, username, avatarURL, files,
  }).catch(ERR);
  message.delete();
};

module.exports.data = {
  name: 'dobAdd',
};
