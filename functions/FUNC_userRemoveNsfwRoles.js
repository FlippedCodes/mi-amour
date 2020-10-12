// get users role manager
async function getRoles(userID, guild) {
  const roles = await guild.members.cache.find(({ id }) => id === userID).roles;
  return roles;
}

module.exports.run = async (userID, guild, rolesConf) => {
  // get nsfw roles in array
  const nsfwRoles = [];
  rolesConf.forEach((role) => {
    if (role.mature) nsfwRoles.push(role.roleID);
  });

  // get user
  const userRoles = await getRoles(userID, guild);

  // remove roles from user
  nsfwRoles.forEach((role) => userRoles.remove(role));
};

module.exports.help = {
  name: 'FUNC_userRemoveNsfwRoles',
};
