
class Accessibility extends Plugin{

    constructor(domElement){
        super();
        this.domElement = domElement;
        this.annyangUtil = new AnnyangUtil();
        this.buttonFactory = new ButtonFactory();
        this.liFactory = new LiFactory();
        this.jsonData = {
            "objects" :
                {
                    "bigger_font": {
                        "id": "bigger_font",
                        "func": "var divtxt = document.querySelector('body > div:not(#acc_panel)');" +
                        "var curSize  = window.getComputedStyle(divtxt, null).getPropertyValue('font-size');" +
                        "var newSize = parseInt(curSize.replace('px', '')) + 1;" +
                        "divtxt.style.fontSize = newSize + 'px';",
                    } ,
                    "smaller_font": {
                        "id" : "smaller_font",
                        "func" : "var divtxt = document.querySelector('body > div:not(#acc_panel)');" +
                        "var curSize  = window.getComputedStyle(divtxt, null).getPropertyValue('font-size');" +
                        "var newSize = parseInt(curSize.replace('px', '')) - 1;" +
                        "if (newSize <= 10) {"+
                        "newSize = 10+ 'px';}"+
                        "divtxt.style.fontSize = newSize + 'px';"
                    },
                    "legible_font" :
                    {
                        "id" : "legible_font",
                        "func" : "$('body').toggleClass('lfont');"
                    },
                    "bright_Contrast" : {
                        "id" : "bright_Contrast",
                        "func" : "$('body,nav,main,header,section,article,footer,div,button').toggleClass('bc_blocks');" +
                        "$('main,header,footer,div,button').toggleClass('bc_border');" +
                        "$('h1,h2,h3,h4,h5,h6,span,label').toggleClass('bc_headers');" +
                        "$('a').toggleClass('bc_links');" +
                        "$('img,svg').toggleClass('bc_image');"
                    },
                    "impared" : {
                        "id" : "impared",
                        "func" : "$('body,main,nav,header,section,article,footer,div').toggleClass('vi_whitefont');" +
                        "$('h1,h2,h3,h4,h5,h6,span,label,button').toggleClass('vi_yellowfont');" +
                        "$('a').toggleClass('vi_link');" +
                        "$('img,svg').toggleClass('vi_image');"
                    },
                    "color_blind" : {
                        "id" : "color_blind",
                        "func" : "$('body,img').toggleClass('cb_grayscale');" +
                        "$('body,main').toggleClass('cb_bodyWhite');"
                    },
                    "blackCursor" : {
                        "id" : "blackCursor",
                        "func" : "$('body').toggleClass('black_cursor');"
                    },
                    "whiteCursor" : {
                        "id" : "whiteCursor",
                        "func" : "$('body').toggleClass('white_cursor');"
                    },
                    "magnifier" : {
                        "id" : "magnifier",
                        "func" : "$('.wrapper').toggleClass('largeBodyFonts');" +
                        "$('header,#question,.buttonGame').toggleClass('lfonts');" +
                        "$('.row_activity').toggleClass('largeB');" +
                        "$('.container').toggleClass('largef');" +
                        "$('.snow-globe').toggleClass('largeSnowGlobe');" +
                        "$('.bottom').toggleClass('largeSnowBottom');" +
                        "$('.cell img').toggleClass('largeimg');"
                    },
                    "imagesDescriptions" : {
                        "id" : "imagesDescriptions",
                        "func" : "if(flag ==0){iDescriptions();" +
                        "$('#text').css('display','block');}" +
                        "else{flag =0;" +
                        "$('#text').css('display','none');}"
                    },
                    "hightlightTitles" : {
                        "id" : "hightlightTitles",
                        "func" : "$('h1,h2,h3,h4,h5,h6').toggleClass('hightlight_titles');"
                    },
                    "hightlightLinks" :{
                        "id" : "hightlightLinks",
                        "func" : "$('a').toggleClass('hightlight_Links');"
                    }
                }
        }


    }
    draw(){

        this.options = eval(this.domElement.getAttribute("options"));

        if (this.options == undefined) {
            throw "Exception: Can't init tg-accessibility, option attribute is undefined"
        }

        var tgButtonElement = document.createElement("tg-button");
        this.domElement.appendChild(tgButtonElement);


        //main container
        var divAccPanel = document.createElement("div");
        divAccPanel.setAttribute("id","acc_panel");
        this.domElement.appendChild(divAccPanel);


        //accessibility header
        var divHeader = document.createElement("div");
        divHeader.setAttribute("class","header_panel");

        var ulHeader = document.createElement("ul");
        divAccPanel.appendChild(divHeader);
        divHeader.appendChild(ulHeader);


        var tgLButtonClose = document.createElement("tg-button");
        ulHeader.appendChild(tgLButtonClose);
        let buttonClose = {
            liAttribute : {
                id : "hide_panel"
            },
            buttonValue : "x",
            commands : {
                submit : {

                }
            }
        }

        let langObj = this.annyangUtil.getLangObj();
        for(let langCommand in langObj){
            if(langObj[langCommand].hasOwnProperty("accessibility_close")){
                   buttonClose.commands["submit"]["name"] = langObj[langCommand]["accessibility_close"] ;
            };
        }


        buttonClose.commands["submit"]["func"] = function(){
            $('#acc_panel').hide();
        };

        this.buttonFactory.createObject(tgLButtonClose, buttonClose);

        let headerAccess = document.createElement("h3")
        headerAccess.innerHTML += "Accessibility";
        divHeader.appendChild(headerAccess);

        var divButtonPanel = document.createElement("div");
        divButtonPanel.setAttribute("class","buttons_panel");
        divAccPanel.appendChild(divButtonPanel);

        var div_row_panel;
        var row3_panel;
        var ul;

        let index=0;
        for(let propertyName in this.options) {

            var tgLi = document.createElement("tg-li");

            //create duc for put 3 li inside it
            if(index ==0 || index == 3 || index == 6){

                div_row_panel = document.createElement("div");
                div_row_panel.setAttribute("class","row_panel");
                divButtonPanel.appendChild(div_row_panel);

                row3_panel = document.createElement("div");
                row3_panel.setAttribute("class","row3_panel");
                div_row_panel.appendChild(row3_panel);

                ul = document.createElement("ul");
                row3_panel.appendChild(ul);
            }


            let li = {
                liAttribute : {

                },
                commands : {
                    submit : {

                    }
                }
            }

            let option = this.options[propertyName]["option"];
            let text = this.options[propertyName]["text"];
            let func;
            let image = this.options[propertyName]["image"];

            //set func
            if(option != null || option != undefined){
                li.liAttribute.id = this.jsonData.objects[option]["id"];
                func =  this.jsonData.objects[option]["func"];
                li.commands["submit"]["func"] = function(){
                    eval(func);
                };

            }
            //set text to function
            if(text != null || text != undefined){
                li.liAttribute.text  = this.options[propertyName]["text"];
                li.commands["submit"]["name"] = this.options[propertyName]["text"] ;
            }

            this.liFactory.createObject(tgLi, li);

            let img = document.createElement("img");
            //set img to function
            if(image != null || image != undefined){
                img.setAttribute("src",image);
            }

            var liChild= tgLi.firstChild;
            liChild.appendChild(img);
            ul.appendChild(tgLi);

            index++;
        }


        var tgLi = document.createElement("tg-li");
        div_row_panel = document.createElement("div");
        div_row_panel.setAttribute("class","row_panel");
        divButtonPanel.appendChild(div_row_panel);

        row3_panel = document.createElement("div");
        row3_panel.setAttribute("class","row3_panel");
        div_row_panel.appendChild(row3_panel);

        let tgButton = this.domElement.getElementsByTagName("tg-button");

        var buttonAccess = {
            buttonAttribute : {
                id : "acc_logo"
            },
            // buttonValue : "Open Accessibility",
            commands : {
                submit : {

                }
            }
        }

        for(let langCommand in langObj){
            if(langObj[langCommand].hasOwnProperty("accessibility_open")){
                buttonAccess["commands"]["submit"]["name"]  = langObj[langCommand]["accessibility_open"] ;
            };
        }

        buttonAccess["commands"]["submit"]["func"] = function() {
            $("#acc_panel").toggle();
            console.log("tg-button");
        }

        this.buttonFactory.createObject(tgButton[0], buttonAccess);
    }
}