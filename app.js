/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var groups = require('./routes/groups');
var http = require('http');
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
	res.render('index');
});
app.get('/groups', groups.list);
app.get('/groups/create', groups.create);
app.post('/groups/create/save', groups.savegroup);
app.get('/users', user.list);
app.get('/users/register', user.register);
app.post('/users/register/save', user.save);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server);
var people = [];
var rooms = [];
io.set("log level", 1);  

io.sockets.on("connection", function(socket) {
	if (rooms.length)
		{
			io.sockets.emit("rooms", {rooms: rooms});
		}
		

	// Creating the room.
	socket.on('createroom', function(room){
		if (!_.contains(rooms, room))
		{
			rooms.push(room);
			if (rooms.length)
			{
				io.sockets.emit("rooms", {rooms: rooms});
			}
		}
	
		console.log(socket.manager.rooms);
	});
	
	// Joining the room.
	socket.on('joinroom', function(roomid) {
		var room = rooms[roomid];
		socket.room = room;
		socket.join(socket.room);
		people[socket.id] = {room: rooms[roomid], roomid: roomid};
		
	});
	console.log(people);

	
	
});

io.sockets.on("disconnect", function(socket) {
	rooms = [];
});
