
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path');

var routes = new Object();

routes['index'] = require('./routes/index');
routes['user']  = require('./routes/user');
routes['api']   = require('./routes/api');
routes['menuget']   = require('./routes/menuget.js');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public')); // This line.

});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index.index);
app.get('/users', routes.user.list);
app.get('/api/markers', routes.api.markers);
app.get('/api/markers/:id', routes.api.markerInfo);
app.get('/api/menu/', routes.menuget.markerInfo);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
