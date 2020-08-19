const { MessageEmbed } = require('discord.js');

const toTime = require('pretty-ms');

const startupTime = +new Date();

const OfflineStat = require('../database/models/OfflineStat');

const errHander = (err) => {
  console.error(lang.log_global_error_title(), err);
};

module.exports.run = async (client, config) => {
  if (!config.env.get('inDev')) {
    console.log(lang.log_function_SETUP_offlineStat_postingStatusMessage({ functionName: module.exports.help.name }));
  } else return console.log(lang.log_function_SETUP_offlineStat_warn_debugMode({ functionName: module.exports.help.name }));
  let embed = new MessageEmbed()
    .setTitle(lang.chat_function_SETUP_offlineStat_embed_title())
    .setColor(4296754)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 1 } }).catch(errHander);
  if (offlineTime) {
    embed
      .addField(lang.chat_function_SETUP_offlineStat_embed_field_title_botOfflineWhen(), `${toTime(startupTime - offlineTime.time * 1)}`, false)
      .addField(lang.chat_function_SETUP_offlineStat_embed_field_title_botOfflineAt(), new Date(offlineTime.time * 1), false);
  } else {
    embed.setDescription(lang.chat_function_SETUP_offlineStat_warn_noDBEntry_embed_desc);
  }
  client.channels.get(config.setup.logStatusChannel).send({ embed });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 1 }, defaults: { time: startupTime },
    }).catch(errHander);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 1 } }).catch(errHander);
    }
  }, 1 * 5000);
};

module.exports.help = {
  name: 'SETUP_offlineStat',
};
