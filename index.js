// init Discord
const {
  Client, IntentsBitField, Collection, Partials,
} = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// use contructor to create intent bit field
const intents = new IntentsBitField([
  IntentsBitField.Flags.DirectMessages,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildMessageReactions,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.MessageContent,
]);
const partials = [
  Partials.Reaction,
  Partials.Message,
];
// setting essential global values
// init Discord client
global.client = new Client({ disableEveryone: true, intents, partials });

// init config
global.config = require('./config.json');
global.config.package = require('./package.json');

global.DEBUG = process.env.NODE_ENV === 'development';

// global.main = {};
global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor(16449540);
  client.channels.fetch(config.setup.logStatusChannel).then((channel) => channel.send({ embeds: [embed] }));
  return;
};

// creating collections
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  // const startupQueue = new PQueue({ concurrency: 1 });
  const files = await fs.readdirSync('./functions/STARTUP');
  files.forEach(async (FCN) => {
    if (!FCN.endsWith('.js')) return;
    const INIT = require(`./functions/STARTUP/${FCN}`);
    await INIT.run(fs);
  });

  // When done: Login the bot
  await client.login(process.env.DCtoken);
})();

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run();
  });
});

client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

client.on('guildMemberAdd', (member) => client.functions.get('EVENT_guildMemberAdd').run(member).catch(ERR));

client.on('guildMemberRemove', (member) => client.functions.get('EVENT_guildMemberRemove').run(member).catch(ERR));

client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message).catch(ERR));

client.on('messageReactionAdd', (messageReaction, user) => client.functions.get('EVENT_messageReactionAdd').run(messageReaction, user).catch(ERR));

// logging errors and warns
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
process.on('uncaughtException', (ERR));
