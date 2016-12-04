/*
 * Author:        Pierre-Henry Soria <ph7software@gmail.com>
 * Copyright:     (c) 2012-2016, Pierre-Henry Soria. All Rights Reserved.
 * License:       MIT License
 */
'use strict';

// Set the default post
const PORT = 3000;
// Set default server address
const ADDRESS = 'localhost';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Sanitize the output
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

// Load index.html page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function(socket, username) {
    socket.on('new_user', function(username) {
        // Encode to HTML entities to avoid XSS flaws
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_user', username);
    });

    socket.on('message', function(message) {
        // Avoid XSS flaws
        message = ent.encode(message);
        socket.broadcast.emit('message', {username: socket.username, message: message});
    });
});

server.listen(process.env.PORT || 3000, ADDRESS, function() {
    console.log("Awesome! pH2Chitchat is running on: %s", ADDRESS + ':' + PORT);
});

// Expose app
exports = module.exports = app;
