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
var cell = $(this),
 newText = cell.text(),
 height = cell.height(),
 width = cell.width(),
 newDiv = $('<div>', { height: width, width: height }),
 newInnerDiv = $('<div>', { text: newText, 'class': 'rotated' });

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

$('table.table').floatThead();

$('.paybox').each(function(ind,el){
  p = updateItemTotals(el);
  totalremaining += p[0];
  totalcost += p[1];
  totalpaid += p[2];
  });

var hrefstr = 'mailto:aholyoake@mercedesamgf1.com';
hrefstr += 'body=' + encodeURIComponent('<table><tbody><tr><td>yo</td><td> dfs</td></tr></tbody></table>');
hrefstr += '&subject=' + encodeURIComponent('Coffee Order');

$('#totalPaid').html('&pound; ' + totalpaid.toFixed(2));
$('#totalRemaining').html('&pound; ' + totalremaining.toFixed(2));
$('#reminder').attr('href',hrefstr);

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
    setTimeout(updateTotal,1);
    });

updateTotal();

$('#savebtn').click(function(){
var ar = {list:[]};
$('.paybox').each(function(){
ar.list.push([$(this).attr('data-id'), $(this).val()]);
});
$.post('/coffee/pay',ar,function(data,txtStatus,jqXHR){
});
});

$('#takeownership').click(function(){
var ar = {};
ar.take = true;
ar.orderNumber = $('#takeownership').data('id');

$.post('/coffee/own',ar,function(data,txtStatus,jqXHR){
window.location.reload(true);
});


});

$('#finalizebtn').click(function(){

//Code to display a box!
$('#newOrderModal').modal({'show':true});

$.get('/coffee/genlist',function(data,txtStatus,jqXHr){
    if(txtStatus === 'success'){
        console.log(data);
        $('#newOrderModal').modal('hide');
        $('#finalizebtn').hide();
    }
});

});

$('#disown').click(function(){
var ar = {};
ar.take = false;
ar.orderNumber = $('#disown').data('id');

$.post('/coffee/own',ar,function(data,txtStatus,jqXHR){
window.location.reload(true);
});
});
});
