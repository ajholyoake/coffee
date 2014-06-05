module.exports = function awardStats(x){

var result = {};

result.dameEdna = {};
result.dameEdna.list = AwardResults(x,/Vanilio|Caramelito|Ciocattino/);
result.dameEdna.description = 'Vanilio, Caramelito and Ciocattino';
result.dameEdna.img = 'images/dame_edna.jpg';

result.wetTowel = {};
result.wetTowel.list = AwardResults(x,/.*Decaffeinato.*/);
result.wetTowel.description = 'Afraid of caffeine';
result.wetTowel.img = 'images/wet_towel.jpg';

result.nails = {};
result.nails.list    = AwardResults(x,/Ristretto/);
result.nails.description = 'Ristretto = Man Fuel';
result.nails.img = 'images/nails.jpg';

return result;

};


//Yeah, do your map reduce in js rather than the db. I dare you.
function AwardResults(x,r){

var userTable = {};
x.forEach(function(order){

var coffees = Object.keys(order.list);
 
if(!userTable[order.username]){ userTable[order.username] = 0;}

for(var jj=0; jj < coffees.length; jj++){
if(coffees[jj].match(r) && order.list[coffees[jj]]){
userTable[order.username] += order.list[coffees[jj]];
}
}

});

var users = Object.keys(userTable);
var counts = [];
users.forEach(function(u){counts.push(userTable[u]);});

var table = [];

users.forEach(function(el,ind){
table.push([el, counts[ind]]);
});
table.sort(function(a,b){
  return b[1] - a[1];
  });
table = table.filter(function(el){return el[1] > 0});
return table;

}
