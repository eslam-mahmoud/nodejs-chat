$(document).ready(function() {
    //create room
    $('form#roomForm').submit(function(e){
        e.preventDefault();
        var room = $('#room').val();
        window.location.replace("/r/"+room.replace(' ', '-'));
        return false;
    });
});
