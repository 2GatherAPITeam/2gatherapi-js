'use strict'

let SpeechUtilInstance = null;
class SpeechUtil extends Util{
    constructor() {
        super();
        if(!SpeechUtilInstance){
            this.languages = {english:'en-US',france:'fr-FR',arabic:'ar-SA'};
            this.SpeechUtilInstance = this;
            // this.utterance = new SpeechSynthesisUtterance();
            this.userLanguages;
            this.annyangUtil = new AnnyangUtil();
            this.initAnnyang()
        }
        return this.SpeechUtilInstance;
    }

    initSpeech(languages){
        if(languages != null || languages != undefined) {
            this.userLanguages  = this.languages[this.languages[languages]];
        }
        else{
            this.userLanguages = 'english';
        }
    }

    startSpeak(utterance){
        console.log("inside startSpeak");
        window.speechSynthesis.speak(utterance);
    }
    cancelSpeak(){
        window.speechSynthesis.cancel();
    }

    read(path){

        let speaker = new SpeechUtil();
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", path, false);
        let userLanguage = this.userLanguages;
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    let allText = rawFile.responseText;

                    let chunkLength = 120;
                    let pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
                    let arr = [];
                    let txt = allText;
                    while (txt.length > 0) {
                        arr.push(txt.match(pattRegex)[0]);
                        txt = txt.substring(arr[arr.length - 1].length);
                    }
                    arr.forEach(function(element) {
                        let content = element.trim();
                        let utterance = new SpeechSynthesisUtterance(content);
                        utterance.lang = userLanguage
                        speaker.startSpeak(utterance);
                    });


                };
            }
        }
        rawFile.send(null);
    }

    readText(contents) {
        let speaker = new SpeechUtil();

        let userLanguage = this.userLanguages;
        let allText = contents
        let chunkLength = 120;
        let pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        let arr = [];
        let txt = allText;
        while (txt.length > 0) {
            arr.push(txt.match(pattRegex)[0]);
            txt = txt.substring(arr[arr.length - 1].length);
        }
        arr.forEach(function (element) {
            let content = element.trim();
            let utterance = new SpeechSynthesisUtterance(content);
            utterance.lang = userLanguage
            speaker.startSpeak(utterance);
        });
    }


    initAnnyang() {

        let commands = {};
        commands['stop'] = function(){
            window.speechSynthesis.cancel();
            console.log("stop");
        };
        let annyangOptions = {commands: commands};
        this.annyangUtil.addAnnyangCommands(annyangOptions);
    }
}