module.exports.run = async (client, fs, config, inDev) => {
  // setting inDev var
  console.log(`[${module.exports.help.name}] Setting environment variables...`);
  if (inDev) {
    const token = require('../config/config.json').token;
    config.env.set('inDev', true);
    config.env.set('token', token);
  } else {
    config.env.set('inDev', false);
    config.env.set('token', process.env.BotToken);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
