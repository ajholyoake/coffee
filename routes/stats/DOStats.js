var _ = require('lodash');
module.exports = function(x){

//Total number of coffess
var total = _.reduce(x,function(s,el){
  return s + el.total;
},0);

//Coffees per month
var monthlyTotals = _.reduce(x,
function(result,el){
if(result[el.monthyear]){
result[el.monthyear] += el.total;
} else {
result[el.monthyear] = el.total;
}
return result;
},{});

//Coffees by flavour
var flavourTotals = _.reduce(x,
function(result,el){
Object.keys(el.list).forEach(function(key){
    var nkey = el.names[key];
result[nkey] = result[nkey] ? result[nkey]+el.list[key] : el.list[key];
});
return result;
},{});

return {total:total,monthlyTotals:monthlyTotals,flavourTotals:flavourTotals};
};
