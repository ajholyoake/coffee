var mongo = require('mongoskin');

function formatUsername(str)
{
  return str.substr(str.indexOf('\\')+1).replace(/\./g,' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.hello = function(req, res){
  var username = req.headers['x-iisnode-auth_user'];
  var pretty_username = formatUsername(username);

var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  db.collection('coffeelist').find({},{limit:1, sort:[['orderNumber',-1]]}).toArray(function(err,stuff){
  var orderNumber = stuff[0].orderNumber;

  db.collection('coffeelist').find({"orderNumber":orderNumber}).toArray(function(err,coffees){
    db.collection('orders').find({"orderNumber":orderNumber,"username":username}).toArray(function(err,userOrder){
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
var db = mongo.db('localhost:27017/coffee?auto_reconnect');
  var username = req.headers['x-iisnode-auth_user'];
  if (req.body){
  db.collection('coffeelist').find({},{limit:1, sort:[['orderNumber',-1]]}).toArray(function(err,stuff){
  var orderNumber = parseInt(stuff[0].orderNumber);

    db.collection('coffeelist').find({"orderNumber":orderNumber}).toArray(function(err,coffees){
      
      //Check everything is OK
      coffees = coffees[0].list;   
      var data = {list:{}},ii;
      for (ii in coffees)
      {
        data.list[ii] = req.body[ii];
      }
      data.username = username;
      data.orderNumber = orderNumber;

      db.collection('orders').update({"orderNumber":orderNumber, "username":username},data,{upsert:true},function(err)
      { });
      res.send({ok:true});
  
    });
    });
  } else {
    res.send({ok:false, message:'No Body'});
  }
};

