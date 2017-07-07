'use strict'

let annyangUtilInstance = null;
class AnnyangUtil extends Util{

    constructor() {
        super();

        if(!annyangUtilInstance){
            this.languages = {hebrew:'he',english:'en-US',arabic :'ar'};
            this.jsonData = {
                "lang" : [
                    {   "he" :
                        [
                            {"link" : "עבור"},
                            {"button" : "לחץ על"},
                            {"imgCloseModal" : "סגור חלון"},
                            {"imgScrollModalDown" : "למטה"},
                            {"imgScrollModalUp" : "למעלה"},
                            {"accessibility_close" : "סגור נגישות"},
                            {"accessibility_open" : "פתח נגישות"},
                            {"exit" : "יציאה"}
                        ],
                        "en-US" :
                         [
                            {"link" : "go to"},
                            {"button" : "click on"},
                            {"imgCloseModal" : "close window"},
                            {"imgScrollModalDown" : "down"},
                            {"imgScrollModalUp" : "up"},
                            {"accessibility_close" : "close accessibility"},
                            {"accessibility_open" : "open accessibility"},
                            {"stopTTV" : "stop"},
                            {"exit" : "exit"}
                         ]
                    }
                ]
            };
            this.userLanguages;
            annyangUtilInstance = this;
        }
        return annyangUtilInstance;
    }

    setLanguages(languages){
        this.userLanguages = languages
    }
    //init annyang if the admin does not define lang the default lang will be hebrew
    initAnnyang(languages){
        this.setLanguages(languages)
        if(annyang){
            if(languages != null || languages != undefined) {
                console.log(languages)
                annyang.setLanguage(this.languages[languages]);
            }
            else{
                annyang.setLanguage('he');
            }
            annyang.start();
            annyang.debug();
        }
    }

    addAnnyangCommands(options){
        annyang.addCommands(options.commands);
    }

    //this function return keyword according the lang
    getLangObj(){
        // let jsonObject = JSON.parse(this.jsonData);
        if(this.userLanguages != null || this.userLanguages != undefined){
            return this.jsonData["lang"][0][this.languages[this.userLanguages]];
        }
        else{
            return this.jsonData["lang"][0]["he"];
        }
    }
    //init exit command
    addExitCommand(){

        let commands = {};

        let langObj = this.getLangObj();
        for(let langCommand in langObj){
            if(langObj[langCommand].hasOwnProperty("exit")){
                commands[langObj[langCommand]["exit"]] = function(){
                    window.location.replace("index.html");
                }
            }
        }

        let annyangOptions = {commands: commands};
        this.addAnnyangCommands(annyangOptions);

    }
}