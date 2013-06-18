var request = require('request'),
cheerio = require('cheerio'),
mongo   = require('mongoskin');


exports.generate = function(req,res){
  var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  var orderNumber, out = {}, url, coffeelist = [];
  db.collection('coffeelist').find({},{limit:1, sort:[['orderNumber',-1]]}).toArray(function(err,stuff){
    orderNumber = parseInt(stuff[0].orderNumber);
    if(req.params.id){ orderNumber = parseInt(req.params.id);}

    out = {};
    url = "https://www.nespresso.com/uk/en/quickView/";
    coffeelist = 
    ["Ristretto",
      "Arpeggio",
      "Roma",
      "Livanto",
      "Capriccio",
      "Volluto",
      "Cosi",
      "Indriya from India",
      "Rosabaya de Colombia",
      "Dulsao do Brasil",
      "Decaffeinato Intenso",
      "Decaffeinato Lungo",
      "Decaffeinato",
      "Fortissio Lungo",
      "Vivalto Lungo",
      "Finezzo Lungo",
      "Vanilio",
      "Caramelito",
      "Ciocattino"];
    var ii = 0;

    var requestlistitem = function(ii){


      var c = coffeelist[ii];
      c = c.replace(/ /g,"-").toLowerCase();

      request(url+c,function(error,response,body){
        var $ = cheerio.load(body);
        var imgsrc = $('.nes_bloc-degrade-pop img').attr('src');
        var price = $(".nes_list-price").html();
        var types = [];
        $("li.nes_ov-visible .nes_img-cup .info-bulle-css img").each(function(){types.push($(this).attr('alt'));});
        if (price)
          {price = price.match(/[0-9\.]+/)[0];
          }

          var curl = url + c;
          if(price)
          {out[coffeelist[ii]] = {img: 'https://www.nespresso.com' + imgsrc, price:price, url:curl, types:types }};

            if (ii === coffeelist.length-1){
              var ul = { "orderNumber": orderNumber,
                "list": out};
                db.collection('coffeelist').update({"orderNumber":orderNumber},ul,{upsert:true});
                res.send(JSON.stringify(ul,null,4));
            }else{
              ii++;
              requestlistitem(ii);
            }


      });

    };

    requestlistitem(ii);
  });
};
