function init () {
	var webrtc = new SimpleWebRTC({
	    // the id/element dom element that will hold "our" video 
	    localVideoEl: 'localVideo',
	    // the id/element dom element that will hold remote videos 
	    remoteVideosEl: 'remoteVideos',
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
