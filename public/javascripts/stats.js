var data = {};
$(function(){

$.get('/statsinfo',function(d){
data = d;

//DO totals

d3.select("#totalCoffees").html(data.DOStats.total);

//Monthly totals

monthlyTotalsChart(data.DOStats.monthlyTotals,'#monthlyTotals');
flavourTotalsChart(data.DOStats.flavourTotals,'#flavourTotals');

flavourTotalsChart(data.allUserStats.leaderboard,'#quantityLeaderboard');
flavourTotalsChart(data.allUserStats.intensityleaderboard,'#intensityLeaderboard');
plotAwards(data.awardStats);
});

});

function plotAwards(s){
  var font_sizes = [28, 24, 20, 16, 14];
  var $award = d3.select('#awards');
  var divs = $award.selectAll('.award')
    .data(s)
    .enter().append('div')
    .attr("class","award span4").style("text-align","center");
    divs.append("h4").text(function(d){return d.title;});
    divs.append("div").attr("class","description").text(function(d){return d.description;});
    divs.append("img").attr("class","award-image").attr("src",function(d){return d.img;}).style("width","auto");
   //var ol = divs.append("ol")
   //ol.selectAll('li').data(function(d){return d.list.slice(0,5);}).enter().append('li')
   var d = divs.append("div").style("padding-top","10px");
   d.selectAll('p').data(function(d){return d.list.slice(0,5);}).enter().append('p')
    .text(function(d,i){return formatUsername(d[0]) + " " + d[1];})
    .style("font-size",function(d,i){return font_sizes[i]+'px';})
    .style("line-height","normal");
    //.attr('x',1)
    //.attr('y',function(d,i){return (i+1)*20;});


}



function flavourTotalsChart(data,element){

  var $target = d3.select(element);

  var margin = {top:10, right:10, bottom:10, left:150},
      width  = parseFloat($target.style("width")) - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  //Bosh the data into an appropriate format
  var d = [];
  d3.map(data).forEach(function(k,v){
    if (v)
    {
    d.push({coffee:k,value:v});
    }
  });
    d.sort(function(a,b){return b.value - a.value;});


  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.ordinal().rangeRoundBands([0,height],0.1);

  var yAxis = d3.svg.axis().scale(y).orient("left");

  var svg = $target.append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height",height+margin.bottom+margin.top)
        .append("g")
          .attr("transform","translate("+ margin.left + "," + margin.top + ")");
  x.domain([0, d3.max(d,function(d){return d.value;})]);
  y.domain(d.map(function(d){return d.coffee;}));

  svg.append("g")
     .attr("class","y axis")
     .call(yAxis)
     .append("text");

  var enter = svg.selectAll('.bar')
                .data(d)
                .enter().append("g")
                .attr("class","bar");


      enter.append("rect")
        .attr("x",0)
        .attr("width",function(d){return x(d.value);})
        .attr("y",function(d){return y(d.coffee);})
        .attr("height",y.rangeBand());

      enter.append("text")
        .attr("x",function(d){return x(d.value);})
        .attr("y",function(d){return y(d.coffee) + y.rangeBand()/2;})
        .attr("height",y.rangeBand())
        .attr("width",100)
        .attr("text-anchor",function(d){return x(d.value)>20?"end":"start";})
        .attr("dominant-baseline","central")
        .attr("fill",function(d){return x(d.value) > 20?"#fff":"";})
        .text(function(d){return d.value;});


}

function monthlyTotalsChart(data,element){

  var $target = d3.select(element);

var margin = {top:20, right:50, bottom:20, left:50},
    width = parseFloat($target.style("width")) - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var d = [];
d3.map(data).forEach(function(k,v){
   k = k.split(',');
   d.push({date:new Date(parseInt(k[0])+1900,k[1],1), value:v});});

d.sort(function(a,b){return a.date - b.date;});


var x = d3.scale.ordinal().rangeRoundBands([0, width],0.1);
var y = d3.scale.linear().range([height,0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format('%b'));
var yAxis = d3.svg.axis().scale(y).orient("left");

var svg = $target.append("svg")
      .attr("width",width+margin.left+margin.right)
      .attr("height",height+margin.top+margin.bottom)
      .append("g")
        .attr("transform","translate("+ margin.left + "," + margin.top +")");

x.domain(d3.time.months(d3.min(d,function(d){return d.date;}),d3.time.month.offset(d3.max(d,function(d){return d.date;}),1)));
y.domain([0, d3.max(d,function(d){return d.value;})]);


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

 var enter =  svg.selectAll(".bar")
      .data(d)
      .enter().append("g")
      .attr("class", "bar");

      enter.append('rect')
      .attr("x",function(d){return x(d.date);})
      .attr("width",x.rangeBand())
      .attr("y",function(d){return y(d.value);})
      .attr("height", function(d){return height - y(d.value);});

      enter.append('text')
        .attr("x",function(d){return x(d.date);})
        .attr("width",x.rangeBand())
        .attr("y",function(d){return y(d.value) -1 ;})
        .text(function(d){return d.value;});

}

formatUsername = function(str)
{
  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
