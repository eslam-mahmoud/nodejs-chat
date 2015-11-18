//Define the socket that we will communicate on
var socket = false;
//list of users who are typing now
var typingList = {};
// // to stop the app from add the event more than one time
// var eventsAdded = false;

//Every thing will happen after the Dom loaded
$(document).ready(function() {
    //Join a room
    $('form#usernameForm').submit( function(e){
        e.preventDefault();
        //connect to the server
        socket = io().connect();
        //update the layout
        $('#roomLink').html(window.location.origin+window.location.pathname);
        $('#userName').hide();
        $('#chat').show();
        //Start the WebRTC to get video chat
        initWebRTC();
        socketIOEvents();
        sendUsername();
    });
});

function sendMessage() {
    //Send the message to the server
    var text = $('#message').val();
    socket.emit('send', { message: text });
    //Clear the input for the next message
    message.value = "";
    sendTyping(false);
}

function sendUsername() {
    //Send the username to the server
    socket.emit('username', { username: $('#name').val() });
    //Clear the input
    $('#name').val('');
}

function socketIOEvents(){
    //Listem when the server send a message to the user
    socket.on('message', function (data) {
        // console.log('Got message', data)
        if(data.message) {
            //Render the message and who sent it
            $('#messages').append($('<p>').html('<b>' + (data.from ? cleanText(data.from) : 'Server') + ': </b>' + cleanText(data.message)));
            updateScroll();
        } else {
            //log in the console if there was not any message
            console.log("There is a problem:", data);
        }
    });

    //Listem to typing status event
    socket.on('typing', function (data) {
        //Set the status on users list
        typingList[data.username] = data.typing;
        $('#typing').html('');
        //Loop on all users and get only the ones who are typing
        var typingUsers = [];
        for (username in typingList) {
            if (typingList[username]) {
                typingUsers.push(username);
            }
        }
        if (typingUsers.length) {
            $('#typing').html("Typing: ("+ cleanText(typingUsers.join(", ")) +")");                
        }
    });

    $("#message").keyup(function(e) {
        if ($('#message').val()) {
            sendTyping(true);
        } else {
            sendTyping(false);
        }
    });


    //Send message when the submit button clicked
    $('form#chatForm').submit( function(e){
        e.preventDefault();
        sendMessage();
        return false;
    });
}

//sendTyping function will fire when user type or clrear the input message
function sendTyping(isUserTyping) {
    socket.emit('typing', { typing: isUserTyping });
};

//encode HTML to render it 
function cleanText(text) {
    return $('<div/>').text(text).html();
}

//Keep messages div scrolled to bottom unless user scrolls up
function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

function initWebRTC() {
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video 
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos 
        remoteVideosEl: 'allVideos',
        // immediately ask for camera access 
        autoRequestMedia: true
    });

    // console.log(webrtc);

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
        // get the room name form the URL pathname 
        var room_name = window.location.pathname.replace('/r/', '');
        webrtc.joinRoom(room_name, function(){
            console.log('joined room ' + room_name);
        });
    });
}
