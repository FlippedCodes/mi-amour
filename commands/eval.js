const clean = (text) => {
  if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
  return text;
};

module.exports.run = async (client, message, args, config) => {
  const args_eval = message.content.split(' ').slice(1);
  if (message.author.id !== '172031697355800577') return message.react('❌');
  if (message.content.indexOf('token') !== -1) return message.channel.send('Nice try...');
  try {
    const code = args_eval.join(' ');
    let evaled = eval(code);

    if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }

    message.channel.send(clean(evaled), { code: 'xl' });
  } catch (err) {
    message.channel.send(lang.chat_command_eval_err_codeFail({ err: clean(err) }))
      .then(message.react('❌'));
  }
};

module.exports.help = {
  name: 'eval',
  desc: lang.chat_command_eval_desc(),
};
