'use strict'

let chatUtilInstance = null;
class ChatUtil extends Util{
    constructor() {
        super();
        if(!chatUtilInstance){
            chatUtilInstance = this;
        }
        return chatUtilInstance;
    }

    initChat(wsChatServer){
        var wsUri = wsChatServer;
        var websocket = new WebSocket(wsUri);
        var myname;

        websocket.onopen = function(ev) { // connection is open
            $('#message_box').append("<div class=\"system_msg\">Connected!</div>"); //notify user
        }

        $('#send-btn').click(function(){ //use clicks message send button
            var mymessage = $('#message').val(); //get message text
            myname = $('#name').val(); //get user name

            if(myname == ""){ //empty name?
                alert("Enter your Name please!");
                return;
            }
            if(mymessage == ""){ //emtpy message?
                alert("Enter Some message Please!");
                return;
            }
            document.getElementById("name").style.visibility = "hidden";

            var objDiv = document.getElementById("message_box");
            objDiv.scrollTop = objDiv.scrollHeight;
            //prepare json data
            var msg = {
                message: mymessage,
                name: myname,
                color : '<?php echo $colours[$user_colour]; ?>'
            };
            //convert and send data to server
            websocket.send(JSON.stringify(msg));
        });

        //#### Message received from server?
        websocket.onmessage = function(ev) {
            var msg = JSON.parse(ev.data); //PHP sends Json data
            var type = msg.type; //message type
            var umsg = msg.message; //message text
            var uname = msg.name; //user name
            var ucolor = msg.color; //color

            if(type == 'usermsg' && uname != null)
            {
                $('#message_box').append("<div><span class=\"user_name\" style=\"color:#"+ucolor+"\">"+uname+"</span> : <span class=\"user_message\">"+umsg+"</span></div>");
                //voice to text only what the other says
                if(sessionStorage.getItem("utils").indexOf("ttv") != -1 ){
                    if(uname != myname){
                        let u = new SpeechSynthesisUtterance(uname + "said" + umsg);
                        u.lang = 'en-US';
                        let speaker = new SpeechUtil();
                        speaker.startSpeak(u);
                    }
                }
            }
            if(type == 'system' && umsg != null)
            {
                $('#message_box').append("<div class=\"system_msg\">"+umsg+"</div>");
            }

            $('#message').val(''); //reset text

            var objDiv = document.getElementById("message_box");
            objDiv.scrollTop = objDiv.scrollHeight;
        };

        websocket.onerror   = function(ev){$('#message_box').append("<div class=\"system_error\">Error Occurred - "+ev.data+"</div>");};
        websocket.onclose   = function(ev){$('#message_box').append("<div class=\"system_msg\">Connection Closed</div>");};
    }

}