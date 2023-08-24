const userDoB = require('../../../database/models/UserDoB');

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID } }).catch(ERR);
  return result;
}

async function checkinFail(user, fallbackChannel) {
  const body = `
  You don't seem to be in [The Dragons Maw](https://discord.gg/Jy4ZuCc), make sure to join it and check in there first, before trying again.
  This is because Vorarephilia~Pride is a sub-server of [TDM](https://discord.gg/Jy4ZuCc).
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

module.exports.run = async (member) => {
  // check if user is already checked in
  if (await member.roles.resolve(config.checkin.checkinRole)) return;
  // get relevant variables
  const fallbackChannel = await member.guild.channels.fetch(config.checkin.declineFallbackChannel);
  const user = member.user;
  // check if member is on parentServer
  const parentServer = await client.guilds.fetch(config.checkin.parentServer.serverID).catch(() => null);
  if (!parentServer) return console.error('Bot not in parent server or server is currently offline!');
  const parentMember = await parentServer.members.fetch(member.id).catch(() => null);
  if (!parentMember) return checkinFail(user, fallbackChannel);
  // check for role
  if (!await parentMember.roles.resolve(config.checkin.parentServer.roleID)) return checkinFail(user, fallbackChannel);
  // check for DB entry
  const userDoB = await searchUser(user.id);
  if (!userDoB) return checkinFail(user, fallbackChannel);
  // let in
  await member.roles.add(config.checkin.checkinRole).catch(ERR);
  await member.roles.remove(config.checkin.hideOpenChannels).catch(ERR);
};

module.exports.data = {
  name: 'oAuthParentServer',
};
