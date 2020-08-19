const { MessageEmbed } = require('discord.js');

// Ping kickoff for bot latency
function kickoff(client, message) {
  const sendMessage = client.functions.get('FUNC_richEmbedMessage');
  return sendMessage.run(client.user, message.channel, lang.chat_command_ping_embed_ping(), null, null, false);
}

// message for data return
function editedMessage(sentMessage, message) {
  let body = lang.chat_command_ping_embed_pong({
    msgLatency: sentMessage.createdTimestamp - message.createdTimestamp,
    apiLatency: Math.round(sentMessage.client.ping),
  });
  return new MessageEmbed()
    .setDescription(body)
    .setColor();
}

// posts ping message and edits it afterwards
function checkPing(client, message) {
  kickoff(client, message).then((sentMessage) => {
    sentMessage.edit(editedMessage(sentMessage, message));
  });
}

module.exports.run = async (client, message) => checkPing(client, message);

module.exports.help = {
  name: 'ping',
  desc: lang.chat_command_ping_desc(),
};
