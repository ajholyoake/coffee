var mongo = require('mongoskin');

var orderNumber = module.parent.exports.orderNumber;

function formatUsername(str)
{
  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.currentorder = function(req,res){
  var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  db.collection('coffeelist').find({},{limit:1, sort:[['orderNumber',-1]]}).toArray(function(err,stuff){
    var ordno = parseInt(stuff[0].orderNumber);
    if(req.params.id){ ordno = req.params.id;} 
    ordno = parseInt(ordno);
    db.collection('coffeelist').find({"orderNumber":ordno}).toArray(function(err,coffees){
      db.collection('orders').find({"orderNumber":ordno},{sort:[['username',-1]]}).toArray(function(err,orders){
        coffees = coffees[0].list;
        var coffeelist = [];
        var coffeeprices = [];
        var totals = [];
        var paid   = [];
        var totalCost = 0;
        var usersummary = {};
        var ii,jj;
        var capsuleNumber = 0;

        for(ii in coffees){
          coffeelist.push(ii);
          coffeeprices.push(coffees[ii].price);
        }

        for (ii = 0; ii< coffeelist.length;ii++){
          totals[ii] = 0;
        }

        for (ii = 0; ii < orders.length; ii++){
          var fu = formatUsername(orders[ii].username);
          var usercost = 0;

          usersummary[fu] = [];

          for (jj = 0; jj < coffeelist.length;jj++)
            { var cname = coffeelist[jj];
              if(orders[ii].list[cname])
                { totals[jj] += parseInt(orders[ii].list[cname]);
                  usersummary[fu].push(orders[ii].list[cname]);
                  usercost += orders[ii].list[cname]*coffeeprices[jj];
                } else { 
                  usersummary[fu].push("");
                }
            }
            usersummary[fu].push(usercost.toFixed(2));
            if (!orders[ii].paid)  orders[ii].paid = 0;
            usersummary[fu].push({paid:parseFloat(orders[ii].paid).toFixed(2),id:db.bson_serializer.ObjectID(orders[ii]._id.id).toHexString()});
            if (usercost === 0)
              {delete usersummary[fu]; }
        }

        for (ii = 0; ii < totals.length; ii++)
        {
          totalCost += totals[ii]*coffeeprices[ii];
          capsuleNumber += totals[ii];
        }
        totalCost = totalCost.toFixed(2);

        res.render('currentorder',{title:"Current Order", coffees:coffeelist,totals:totals,usersummary:usersummary,totalCost:totalCost,orderNumber:ordno, capsuleNumber:capsuleNumber});
      });

    });
  });
};


exports.pay = function(req,res){
var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  if(req.body){
    for(var ii = 0; ii <req.body.list.length; ii++)
    {
       db.collection('orders').updateById(req.body.list[ii][0],{"$set":{paid:req.body.list[ii][1]}});
    }
}
};
