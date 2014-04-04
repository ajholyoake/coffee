var data = {};
$(function(){

$.get('/coffee/statsinfo',function(d){
data = d;
});

})
