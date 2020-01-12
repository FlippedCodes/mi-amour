/* eslint-disable no-else-return */
const Handlebars = require('handlebars');

const fs = require('fs');

const config = require('../config/main.json');

const file = `./lang/${config.lang}.json`;

let moduleName = 'LangHandler';

// function initLang(file) {
//   if (typeof file === 'string') return Handlebars.compile(file);
//   const result = {};
//   let key;
//   let value;
//   // eslint-disable-next-line no-restricted-syntax
//   for ([key, value] of Object.entries(file)) {
//     result[key] = initLang(value);
//   }
//   return result;
// }

function getCommands(lang) {
  // if (!fs.existsSync(path.join(__dirname, config[lang]))) {
  //   throw new Error(`File Missing! ${config[lang]}`);
  // }
  const fileContents = fs.readFileSync(lang);
  const phraseString = JSON.parse(fileContents);
  const phrases = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [phraseName, phraseTemplate] of Object.entries(phraseString.commands)) {
    phrases[phraseName] = Handlebars.compile(phraseTemplate.template);
  }
  return phrases;
}

function checkingFile() {
  console.log(`[${moduleName}]`, 'Checking language file...');
  // check if file exists
  if (fs.existsSync(file)) {
    console.log(`[${moduleName}]`, 'Language file exists, creating tempalte...');
    return getCommands(file);
  } else {
    // kill bot-process if lang file doesn't exist
    console.log(`[${moduleName}]`, 'The specified language doesn\'t exist! Exiting...');
    process.exit(1);
  }
}

const langExport = checkingFile();

module.exports = langExport;
global.lang = langExport;
