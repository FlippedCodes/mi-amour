const { EmbedBuilder } = require('discord.js');

const moment = require('moment');

const startupTime = +new Date();

const OfflineStat = require('../../database/models/OfflineStat');

module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Posting bot status message!`);
  const embed = new EmbedBuilder()
    .setTitle('GurgleBot - Bot back online!')
    .setColor(4296754)
    .setFooter({ text: `${client.user.tag}`, icon_url: `${client.user.displayAvatarURL}` })
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 2 } }).catch(ERR);
  const timeStamp = moment(offlineTime.updatedAt).format('X');
  if (offlineTime) {
    embed
      .addFields([{ name: 'The time the bot went offline:', value: `<t:${timeStamp}:R>`, inline: true }])
      .addFields([{ name: 'The bot went offline at:', value: `<t:${timeStamp}:f>`, inline: true }]);
  } else {
    embed.setDescription('The time that the bot was offline, is missing. A new entry got created!');
  }
  client.channels.cache.get(config.setup.logStatusChannel).send({ embeds: [embed] });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 2 }, defaults: { time: startupTime },
    }).catch(ERR);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 2 } }).catch(ERR);
    }
  }, 1 * 5000);
};

module.exports.data = {
  name: 'offlineStat',
  callOn: 'setup',
};
