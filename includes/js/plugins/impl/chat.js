class Chat extends Plugin{

    constructor(domElement){
        super();
        this.domElement = domElement;
        this.inputFactory = new InputFactory();
        this.buttonFactory = new ButtonFactory();
        this.chatUtil = new ChatUtil();
    }

    draw(wsChatServer){

        this.domElement.innerHTML +='<div class="chatmain">'+
            '<div class="messages">'+
            '<div class="above"  id="message_box">'+
            '</div>'+
            '<div class="bellow">'+
            '<tg-input class="text" name="name" id="name" placeholder="Your Name" /></tg-input>'+
            '<tg-input class="text" name="message" id="message" placeholder="Message" /></tg-input>'+
            // '<section class="text"> </section>'+1
            '<tg-button></tg-button>'+
            '</div>'+
            '</div>'+
            '<div class="loggedin">'+
            '<section class="me">'+
            '<img class="mypic" src="images/anyone.png">'+
            '<p class="name">Me me: </p>'+
            '<p class="status">Online</hp>'+
            '</section>'+
            '<section class="others">'+
            '</section>'+
            '</div>'+
            '<div class="clear"></div>'+
            '</div>';

        let inputOption = {
            inputAttribute : {

            },
            commands: {
                name : {

                }

            }
        }

        this.options = eval(this.domElement.getAttribute("options"));

        let inputs = this.domElement.getElementsByTagName("tg-input");

        for(let i = 0; i < inputs.length; i++){
            let attributes = inputs[i].attributes;
            if(i==0){
                inputOption.commands["name"]["name"] = this.options.commands.name.name;
                inputOption.commands["name"]["func"] = this.options.commands.name.func;
            }
            else{
                inputOption.commands["name"]["name"] = this.options.commands.message.name;
                inputOption.commands["name"]["func"] = this.options.commands.message.func;
            }


            while(inputs[i].attributes.length > 0){
                let attributeName = attributes[0].nodeName;
                inputOption.inputAttribute[attributeName] = attributes[0].nodeValue;
                inputs[i].removeAttribute(attributeName);
            }
            this.inputFactory.createObject(inputs[i],inputOption);
        }

        let tgButton = this.domElement.getElementsByTagName("tg-button");

        var buttonSend = {
            buttonAttribute : {
                id : "send-btn",
                class : "send"
            },
            buttonValue : "שלח",
            onClickFunc  : {

            }
        }
        buttonSend["onClickFunc"]["func"] = this.options.onClickFunc.func;
        this.buttonFactory.createObject(tgButton[0], buttonSend);

        this.chatUtil.initChat(wsChatServer);
    }
}