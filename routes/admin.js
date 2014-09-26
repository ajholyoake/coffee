var utils = require('./utils');
var orderNumber = module.parent.exports.orderNumber;


exports.currentorder = function(req,res){
  var db = utils.db;
  db.coffeelist.find({}).sort({orderNumber:1}).limit(1).exec(function(err,stuff){
    var ordno = parseInt(stuff[0].orderNumber);
    var maxordno = ordno;
    if(req.params.id){ ordno = req.params.id;}
    ordno = parseInt(ordno);
    db.coffeelist.find({"orderNumber":ordno}).exec(function(err,coffees){
      db.orders.find({"orderNumber":ordno}).sort({username:-1}).exec(function(err,orders){
        coffees = coffees[0].list;
        var coffeelist = [];
        var coffeeprices = [];
        var totals = [];
        var paid   = [];
        var totalCost = 0;
        var usersummary = {};
        var ii,jj;
        var capsuleNumber = 0;
        var current_user = utils.formatUsername(req.headers['x-iisnode-auth_user']);

        for(ii in coffees){
          coffeelist.push(ii);
          coffeeprices.push(coffees[ii].price);
        }

        for (ii = 0; ii< coffeelist.length;ii++){
          totals[ii] = 0;
        }

        var orderowner = (orders[0] && orders[0].owner) ? utils.formatUsername(orders[0].owner) : false;

        for (ii = 0; ii < orders.length; ii++){
          var fu = utils.formatUsername(orders[ii].username);
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
            usersummary[fu].push({paid:parseFloat(orders[ii].paid).toFixed(2),id:orders[ii]._id});
            if (usercost === 0)
              {delete usersummary[fu]; }
        }

        for (ii = 0; ii < totals.length; ii++)
        {
          totalCost += totals[ii]*coffeeprices[ii];
          capsuleNumber += totals[ii];
        }
        totalCost = totalCost.toFixed(2);

        db.orders.find({"username":req.headers['x-iisnode-auth_user']}).sort({orderNumber:-1}).exec(function(err,userorders){
          var ordlist = [];
          userorders.forEach(function(el){
          var ncoffees = 0;
          for(var key in el.list){ ncoffees += el.list[key];}
          if(ncoffees > 0){
          ordlist.push(el.orderNumber);
          }
          });
          res.render('currentorder',{title:"Current Order", coffees:coffeelist,totals:totals,usersummary:usersummary,totalCost:totalCost,orderNumber:ordno, capsuleNumber:capsuleNumber,owner:orderowner,user:current_user,owns:current_user === orderowner, userorders:ordlist,lastorder:maxordno===ordno});
        });
      });

    });
  });
};


exports.own = function(req,res){
  var current_user = req.headers['x-iisnode-auth_user'];
  if(req.body){
    var ordno = parseFloat(req.body.orderNumber);
    if(req.body.take === 'true'){
      //Own the order

      db.orders.update({"orderNumber":ordno},{"$set":{owner:current_user}},{multi:true},function(a,b){ console.log('thing'); });
    } else  {
      //Give back the order
      db.orders.update({orderNumber:ordno},{"$set":{"owner":false}},{multi:true},function(a,b){console.log('thing');});
    }
  }
  res.send('Done');
};


exports.pay = function(req,res){
  var current_user = utils.formatUsername(req.headers['x-iisnode-auth_user']);
  if(req.body){
    for(var ii = 0; ii <req.body.list.length; ii++)
    {

      db.orders.update({_id:req.body.list[ii][0]},{"$set":{paid:req.body.list[ii][1],owner:current_user}});
    }
  }
};
