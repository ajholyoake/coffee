

$(function(){

var updateTotal = function(){
var total = 0;
var ntotal = 0;
$('.quantitybox').each(function(ind,el){updateItemTotals(el); ntotal+=parseInt($(this).val());});
$('.totalbox').each(function(){ total += parseFloat($(this).text().replace(/[^0-9\.]/,""));});
$('.bigtotalnumber').text(ntotal);
$('.bigtotal').html('&pound; ' + total.toFixed(2));


};


var updateItemTotals = function(that){

var $row = $(that).parent().parent();
var mul = $(that).val();
var price = $row.find('.pricebox').text().replace(/[^0-9\.]/,"");
var price = price * mul;
$row.find('.totalbox').html('&pound; '+ price.toFixed(2));
};

$('button.close').click(function(){$(this).parent().fadeOut()});
$('.quantitybox').bind('keypress', function(){
    setTimeout(updateTotal,1)
    });



//$('.quantitybox').each(function(){
//$(this).change(function(){updateTotal()})});
updateTotal();

$('#orderButton').click(function(){
var d = {};
var names = [];
var quantities = [];
var goodorder = true;
$('.names').each(function(){names.push($(this).text())});
$('.quantitybox').each(function(){ quantities.push($(this).val())});



for(var ii = 0; ii < names.length; ii++){
d[names[ii]] = quantities[ii];
if (quantities[ii]%10 !== 0){
goodorder = false;
}
}

if (!goodorder){
$('#messageText').html('Only multiples of 10 for each coffee!');
$('#infoAlert').removeClass().addClass('alert alert-error').fadeIn();

} else {

$.post('coffee/order',d,function(data,txtStatus,jqXHR){
$('#messageText').html('Sending to the server. If you reload, your order should still be here.');
$('#infoAlert').removeClass().addClass('alert alert-info').fadeIn();
},'json');

}

});

});
