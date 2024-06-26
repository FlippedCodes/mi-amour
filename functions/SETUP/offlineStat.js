const { EmbedBuilder } = require('discord.js');

const moment = require('moment');

const startupTime = +new Date();

const OfflineStat = require('../../database/models/OfflineStat');

module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Posting bot status message!`);
  const embed = new EmbedBuilder()
    .setTitle('Mi Amour - Bot back online!')
    .setColor('Green')
    .setFooter({ text: client.user.tag, icon_url: client.user.displayAvatarURL })
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: client.user.id } }).catch(ERR);
  if (offlineTime) {
    const timeStamp = moment(offlineTime.updatedAt);
    embed.addFields([
      { name: 'Heartbeat stopped at', value: `<t:${timeStamp.format('X')}:f>` },
      { name: 'Time the bot was away', value: `${moment().diff(timeStamp, 'seconds', true)}s` },
    ]);
  } else {
    embed.setDescription('I can\'t remember when i went offline. A new DB entry got created!');
  }
  client.channels.cache.get(config.setup.logStatusChannel).send({ embeds: [embed] });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: client.user.id }, defaults: { time: startupTime },
    }).catch(ERR);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: client.user.id } }).catch(ERR);
    }
  }, 1 * 5000);
};

module.exports.data = {
  name: 'offlineStat',
  callOn: 'setup',
};
