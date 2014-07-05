var app = require('./app');
var http = require('http');
var socketio = require('socket.io');
var game = require('./custom_modules/game');

var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
var socketsMap = {};
var io = socketio.listen(server);
var clientCount = 0;
io.set('error log', 1);
io.sockets.on("connection", function(socket) {

  var numbers = game.arrayShuffle(game.generateNumbers());
  var len = numbers.length;
  var userId = socket.id;
  socketsMap[userId] = socket.id;
  console.log(socketsMap);
  socket.on('send', function(data) {
    //io.sockets.emit('drawNumber', {socket: socket.id, data: numbers.pop(), total: numbers.length});
  });

  io.sockets.emit('myTicket', {socket: socket.id});

  socket.on('currentTicket', function(data) {
    io.sockets.emit('anotherTicket', {sockets: socketsMap, socket: socket.id});
  });

  socket.on('getMoreTicket', function(data) {
    io.sockets.emit('appendTicket', {socket: socket.id});
  })

});


