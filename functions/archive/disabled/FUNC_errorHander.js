// TODO: make all modules globaly available
// FIXME: useful?
module.exports.run = async (err) => console.error(lang.log_global_error_title(), err);

module.exports.help = {
  name: 'FUNC_errorHander',
};
