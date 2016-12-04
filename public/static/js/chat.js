/*
 * Author:        Pierre-Henry Soria <ph7software@gmail.com>
 * Copyright:     (c) 2012-2016, Pierre-Henry Soria. All Rights Reserved.
 * License:       MIT License
 */
'use strict';

const APP_URL = 'http://localhost:3000';

// Connect to socket.io
var socket = io.connect(APP_URL);

var username = prompt('Your Username?');
socket.emit('new_user', username);
document.title = username + ' - ' + document.title; // Change the default page name

socket.on('message', function(data) {
    displayMessage(data.username, data.message)
});

socket.on('new_user', function(username) {
    $('#chat-window').prepend('<p><em>' + username + ' has joined the chat room</em></p>');
});

// When someone send a message, send it to the server and display it
$('#chat-form').submit(function() {
    var message = $('#message').val();
    socket.emit('message', message);
    displayMessage(username, message);
    $('#message').val('').focus(); // Reset the input field and focus again the field
    return false;
});

function displayMessage(username, message)
{
    $('#chat-window').prepend('<p><strong>' + username + '</strong>: ' + message + '</p>');
}
