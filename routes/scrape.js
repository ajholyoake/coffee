var cheerio = require('cheerio');
var request = require('request');//.defaults({proxy:'http://172.26.13.17:8080'});
var homesite = 'http://www.nespresso.com';
var homeurl = homesite + '/uk/en/pages/grands-crus-coffee-range';
var db = require('./utils').db;

module.exports = function(cb){

var products = {};
var nproducts = 0;
var nproducts_parsed = 0;
request.get(homeurl,parsePage);

function parsePage(err,response,body){
    if (err || response.statusCode !== 200){
        cb({error:err,msg:'Couldnt get the main page',code:response.statusCode,body:body});
        return false;
    }
    var $ = cheerio.load(body);
    var product_list = $('.product');
    nproducts = product_list.length;
    product_list.each(function(){parseProduct($(this));});

}

function parseProduct(node){
    var url = parseUrl(node.data('qv'));
    request.get(url,function(err,response,body)
        {
            if(err){
                cb(err,'Couldnt get' + url);
                return false;
            }
            var $ = cheerio.load(body);
            var product = {};
            product.img = homesite + $('.nes_bloc-degrade-pop img').attr('src');
            product.longdescription = parseDescription($);
            product.types = parseTypes($);
            product.price = parsePrice($);
            product.url = url;
            product.aromaticprofile = node.data('flavour');
            product.intensity = node.data('intensity');
            product.name = node.data('product-name');
            products[url.split('/').slice(-1)[0]] = product;
            nproducts_parsed++;
            if (nproducts_parsed === nproducts){
                cb(err,products);
            }
        }
        );
}

function parseUrl(url){
    return homesite + url.substr(0,url.indexOf('?'));
}

function parsePrice($){
    var price = $(".nes_list-price").html();
        if (price) price = price.match(/[0-9\.]{3,}/)[0];
    return price;
}


function parseDescription($){
  var potential = $('.scroll-block').find('p');
  if(potential.length){
    return potential.first().html();
  } else {
    return $('.scroll-block').text();
  }
}

function parseTypes($){
    var types = [];
    $("li.nes_ov-visible .nes_img-cup .info-bulle-css img").each(function(){types.push($(this).attr('alt'));});
    return types;
}

};
