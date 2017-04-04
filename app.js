
/**
 * Module dependencies.
 */
//var rootURL = '/coffee';
var rootURL = '/';
module.exports.rootURL = rootURL;

var express = require('express');
var bodyParser = require('body-parser');
var ntlm = require('express-ntlm');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var user = require('./routes/user');
var genlist = require('./routes/genlist');
var admin = require('./routes/admin');
var stats = require('./routes/stats');
var path = require('path');
var utils = require('./routes/utils');
var secrets = require('./secrets');

var app = express();

app.locals.pretty = true;

// all environments
app.set('port', process.env.PORT || 9900);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(ntlm({'domain':secrets.domain,'domaincontroller':secrets.domaincontroller}));
app.use(bodyParser.urlencoded({'extended':true}));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.session());
app.use(utils.username);

// development only
app.use(errorHandler());

app.get(rootURL , user.hello);
app.post(rootURL + 'order', user.order);
app.post(rootURL + 'pay', admin.pay);
app.post(rootURL + 'own', admin.own);
app.get(rootURL + 'currentorder/:id?',admin.currentorder);
app.get(rootURL +'genlist/:id?',genlist.generate);
app.get(rootURL + 'stats',stats.display);
app.get(rootURL + 'statsinfo',stats.data);


app.use(rootURL,express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'),function(){
  console.log('Express server listening on port ' + app.get('port'));});
