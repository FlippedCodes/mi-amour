// init Discord
const Discord = require('discord.js');
// init Discord client
const client = new Discord.Client({ disableEveryone: true });
// init sequelize
// const sequelize = require('sequelize');
// init filesystem
const fs = require('fs');
// init correct config
const inDev = fs.existsSync('./config/config.json');
let config;
if (inDev) config = require('./config/main_testing.json');
else config = require('./config/main.json');

// get language file
require('./lang/SETUP_langFile');

// create new collections in client and config
client.functions = new Discord.Collection();
client.commands = new Discord.Collection();
config.env = new Discord.Collection();

// load Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  let INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config, inDev);
});

// create conenction to DB
require('./database/SETUP_DBConnection');

// Login the bot
client.login(config.env.get('token'));

client.once('ready', async () => {
  // confirm user logged in
  console.log(lang.log_event_ready_loggedInUser({
    functionName: config.name,
    userName: client.user.tag,
  }));
  // set bot player status
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, config);
});

client.on('guildMemberRemove', async (member) => {
  client.functions.get('EVENT_guildMemberRemove').run(client, member, config);
});

client.on('messageReactionAdd', async (reaction, user) => {
  client.functions.get('EVENT_messageReactionAdd').run(client, reaction, user, config);
});

// trigger on reaction with raw package
client.on('raw', async (packet) => {
  if (packet.t === 'MESSAGE_REACTION_ADD' && packet.d.guild_id) {
    client.functions.get('FUNC_checkinInitReaction').run(client, packet.d, config);
  }
});

// logging errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
