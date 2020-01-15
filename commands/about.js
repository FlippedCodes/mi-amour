const fs = require('fs');

// creates a embed messagetemplate for succeded actions
function postMessage(client, message, body, error) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, lang.command_about_embed_title(), message.member.displayColor, false);
}

// creates a embed messagetemplate for failed text retrieving and posts error message into log
// TODO: put in own errorhandler
// TODO: make errorlogchannel in server
function error(client, channel, err) {
  console.error(lang.log_global_error_title(), err);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel, lang.global_error_unkown(), '', 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  fs.readFile(config.aboutText, 'utf8', (err, data) => {
    if (err) return error(client, message.channel, err);
    postMessage(client, message, data, error);
  });
};

module.exports.help = {
  name: 'about',
  desc: lang.command_about_desc(),
};
