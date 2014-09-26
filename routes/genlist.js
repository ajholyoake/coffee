var request = require('request').defaults({'proxy':'http://172.26.13.16:8080'}),
cheerio = require('cheerio'),
        fs      = require('fs');

var db  = require('./utils').db;


exports.generate = function(req,res){
    var orderNumber, out = {}, url, coffeelist = [];
    db.coffeelist.find({}).sort({orderNumber:-1}).limit(1).exec(function(err,stuff){
        if (stuff && stuff.length){
            orderNumber = parseInt(stuff[0].orderNumber+1);}
        else {
            orderNumber = 1;
        }

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

        var ii = 0;
        var coffeesdone = 0;

        var requestlistitem = function(ii){

            var c = coffeelist[ii];
            c = c.replace(/ /g,"-").toLowerCase();
            console.log('getting :' + url+c);
            request(url+c,
                    function (error,response,body){
                        if (error){
                            console.log(error);
                        }
                        if (!error){
                            console.log('We got a body');
                            var $ = cheerio.load(body);
                            var imgsrc = $('.nes_bloc-degrade-pop img').attr('src');
                            var price = $(".nes_list-price").html();
                            var intensity = $('.nes_active-intensity>p>strong').html();
                            var longdescription = '';
                            if (!intensity){
                                intensity = parseInt(body.substr(body.toLowerCase().indexOf('intensity')).match(/\d+/)[0],10);
                            } else {
                                intensity = parseInt(intensity);
                            }
                            var potential_desc = $('.scroll-bloc').find('p');
                            if(potential_desc.length){
                                longdescription = potential_desc.first().html();
                            } else {
                                longdescription = $('.scroll-bloc').text();
                            }
                            var aromaticprofile = $('p.nes_infos').html();
                            var types = [];
                            $("li.nes_ov-visible .nes_img-cup .info-bulle-css img").each(function(){types.push($(this).attr('alt'));});
                            if (price)
                            {
                                console.log(price);
                                price = price.match(/[0-9\.]{3,}/)[0];
                                console.log(price);
                            }

                            var curl = url + c;
                            if(price)
                            {out[coffeelist[ii]] = {img: 'https://www.nespresso.com' + imgsrc, price:price, url:curl, types:types, intensity:intensity, longdescription:longdescription, aromaticprofile:aromaticprofile };}
                        }
                        coffeesdone++;
                        console.log(out);

                        if(coffeesdone === coffeelist.length-1)
                        {
                            var ul = { "orderNumber": orderNumber,
                                "list": out};
                            db.coffeelist.update({"orderNumber":orderNumber},ul,{upsert:true});
                            res.send(JSON.stringify(ul,null,4));
                        }


                    }
            );

        };


        for(ii = 0; ii < coffeelist.length; ii++)
        {
            requestlistitem(ii);
        }
    }
    });
};

