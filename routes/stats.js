var _ = require('lodash');
var DOStats = require('./stats/DOStats');
var userStats = require('./stats/userStats');
var allUserStats = require('./stats/allUserStats');
var awardStats = require('./stats/awardStats');

var db = require('./utils').db;

module.exports.display = function(req,res){
var obj = {};
res.render('stats',obj);
};

module.exports.data = function(req,res){
var obj = {}; //Render Object
//This is NOT good when it gets big!
db.orders.find({}).exec(function(err,allorders){

//Yeah yeah, I know this is shit. Joins in the app layer FML.
db.coffeelist.find({}).exec(function(err,alllists){
for(var ii = 0; ii < allorders.length; ii++)
{ParseOrder(allorders[ii],alllists);}

var user = req.user_format;

obj.DOStats = DOStats(allorders);
obj.userStats = userStats(allorders.filter(function(x){return x.username === user;}));
obj.allUserStats = allUserStats(allorders);
obj.awardStats = awardStats(allorders);

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
var names = {};
Object.keys(x.list).forEach(function(key){
    var val = parseInt(x.list[key]);
    val = isNaN(val)?0:val;
    x.list[key] = val;
    names[key] = list[key].name;
    total += val;
    if(list[key] && list[key].intensity){
    totalintensity += val*parseInt(list[key].intensity);
    x.intensitylist[key] = list[key].intensity;
    } else {
    x.intensitylist[key] = 0;
    }
});
x.names = names;
x.total = total;
x.intensitytotal = totalintensity;
var date = new Date(x.date);
x.monthyear =[date.getYear(), date.getMonth()];
}






