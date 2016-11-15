var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//==============================================================================
/* TODO -> Connect to DB */
var mongoose = require('mongoose');

//==============================================================================


var store = require('./routes/store');
//==============================================================================

var io = require('socket.io').listen(server);




var app = express();
var server = require('http').createServer(app);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html'
});
    
io.sockets.on('connection', function(socket){
        connections.push(socket);
    console.log('Connected: %s sockets connected',connections.length);
    
    // Disconnect
    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
    connections.splice(connections.indexOf(socket),1)
    console.log('Disconnected: %s sockets connected'connections.length);
    });
   
    //send answer
    socket.on('send message', function(data){
        console.log(data);
       io.sockets.emit('new message',{msg: data, user: socket.username}); 
    });
    
    //new user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
});



