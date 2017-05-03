let chatFactoryInstance = null;

class ChatFactory extends PluginFactory{

    constructor(){
        super();
        if(!chatFactoryInstance){
            chatFactoryInstance = this;
            this.annyangUtil = new AnnyangUtil();
        }
        return chatFactoryInstance;
    }

    createPlugin(domElement){
        let chat = new Chat(domElement);
        this.options = eval(domElement.getAttribute("options"));
        if(sessionStorage.getItem("disability").indexOf("hearing") == -1){
            this.initUtils();
        }
        chat.draw(this.options.wsURL);
        return chat;
    }

    initUtils(){
        this.initAnnyang();
    }

    initAnnyang(){
        let commands = {};
        for(let command in this.options.commands){
            commands[this.options.commands[command].name] = this.options.commands[command].func;
        }
        let annyangOptions = {commands: commands};
        this.annyangUtil.addAnnyangCommands(annyangOptions);
    }
}