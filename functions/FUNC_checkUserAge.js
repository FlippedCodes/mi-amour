const moment = require('moment');

const userDoB = require('../database/models/UserDoB');

const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (ID) => {
  const dbUser = await userDoB.findOne({ where: { ID } }).catch(errHander);
  // failback, if no entry exists
  if (!dbUser) return { allow: null, age: null, DoB: null };
  const DoB = dbUser.DoB;
  const age = moment().diff(DoB, 'years');
  const allow = dbUser.allow;
  return { allow, age, DoB };
};

module.exports.help = {
  name: 'FUNC_checkUserAge',
};
