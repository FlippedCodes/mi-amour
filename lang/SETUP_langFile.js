/* eslint-disable no-else-return */
const Handlebars = require('handlebars');

const fs = require('fs');

const config = require('../config/main.json');

const file = `./lang/${config.lang}.json`;

let moduleName = 'LangHandler';

// logs messages
function log(string) {
  console.log(`[${moduleName}]`, string);
}

function getCommands(lang) {
  const fileContents = fs.readFileSync(lang);
  const phraseString = JSON.parse(fileContents);
  const phrases = {};
  // handlebars compile phrases
  // eslint-disable-next-line no-restricted-syntax
  for (const [phraseName, phraseTemplate] of Object.entries(phraseString)) {
    phrases[phraseName] = Handlebars.compile(phraseTemplate);
  }
  return phrases;
}

function checkingFile() {
  log('Checking language file path...');
  // check if file exists
  if (fs.existsSync(file)) {
    log('Language file exists, creating tempalte...');
    return getCommands(file);
  } else {
    // kill bot-process if lang file doesn't exist
    log('The specified language doesn\'t exist! Exiting...');
    process.exit(1);
  }
}

const langExport = checkingFile();

module.exports = langExport;
global.lang = langExport;
