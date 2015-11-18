//load express external module
var express = require('express');
//load EasyRTC external module
var easyrtc = require("easyrtc");
//creat web server
var app = express();
// //Create HTTP server 
// var http = require('http').Server(app);
// //Start the real time part in the app
// var io = require('socket.io')(http);
// // Start EasyRTC server
// var rtc = easyrtc.listen(app, io);

//set the app port
var port = process.env.PORT || 3000;
//the room name which user is connected to
var param_room = null;
//set the static folder full path
var staticPath = __dirname+'/static';

//defin the static/public folder
app.use(express.static(staticPath));

//waite for GET requist on the / rout
app.get('/', function(req, res){
	console.log('Someone came to / rout.');
	res.send('Hello world :)');
});

//waite for GET requist on the /aboutus rout
app.get('/aboutus', function(req, res){
	console.log('Someone came to /aboutus rout.');
	res.sendFile(staticPath+'/aboutus.html');
});

//waite for requist on room name then render the page as the responce
app.get("/r/:room", function(req, res){
    param_room = req.params.room;
	console.log('Someone came to /r/' + param_room + ' rout.');
    res.sendFile(staticPath + '/room.html');
});

//start the web server on the difiend port
app.listen(port, function(){
	console.log('web server start on port ' + port);
});

// //listen when new connection happen on socket
// io.sockets.on('connection', function (socket) {
// 	console.log('New socket connection id ' + socket.id);
// });
