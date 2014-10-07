var db  = require('./utils').db;
var scrape = require('./scrape');

module.exports.generate = function(req,res){

    var orderNumber, out = {}, coffeelist = [];

    db.coffeelist.find({}).sort({orderNumber:-1}).limit(1).exec(function(err,stuff){
        if (stuff && stuff.length){
            orderNumber = parseInt(stuff[0].orderNumber+1);}
        else {
            orderNumber = 1;
        }

    if(req.params.id){ orderNumber = parseInt(req.params.id);}

    scrape(writeToDataBase);

    function writeToDataBase(err,products)
    {
        if (err){
            res.status(500).send(err);
            return false;
        }
        var ul = {'orderNumber':orderNumber,'list':products};
        db.coffeelist.update({"orderNumber":orderNumber},ul,{upsert:true});
        res.render('coffeelist',{title:"New Coffees",orderNumber:orderNumber,coffees:products});
    }

    });

};
