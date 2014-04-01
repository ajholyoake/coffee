var request = require('request'),
cheerio = require('cheerio'),
mongo   = require('mongoskin');
fs      = require('fs');


exports.generate = function(req,res){
  var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  var orderNumber, out = {}, url, coffeelist = [];
  db.collection('coffeelist').find({},{limit:1, sort:[['orderNumber',-1]]}).toArray(function(err,stuff){
    orderNumber = parseInt(stuff[0].orderNumber+1);
    if(req.params.id){ orderNumber = parseInt(req.params.id);}

    var out = {};
    var url = "https://www.nespresso.com/uk/en/quickView/";
    var coffeeFile = "coffeelist.txt";
    fs.readFile(coffeeFile,'utf8',getCoffees);
   
   function getCoffees(error,coffeelistcontents){
    
    var coffeelist = coffeelistcontents.split(/\n|\r\n/).map(function(x){
      return x.split('#')[0].trim();
    }).filter(function(x){ 
    return /\S/.test(x); });

//    coffeelist = 
//    [
//      "Kazaar",
//      "Dharkan Coffee",
//      "Ristretto",
//      "Arpeggio",
//      "Roma",
//      "Livanto",
//      "Capriccio",
//      "Volluto",
//      "Cosi",
//      "Indriya from India",
//      "Rosabaya de Colombia",
//      "Dulsao do Brasil",
//      "Bukeela Ka Ethiopia",
//      "Decaffeinato Intenso",
//      "Decaffeinato Lungo",
//      "Decaffeinato",
//      "Fortissio Lungo",
//      "Vivalto Lungo",
//      "Linizio Lungo",
//      "Vanilio",
//      "Caramelito",
//      "Ciocattino"];
    var ii = 0;
    var coffeesdone = 0;
    
    var requestlistitem = function(ii){


      var c = coffeelist[ii];
      c = c.replace(/ /g,"-").toLowerCase();

      request(url+c,function(error,response,body){
        if (!error){
        
        var $ = cheerio.load(body);
        var imgsrc = $('.nes_bloc-degrade-pop img').attr('src');
        var price = $(".nes_list-price").html();
        var intensity = $('.nes_active-intensity>p>strong').html();
        var potential_desc = $('.scroll-bloc').find('p');
        if(potential_desc.length){
             var longdescription = potential_desc.first().html();
             } else {
             var longdescription = $('.scroll-bloc').text();
             }
        var aromaticprofile = $('p.nes_infos').html();
        var types = [];
        $("li.nes_ov-visible .nes_img-cup .info-bulle-css img").each(function(){types.push($(this).attr('alt'));});
        if (price)
          {price = price.match(/[0-9\.]+/)[0];
          }

          var curl = url + c;
          if(price)
          {out[coffeelist[ii]] = {img: 'https://www.nespresso.com' + imgsrc, price:price, url:curl, types:types, intensity:intensity, longdescription:longdescription, aromaticprofile:aromaticprofile }};
        }
            coffeesdone++;

            if(coffeesdone === coffeelist.length-1)
            {
              var ul = { "orderNumber": orderNumber,
                "list": out};
                db.collection('coffeelist').update({"orderNumber":orderNumber},ul,{upsert:true});
                res.send(JSON.stringify(ul,null,4));
            }


      });

    };
    for(var ii = 0; ii < coffeelist.length; ii++)
    {
    requestlistitem(ii);
    }
  }
  });
};
