var db = require('./utils').db;


function formatUsername(str)
{
  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.hello = function(req, res){
  var username = req.headers['x-iisnode-auth_user'];
  var pretty_username = formatUsername(username);
  db.coffeelist.find({}).sort({'orderNumber':-1}).limit(1).exec(function(err,stuff){
  var orderNumber = stuff[0].orderNumber;

  db.coffeelist.find({"orderNumber":orderNumber}).exec(function(err,coffees){
    db.orders.find({"orderNumber":orderNumber,"username":username}).exec(function(err,userOrder){
    var ii, displayOrder = {};
      coffees = coffees[0].list;
      userOrder = userOrder[0];
      displayOrder = {};
      for(ii in coffees)
      {
        displayOrder[ii] = coffees[ii];
        if(userOrder && userOrder.list && userOrder.list[ii])
          { displayOrder[ii].count = userOrder.list[ii];
          } else {
            displayOrder[ii].count = 0;
          }
          displayOrder[ii].types = displayOrder[ii].types.join(', ');
      }


      res.render('user',{username:pretty_username, displayOrder:displayOrder, title:'Hot, Black and Wet Stuff'});
      //res.send("respond with a resource");

    });

  });
  });
};


exports.order = function(req,res){
  var username = req.headers['x-iisnode-auth_user'];
  if (req.body){
  db.coffeelist.find({}).sort({orderNumber:-1}).limit(1).exec(function(err,stuff){
  var orderNumber = parseInt(stuff[0].orderNumber);

    db.coffeelist.find({"orderNumber":orderNumber}).exec(function(err,coffees){

      //Check everything is OK
      coffees = coffees[0].list;
      var data = {list:{}},ii;
      for (ii in coffees)
      {
        data.list[ii] = req.body[ii];
      }
      data.username = username;
      data.orderNumber = orderNumber;

      db.orders.update({"orderNumber":orderNumber, "username":username},data,{upsert:true},function(err)
      {
      res.send({ok:true});
      });

    });
    });
  } else {
    res.send({ok:false, message:'No Body'});
  }
};

