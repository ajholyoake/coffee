var ds = require('nedb');
c = new ds({filename:'db/coffeelist.db',autoload:true});
o = new ds({filename:'db/orders.db',autoload:true});
db = {coffeelist: c,
      orders:     o};

module.exports.formatUsername = function formatUsername(str)
{
  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

module.exports.db = db;

module.exports.username = function(req,res,next){
    req.user = req.headers['x-iisnode-auth_user'];
    req.user_format = formatUsername(req.headers['x-iisnode-logon_user']);
    console.log(req.user_format);
    next();
};
function formatUsername(str)
{
  var dedomain = str.substr(str.indexOf('\\')+1);
  var spaced = dedomain[0] + ' ' +dedomain.substr(1);
  return spaced.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

