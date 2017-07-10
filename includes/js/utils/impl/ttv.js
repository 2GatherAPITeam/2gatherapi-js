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
        let allText = "Once when a lion, the king of the jungle, was asleep, a little mouse began running up and down on him. This soon awakened the lion, who placed his huge paw on the mouse, and opened his big jaws to swallow him. Pardon, O King! cried the little mouse. Forgive me this time. I shall never repeat it and I shall never forget your kindness. And who knows, I may be able to do you a good turn one of these days!” The lion was so tickled by the idea of the mouse being able to help him that he lifted his paw and let him go. Sometime later, a few hunters captured the lion, and tied him to a tree. After that they went in search of a wagon, to take him to the zoo. Just then the little mouse happened to pass by. On seeing the lion’s plight, he ran up to him and gnawed away the ropes that bound him, the king of the jungle. Was I not right? said the little mouse, very happy to help the lion. MORAL: Small acts of kindness will be rewarded greatly.";

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
            utterance.lang = 'english';
            speaker.startSpeak(utterance);
        });



        // let speaker = new SpeechUtil();
        // let rawFile = new XMLHttpRequest();
        // rawFile.open("GET", path, false);
        // let userLanguage = this.userLanguages;
        // rawFile.onreadystatechange = function () {
        //     if (rawFile.readyState === 4) {
        //         if (rawFile.status === 200 || rawFile.status == 0) {
        //             let allText = rawFile.responseText;
        //
        //             let chunkLength = 120;
        //             let pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        //             let arr = [];
        //             let txt = allText;
        //             while (txt.length > 0) {
        //                 arr.push(txt.match(pattRegex)[0]);
        //                 txt = txt.substring(arr[arr.length - 1].length);
        //             }
        //             arr.forEach(function(element) {
        //                 let content = element.trim();
        //                 let utterance = new SpeechSynthesisUtterance(content);
        //                 utterance.lang = userLanguage
        //                 speaker.startSpeak(utterance);
        //             });
        //
        //
        //         };
        //     }
        // }
        // rawFile.send(null);
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