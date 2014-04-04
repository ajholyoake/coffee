var mongo = require('mongoskin');
var _ = require('lodash');
var DOStats = require('./stats/DOStats');
var userStats = require('./stats/userStats');
var allUserStats = require('./stats/allUserStats');

var dbstring= 'localhost:27017/coffee?auto_reconnect';

module.exports.display = function(req,res){
var obj = {};
res.render('stats',obj);
};

module.exports.data = function(req,res){
var obj = {}; //Render Object
var db = mongo.db(dbstring);
//This is NOT good when it gets big!
db.collection('orders').find({}).toArray(function(err,allorders){

//Yeah yeah, I know this is shit. Joins in the app layer FML.
db.collection('coffeelist').find({}).toArray(function(err,alllists){
for(var ii = 0; ii < allorders.length; ii++)
{ParseOrder(allorders[ii],alllists);}

var user = req.headers['x-iisnode-auth_user'];

obj.DOStats = DOStats(allorders);
obj.userStats = userStats(allorders.filter(function(x){return x.username === user;}));
obj.allUserStats = allUserStats(allorders);

res.send(obj);
});
});
};


//Parse the order - add a bit of date and the total for each order
function ParseOrder(x,coffeelist){
var total = 0;
var totalintensity = 0;
x.intensitylist = {};
var list = coffeelist.filter(function(y){return y.orderNumber === x.orderNumber;})[0].list;
//Could add intensities to the order now
Object.keys(x.list).forEach(function(key){
var val = parseInt(x.list[key]);
val = isNaN(val)?0:val;
x.list[key] = val;
total += val;
if(list[key] && list[key].intensity){
totalintensity += val*parseInt(list[key].intensity); 
x.intensitylist[key] = list[key].intensity;
} else {
x.intensitylist[key] = 0;
}
});
x.total = total;
x.intensitytotal = totalintensity;
x.date = new Date(parseInt(x._id.toString().slice(0,8),16)*1000);
x.monthyear =[x.date.getYear(), x.date.getMonth()];
}






