var ds = require('nedb');
var fs = require('fs');
var https = require('https');

c = new ds({filename:'db/coffeelist.db',autoload:true});
o = new ds({filename:'db/orders.db',autoload:true});
db = {coffeelist: c,
      orders:     o};

//module.exports.formatUsername = function formatUsername(str)
//{
//  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
//};

module.exports.db = db;

module.exports.username = function(req,res,next){
    req.user = req.ntlm['UserName'];
    req.user_format = formatUsername(req.ntlm['UserName']);
    console.log(req.user_format);
    next();
};
function formatUsername(str)
{
  return str;
}


module.exports.formatUsername = formatUsername;

module.exports.httpsAgent = function()
{
  var agentOpts = {
    rejectUnauthorized:false
  };
return new https.Agent(agentOpts);
}
