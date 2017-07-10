class Game extends Plugin {

    constructor(domElement) {
        super();
        this.domElement = domElement;
        console.log("it's game");
        this.questionCounter = 0;
        this.selections = [];
        this.questions;
        $(domElement).append("<div id='quiz'></div>");
        this.quiz = $('#quiz');
        this.buttonFactory = new ButtonFactory();
        this.inputFactory = new InputFactory()
    }

    draw() {
        var self = this;
        for(let index=0; index < 3 ; index++){

            let tgbutton = document.createElement("tg-button");

            let button = {
                buttonAttribute: {},
                buttonValue: {},
                commands: {
                    submit: {}
                }
            }

            if(index==0){
                button.buttonValue = "הבא";
                button.buttonAttribute["id"] = "next";
                button.buttonAttribute["class"] = "buttonGame";
                button["commands"]["submit"]["name"] = "הבא";
                button["commands"]["submit"]["func"] = function (){
                        event.preventDefault();

                        if (self.quiz.is(':animated')) {
                            return false;
                        }
                        self.choose();

                        if (isNaN(self.selections[self.questionCounter])) {
                            alert('Please make a selection!');
                        } else {
                            self.questionCounter++;
                            self.displayNext();
                        }
                }
            }
            else if(index==1){
                button.buttonValue = "הקודם";
                button.buttonAttribute["id"] = "prev";
                button.buttonAttribute["class"] = "buttonGame";
                button["commands"]["submit"]["name"] = "הקודם";
                button["commands"]["submit"]["func"] = function (){

                    event.preventDefault();
                    if (self.quiz.is(':animated')) {
                        return false;
                    }
                    self.choose();
                    self.questionCounter--;
                    self.displayNext();

                }
            }
            else{
                button.buttonValue = "מהתחלה";
                button.buttonAttribute["id"] = "start";
                button.buttonAttribute["class"] = "buttonGame";
                button["commands"]["submit"]["name"] = "מהתחלה";
                button["commands"]["submit"]["func"] = function (){

                    event.preventDefault();
                    if (self.quiz.is(':animated')) {
                        return false;
                    }
                    self.questionCounter = 0;
                    self.selections = [];
                    self.displayNext();
                    $('#start').hide();

                }
            }

            this.buttonFactory.createObject(tgbutton,button)
            this.domElement.appendChild(tgbutton);
        }

        this.checkUser();

        $('#next').on('click', function (e) {
            e.preventDefault();

            if (self.quiz.is(':animated')) {
                return false;
            }
            self.choose();

            if (isNaN(self.selections[self.questionCounter])) {
                alert('Please make a selection!');
            } else {
                self.questionCounter++;
                self.displayNext();
            }
        });

        $('#prev').on('click', function (e) {
            e.preventDefault();

            if (self.quiz.is(':animated')) {
                return false;
            }
            self.choose();
            self.questionCounter--;
            self.displayNext();
        });

        $('#start').on('click', function (e) {
            e.preventDefault();

            if (self.quiz.is(':animated')) {
                return false;
            }
            self.questionCounter = 0;
            self.selections = [];
            self.displayNext();
            $('#start').hide();
        });

        $('.buttonGame').on('mouseenter', function () {
            $(this).addClass('active');
        });
        $('.buttonGame').on('mouseleave', function () {
            $(this).removeClass('active');
        });
    }

    checkUser() {
        console.log("inside checkUser");
        var url = 'tsconfig.json';
        var jsonData;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                jsonData = JSON.parse(this.responseText);
                console.log(jsonData);
                console.log(jsonData["questions"].length);
                console.log(jsonData["questions"]);
                self.questions = jsonData["questions"];
                self.displayNext();
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    };

    createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });
        var header = $('<h4>שאלה ' + (index + 1) + '</h4>');
        qElement.append(header);

        var question = $('<h3>').append(this.questions[index].question);
        qElement.append(question);

        var radioButtons = this.createRadios(index);
        qElement.append(radioButtons);


        return qElement;
    }

    createRadios(index) {

        var map = {"ראשונה":"0","שנייה" : "1","שלישית" : "2","רביעית":"3","שניה":"1"};
        var radioList = $('<div>', {
            class: 'row'
        });
        var input = '';
        // var item = '';
        for (var i = 0; i < this.questions[index].choices.length; i++) {

            let tginput= document.createElement("tg-input");

            let radioinput = {
                inputAttribute: {
                    type: {}
                },
                commands: {
                    name: {}

                }
            }

            radioinput.inputAttribute["type"] = "radio";
            radioinput.inputAttribute["name"] = "answer";
            radioinput.inputAttribute["id"] = "radio_"+i;
            radioinput.inputAttribute["value"] = i;
            radioinput.commands["name"]["name"] = "תשובה *search";
            radioinput.commands["name"]["func"] = function(content){
                console.log(content);
                $("#radio_" + map[content]).attr('checked', 'checked');
            }
            this.inputFactory.createObject(tginput, radioinput);


            let questionContainer = document.createElement("label");
            questionContainer.setAttribute("class","cell");
            questionContainer.appendChild(tginput);
            questionContainer.innerHTML+= (i+1);

            let image = document.createElement("img");
            image.setAttribute("src","images/quez/"+this.questions[index].choices[i]+ "." + "jpg");
            image.setAttribute("width","40%");
            image.setAttribute("alt",this.questions[index].choices[i]);

            questionContainer.appendChild(image);

            radioList.append(questionContainer);
        }
        return radioList;
    }

    choose() {
        this.selections[this.questionCounter] = +$('input[name="answer"]:checked').val();
    }

    displayNext() {
        var self = this;
        this.quiz.fadeOut(function () {
            $('#question').remove();

            if (self.questionCounter < self.questions.length) {
                var nextQuestion = self.createQuestionElement(self.questionCounter);
                self.quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(self.selections[self.questionCounter]))) {
                    $('input[value=' + self.selections[self.questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (self.questionCounter === 1) {
                    $('#prev').show();
                } else if (self.questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                var scoreElem = self.displayScore();
                self.quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
            }
        });
    }

    displayScore() {
        var score = $('<p>', {class: 'score'});
        var numCorrect = 0;
        for (var i = 0; i < this.selections.length; i++) {
            if (this.selections[i] === this.questions[i].correctAnswer) {
                numCorrect++;
            }
        }
        score.append('ענית על ' + numCorrect + ' שאלות מתוך ' +
            this.questions.length);
        return score;
    }
}