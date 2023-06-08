const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('repost')
      .setEmoji('👌')
      .setLabel('Auto-repost')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('dismiss')
      .setEmoji('<:greencheck:758380151544217670>')
      .setLabel('Got it')
      .setStyle(ButtonStyle.Secondary),
  ]);

async function replaceStuff(message) {
  // replace text
  let content = message.content;
  await config.linkReplace.links.forEach((entry) => {
    content = content.replaceAll(entry.search, entry.replace);
  });

  // prepare username and avatar
  const username = message.member.nickname || message.author.username;
  const avatarURL = message.member.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });

  // get webhook and send message
  const channel = message.channel;
  const channelWebhooks = await channel.fetchWebhooks();
  let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
  if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
  hook.send({
    content, username, avatarURL,
  }).catch(ERR);
  return;
}

module.exports.run = async (message) => {
  const foundList = config.linkReplace.links.map((entry) => ({
    notFound: message.content.search(entry.search) === -1,
    searched: entry.search,
    replace: entry.replace,
  }));
  const notFound = foundList.every((entry) => entry.notFound);
  if (notFound) return;

  // send message, informing user and providing options
  const bodyContent = `
  Hey,... Hey you! did you know that if you use **${foundList[0].searched}** instead of **${foundList[0].replace}** discord will embed it better?
  
  That way you don't have to post the image alongside your link :3
  If you want to, you allow me to re-post it for you, but then you can't delete the message anymore.
  `;
  const messageReply = new EmbedBuilder()
    .setTitle('Pssst.')
    .setDescription(bodyContent)
    .setFooter({ text: 'Or you just dismiss me. I will not be mad, promise. 🥲' })
    .setColor('Blue');

  // post user option message
  const confirmMessage = await reply(message, {
    embeds: [messageReply], components: [buttons], fetchReply: true,
  });
  // start button collector
  const filter = (i) => message.author.id === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 120000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'repost') {
      message.delete();
      replaceStuff(message);
    }
    // delete post
    confirmMessage.delete();
    return;
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) {
      confirmMessage.delete();
    }
  });
};

module.exports.data = {
  name: 'check',
};
