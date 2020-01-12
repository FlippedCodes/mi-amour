const { RichEmbed } = require('discord.js');

// Ping kickoff for bot latency
function kickoff(client, message) {
  const sendMessage = client.functions.get('FUNC_richEmbedMessage');
  return sendMessage.run(client.user, message.channel, lang.command_ping_ping(), null, null, false);
}

// message for data return
function editedMessage(sentMessage, message) {
  let body = lang.command_ping_pong({
    msgLatency: sentMessage.createdTimestamp - message.createdTimestamp,
    apiLatency: Math.round(sentMessage.client.ping),
  });
  return new RichEmbed()
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
  desc: 'Shows API and bot latencies.',
};
