var sendInfo;
var socket = io.connect();
$(document).ready(function() {
    $('#userName').show();
    $('#submitUsername').show();
    $('#sendInformation').hide();
    $('#receivedUserName').hide();
    $('#receiveInformation').hide();
    $('#server1').center();

    $('#submitUsername').click(function() {
        if ($('#userName').val() !== null) {
            socket.emit('setPseudo', $('#userName').val());
            $('#userName').hide();
            $('#submitUsername').hide();
            $('#sendInformation').show();
            $('#receivedUserName').show();
            $('#receiveInformation').show();
            $('#server2').center();
        }
    });

    $('#sendInformation').click(function() {
        //unsub from incoming messages
        socket.removeAllListeners('message');

        //set up incoming messages
        sendInfo = setInterval(function() {
            socket.emit('message', $('#textInput').html());
        }, 2000);


    });

    $('#receiveInformation').click(function() {
        //clear the interval for sending messages
        if (sendInfo !== null || sendInfo !== undefined) {
            clearInterval(sendInfo);
            sendInfo = null;
        }

        //set up receiving messages
        socket.on('message', function(data) {
            if (data['pseudo'] == $('#receivedUserName').val()) {
                console.log(data['message']);
                $('#textInput').html(data['message']);
                reparse();
            }
        });
    });
});

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($("#logoDiv").height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($("#logoDiv").width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}