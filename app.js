/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var redis = require("redis");
var client = redis.createClient();
var users = require('./routes/user');
var groups = require('./routes/groups');
var vote = require('./routes/vote');
var path = require('path');
var socketio = require('socket.io');
var fs = require('fs');
var app = express();
var _ = require('underscore');
var mGroups = require("./custom_modules/groups");
var $ = require("jquery");
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
//app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req, res){
	res.sendfile(__dirname + '/views/index.html');
});

// Declaring Routes for API calls.
// Groups related URLs
app.get('/api/groups', groups.groups);
app.get('/api/groups/:groupId', groups.groupsById);
app.post('/api/groups/create', function(req, res){
  client.sadd('groups:' + req.body.user, req.body.name, redis.print);
  res.end('Group added successfully.');
});
app.post('/api/groups/remove', function(req, res){
  client.srem('groups:' + req.body.user, req.body.groupId);
  res.end();
});
app.post('/api/groups/members/remove', function(req, res){
 client.srem('groups:' + req.body.currentUserId + ':' + req.body.groupId + ':members' , 'user:' + req.body.removeUserId + ':information');
 res.end('User removed from group.');
});
app.get('/api/user/:userId', users.user);
app.get('/api/user/remove/:userId', function(req, res){
  client.del('user:9350438523:information', function(err, data) {
    res.end();
  });

});
/*app.post('/api/groups/create', groups.create);
app.post('/api/groups/modify/:groupId', groups.modify);
app.post('/api/groups/remove/:groupId', groups.remove);
// Users related URLs
app.get('/api/users', user.list);
app.post('/api/users/create', user.create);
app.post('/api/users/modify/:userId', user.modify);
app.post('/api/users/remove/:userId', user.remove);*/
// Vote related URLs
app.get('/api/vote/:fromUser/:toUser');
app.get('/api/vote/revoke/:fromUser/:toUser');
module.exports = app;
