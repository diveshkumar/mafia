/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var groups = require('./routes/groups');
var vote = require('./routes/vote');
var path = require('path');
var socketio = require('socket.io');
var fs = require('fs');
var app = express();
var _ = require('underscore');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req, res){
	res.sendfile(__dirname + '/views/index.html');
});

// Declaring Routes for API calls.
// Groups related URLs
app.get('/groups', groups.list);
app.post('/groups/create', groups.create);
app.post('/groups/modify/:groupId', groups.modify);
app.post('/groups/remove/:groupId', groups.remove);
// Users related URLs
app.get('/users', user.list);
app.post('/users/create', user.create);
app.post('/users/modify/:userId', user.modify);
app.post('/users/remove/:userId', user.remove);
// Vote related URLs
app.get('/vote/:fromUser/:toUser');
app.get('/vote/revoke/:fromUser/:toUser');
module.exports = app;
