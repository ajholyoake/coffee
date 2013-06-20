(function ($) {
  $.fn.rotateTableCellContent = function (options) {
  /*
Version 1.0
7/2011
Written by David Votrubec (davidjs.com) and
Michal Tehnik (@Mictech) for ST-Software.com
*/

var cssClass = ((options) ? options.className : false) || "vertical";

var cellsToRotate = $('.' + cssClass, this);

var betterCells = [];
cellsToRotate.each(function () {
var cell = $(this)
, newText = cell.text()
, height = cell.height()
, width = cell.width()
, newDiv = $('<div>', { height: width, width: height })
, newInnerDiv = $('<div>', { text: newText, 'class': 'rotated' });

newInnerDiv.css('-webkit-transform-origin', (width / 2) + 'px ' + (width / 2) + 'px');
newInnerDiv.css('-moz-transform-origin', (width / 2) + 'px ' + (width / 2) + 'px');
newDiv.append(newInnerDiv);

betterCells.push(newDiv);
});

cellsToRotate.each(function (i) {
$(this).html(betterCells[i]);
});
};
})(jQuery);



$(function(){

var updateTotal = function(){
var totalpaid = 0;
var totalremaining = 0;
var totalcost = 0;
var p;
$('.paybox').each(function(ind,el){
  p = updateItemTotals(el); 
  totalremaining += p[0];
  totalcost += p[1];
  totalpaid += p[2];
  });


$('#totalPaid').html('&pound; ' + totalpaid.toFixed(2));
$('#totalRemaining').html('&pound; ' + totalremaining.toFixed(2));


};



var updateItemTotals = function(that){
var $row = $(that).parent().parent();
var paid = parseFloat($(that).val());
var cost = parseFloat($(that).parent().prev().text());
var remaining = cost - paid;
$row.find('.payremaining').html('&pound; '+ remaining.toFixed(2));
return [remaining,cost,paid];
};


$('.ordertable').rotateTableCellContent();

$('.paybox').bind('keypress', function(){
    setTimeout(updateTotal,1)
    });

updateTotal();

$('#savebtn').click(function(){
var ar = {list:[]};
$('.paybox').each(function(){
ar.list.push([$(this).attr('data-id'), $(this).val()])
});

$.post('/coffee/pay',ar,function(data,txtStatus,jqXHR){

});



});

});
