var _ = require('lodash');
var util = require('../utils');

module.exports = function allUserStats(x){
var result = {};

result.leaderboard = _.reduce(x,function(acc,el){
var nm = util.formatUsername(el.username);
acc[nm] = acc[nm] ? acc[nm] + el.total : el.total;
return acc;
},{});

result.intensityleaderboard = _.reduce(x,function(acc,el){
var nm = util.formatUsername(el.username);
acc[nm] = acc[nm] ? acc[nm] + el.intensitytotal : el.intensitytotal;
return acc;
},{});

//Cioccatino etc result.dameEdna
// india result.ghandi
// brasil baldperson

return result;
}


