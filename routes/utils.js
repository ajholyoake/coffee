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

