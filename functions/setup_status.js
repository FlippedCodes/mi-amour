module.exports.run = async (message, im) => {
  const parsed = message.content.slice(im.length + 1);
  message.channel.send(`Hey ${parsed}, I'm dad!`);
};

module.exports.help = {
  name: 'FUNC_april',
};
