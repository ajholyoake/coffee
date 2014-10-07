
/**
 * Module dependencies.
 */
var rootURL = '/coffee';
module.exports.rootURL = rootURL;

var express = require('express')
  , user = require('./routes/user')
  , genlist = require('./routes/genlist')
  , admin   = require('./routes/admin')
  , stats   = require('./routes/stats')
  , http = require('http')
  , path = require('path')
  , utils = require('./routes/utils');

var app = express();

app.locals.pretty = true;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(utils.username);
app.use(app.router);
app.use(rootURL,express.static(path.join(__dirname, 'public')));
app.use(rootURL + '/iisnode',express.static(path.join(__dirname,'iisnode')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get(rootURL , user.hello);
app.post(rootURL + '/order', user.order);
app.post(rootURL + '/pay', admin.pay);
app.post(rootURL + '/own', admin.own);
app.get(rootURL + '/currentorder/:id?',admin.currentorder);
app.get(rootURL +'/genlist/:id?',genlist.generate);
app.get(rootURL + '/stats',stats.display);
app.get(rootURL + '/statsinfo',stats.data);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
