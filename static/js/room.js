//Every thing will happen after the Dom loaded
$(document).ready(function() {
    //Join a room
    $('form#usernameForm').submit( function(e){
        e.preventDefault();
        //set the layout
        $('#roomLink').html(window.location.origin+window.location.pathname);
        $('#userName').hide();
        $('#chat').show();
        //Start the WebRTC to get video chat
        init();
    });
});

function init () {
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
