/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var Game = require('./custom_modules/game');
var redis = require("redis");
var client = redis.createClient();
var path = require('path');
var socketio = require('socket.io');

var fs = require('fs');
var app = express();
var _ = require('underscore');
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
app.get('/api/game/ticket', function(req, res) {
  var ticket = Game.getTicket();
  res.json(ticket);
  res.end();
});
// Showing an engine.
app.get('/api/game/engine', function(req, res) {
  res.json({sockets: socketio.sockets});
  res.end();
});

module.exports = app;
