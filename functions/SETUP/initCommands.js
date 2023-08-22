const Path = require('path');

const fs = require('fs');

const files = [];

function getFiles(Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = Path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return getFiles(Absolute);
    files.push(Absolute);
  });
  return files;
}

module.exports.run = async () => {
  // create empty array to store command submissions
  const commandsSubmit = [];
  // get all command files
  const files = await getFiles('./commands/');
  // only get file with '.js'
  const jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  const cmdLength = jsfiles.length;
  // check if commands are there
  if (cmdLength <= 0) return console.log(`[${module.exports.data.name}] No command(s) to load!`);
  // announcing command loading
  if (DEBUG) console.log(`[${module.exports.data.name}] Loading ${cmdLength} command${cmdLength !== 1 ? 's' : ''}...`);

  // adding all commands
  await jsfiles.forEach((f, i) => {
    // cleanup name
    const cleanName = f
      .replace(/\\|\//g, '_')
      .replace('commands_', '')
      .replace('.js', '');
    // abort entry if in disabled folder
    if (cleanName.search('archive_') !== -1) return;
    // get module command and info
    const probs = require(`../../${f}`);
    // announcing command loading
    if (DEBUG) console.log(`[${module.exports.data.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding command to collection
    client.commands.set(cleanName, probs);
    // if not subcommand: adding command to submittion to discord
    if (!probs.data.subcommand) commandsSubmit.push(probs.data.toJSON());
  });
  const registerLength = commandsSubmit.length;

  await console.log(`[${module.exports.data.name}] Loaded ${cmdLength} command${cmdLength !== 1 ? 's' : ''}!`);
  await console.log(`[${module.exports.data.name}] Registering ${registerLength} command${registerLength !== 1 ? 's' : ''}...`);
  // submit commands to discord api| Dev: one guild only, prod: globaly
  await client.application.commands.set(commandsSubmit, config.guildId).catch(ERR);
  console.log(`[${module.exports.data.name}] ${registerLength} command${registerLength !== 1 ? 's' : ''} registered!`);
};

module.exports.data = {
  name: 'initCommands',
};
