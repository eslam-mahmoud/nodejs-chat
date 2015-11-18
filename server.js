//load express external module
var express = require('express');
//creat web server
var app = express();

//Create HTTP server 
var server = require('http').Server(app);
//Start the real time part in the app
var io = require('socket.io')(server);

//set the app port
var port = process.env.PORT || 3000;
//the room name which user is connected to
var param_room = null;
//set the static/public folder full path
var staticPath = __dirname + '/static';
//set the views/html folder full path
var htmlPath = __dirname + '/views';

//defin the static/public folder
app.use(express.static(staticPath));

//waite for GET requist on the / rout
app.get('/', function(req, res){
	console.log('Someone came to / rout.');
	res.sendFile(htmlPath + '/index.html');
});

//waite for requist on room name then render the page as the responce
app.get("/r/:room", function(req, res){
    param_room = req.params.room;
	console.log('Someone came to /r/' + param_room + ' rout.');
    res.sendFile(htmlPath + '/room.html');
});

//start the web server on the difiend port
//MUST BE ON SERVER NOT APP OR SOCKET.IO WILL NOT WORK
server.listen(port, function(){
	console.log('web server start on port ' + port);
});

//Every socket.io application begins with a connection handler
io.sockets.on('connection', function (socket) {
	console.log('New socket connection');
    //get room name from URL
    socket.room = param_room;
    //Add user to the room join/create
	socket.join(socket.room);

    //Send welcome message to the user(socket) how joined
    socket.emit('message', { message: 'Welcome to the chat' });

    //Listen when the user send a message
    socket.on('send', function (data) {
        //Send the data to all other users inclouding the one sent it
        io.sockets.in(socket.room).emit('message', {message: data.message, from: socket.username});
    });

    //Listen when the user send a his username
    socket.on('username', function (data) {
        //Send the data to all other users inclouding the one sent it
        socket.username = data.username;
    	//Send note to all users in the room
    	socket.broadcast.to(socket.room).emit('message',{ message: 'New user joined "'+socket.username+'"' });
    });

    //Send to all users a message because user disconnect
    socket.on('disconnect', function(){
		socket.leave(socket.room);
		socket.broadcast.to(socket.room).emit('message', {message: 'User "'+socket.username+'" disconnected'});
	});

	//Listen if user is typing
	socket.on('typing', function (data) {
        //Send the data to all other users the user name and typing status
       	socket.broadcast.to(socket.room).emit('typing', {typing: data.typing, username: socket.username});
    });
});
