const userDoB = require('../../../database/models/UserDoB');

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID, allow: true } }).catch(ERR);
  return result;
}

async function checkinFail(user, fallbackChannel) {
  const body = `
  It seems that you have left [The Dragons Maw](https://discord.gg/Jy4ZuCc). You have to be part of that server to continue using Vorarephilia~Pride!
  `;
  const send = client.functions.get('ENGINE_message_embed');
  send.run(user, body, null, 'Red')
    // if DM sending is disabled, send scheduled deletion message in role channel
    .catch(async () => {
      const sendMessage = await send.run(fallbackChannel, body, null, 'Red', null, true).catch(ERR);
      setTimeout(() => {
        sendMessage.delete();
      }, 10000);
    });
}

module.exports.run = async (memberLeftServer) => {
  // check if left guild is parent server
  if (memberLeftServer.guild.id !== config.checkin.parentServer.serverID) return;
  // get relevant variables
  const subServer = await client.guilds.fetch(config.guildId).catch(() => null);
  if (!subServer) return ERR(`Bot not in sub server or server is currently offline! Could not remove user ${memberLeftServer.id}`);
  const fallbackChannel = await subServer.channels.fetch(config.checkin.declineFallbackChannel);
  const subMember = await subServer.members.fetch(memberLeftServer.id).catch(() => null);
  if (!subMember) return;
  const user = memberLeftServer.user;
  // kick out message
  await checkinFail(user, fallbackChannel);
  // remove all roles
  await subMember.roles.remove(subMember.roles).catch(ERR);
  // hide open channels that are required by discord role request system
  await subMember.roles.add(config.checkin.hideOpenChannels);
};

module.exports.data = {
  name: 'stripCheckinRole',
};
