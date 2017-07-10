class Button extends TGObject{

    constructor(domElement){
        super();
        this.domElement = domElement;
    }

    draw(options){

        let button

        if(options == null || options == undefined ){
            this.options = eval(this.domElement.getAttribute("options"));
            button = this.initButton()
        }
        else{
            this.options = options;
            button = this.initButton()
        }
        this.domElement.appendChild(button);
    }

    enableTobii(){
        this.button.classList.add("btn-lg");
    }

    enablejoystick(){

    }

    initButton(){

        this.button = document.createElement("button");

        if(this.options.buttonAttribute){
            for (let attribute in this.options.buttonAttribute) {
                this.button.setAttribute(attribute,this.options.buttonAttribute[attribute]);
            }
        }
        if(this.options.buttonValue) {
            this.button.innerHTML = this.options.buttonValue;
        }
        if(this.options.onClickFunc) {
            this.button.onclick = this.options.onClickFunc.func;
        }
        else if(this.options.commands){
            this.button.onclick = this.options.commands.submit.func;
        }
        return this.button;
    }

    enableClickers(){

    }

    enableTobii(){
        this.button.style.fontSize = "2em";
        console.log("button tobi");
    }
}