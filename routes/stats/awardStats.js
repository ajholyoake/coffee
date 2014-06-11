module.exports = function awardStats(x){

var result = [];

dameEdna = {};
dameEdna.title = "Dame Edna";
dameEdna.list = AwardResults(x,/Vanilio|Caramelito|Ciocattino/);
dameEdna.description = 'Vanilio, Caramelito and Ciocattino';
dameEdna.img = 'images/dame_edna.jpg';
result.push(dameEdna);

wetTowel = {};
wetTowel.title = "Wet Towel";
wetTowel.list = AwardResults(x,/.*Decaffeinato.*/);
wetTowel.description = 'Afraid of caffeine';
wetTowel.img = 'images/wet_towel.jpg';
result.push(wetTowel);

nails = {};
nails.title = "Nails";
nails.list    = AwardResults(x,/Ristretto/);
nails.description = 'Ristretto = Man Fuel';
nails.img = 'images/nails.jpg';
result.push(nails);


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
