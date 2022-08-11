const moment = require('moment');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, color, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', color, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

function checkAllowed(DoB) {
  const age = moment().diff(DoB, 'years');
  return [age >= 18, age];
}

function calcMonths(DoB) {
  const fullAgeBD = moment(DoB).add(18, 'years');
  const monthDiff = moment(fullAgeBD).diff(moment(), 'months');
  return monthDiff;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // split args
  const [subcmd, DoB] = args;
  // get date
  const date = moment(DoB, config.DoBchecking.dateFormats, false);

  // validate data
  if (!date.isValid()) {
    return messageFail(message,
      `**Your provided DoB is not a date!**
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} DoB\`\`\``);
  }

  // get allow and age
  const [allow, age] = checkAllowed(date);
  // report to user if entry added
  let color = 16741376;
  let months = null;
  if (allow) color = 4296754;
  else months = await calcMonths(DoB);
  messageSuccess(message, color, `
  Age: \`${age}\`
  Months till 18th Bday: \`${months}\`
  Allow: \`${allow}\`
  parsedDoB: \`${date.toDate()}\``);
};

module.exports.help = {
  name: 'CMD_nsfw_calc',
  parent: 'nsfw',
};
