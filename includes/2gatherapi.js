'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gatherapi = function () {
    function Gatherapi(options) {
        _classCallCheck(this, Gatherapi);

        this.options = options;
        this.requiredUtills = !options.requiredUtills ? ["voice commands"] : options.requiredUtills;
        if (options.middlewareDevices) {
            this.middleware = new Middleware(options.middlewareDevices, this);
        }

        this.objects = [];
        this.plugins = [];
        this.objectToObjectFactoryMap = { inputFactory: "tg-input", buttonFactory: "tg-button", linkFactory: "tg-a",
            paragraphFactory: "tg-paragraph", imgFactory: "tg-img", liFactory: new LiFactory(this) };

        this.pluginToPluginFactoryMap = { loginFactory: "tg-login", menuFactory: "tg-menu", accessibilityFactory: "tg-accessibility",
            chatFactory: "tg-chat", libraryFactory: "tg-library", gameFactory: "tg-game" };

        this.utils = {
            annyangUtil: new AnnyangUtil(),
            chatUtil: new ChatUtil(),
            textToVoice: new SpeechUtil(),
            boxModal: new BoxModelUtil()
        };

        this.objectFactories = { inputFactory: new InputFactory(this), imgFactory: new ImgFactory(this), buttonFactory: new ButtonFactory(this),
            paragraphFactory: new ParagraphFactory(this), linkFactory: new LinkFactory(this) };

        this.pluginFactories = { loginFactory: new LoginFactory(), chatFactory: new ChatFactory(),
            menuFactory: new MenuFactory(), libraryFactory: new LibraryFactory(),
            accessibilityFactory: new AccessibilityFactory(), gameFactory: new GameFactory() };

        this.utilsConfiguration();
        if (this.middleware) {
            this.middleware.init();
        }
        this.scanForPluginsOrObjects();
    }

    _createClass(Gatherapi, [{
        key: "utilsConfiguration",
        value: function utilsConfiguration() {
            this.utils.annyangUtil.initAnnyang(this.options.language);
            this.utils.annyangUtil.addExitCommand();
            this.utils.textToVoice.initSpeech(this.options.language);
        }
    }, {
        key: "scanForPluginsOrObjects",
        value: function scanForPluginsOrObjects() {
            this.scanObjects();
            this.scanPlugins();
        }
    }, {
        key: "scanObjects",
        value: function scanObjects() {
            for (var objectToObjectFactoryKey in this.objectToObjectFactoryMap) {
                var elements = document.getElementsByTagName(this.objectToObjectFactoryMap[objectToObjectFactoryKey]);
                for (var index = 0; index < elements.length; index++) {
                    this.objectFactories[objectToObjectFactoryKey].createObject(elements[index]);
                }
            }
        }
    }, {
        key: "enableExternalInputsHandlers",
        value: function enableExternalInputsHandlers() {
            var lang = this.options.virtualKeyboardLang;
            for (var ei in this.middleware.externalInputs) {
                if (this.middleware.externalInputs[ei].connected) {
                    this.objects.forEach(function (object) {
                        object["enable" + ei](lang);
                    });
                }
            }
        }
    }, {
        key: "scanPlugins",
        value: function scanPlugins() {
            for (var pluginToPluginFactoryKey in this.pluginToPluginFactoryMap) {
                var elements = document.getElementsByTagName(this.pluginToPluginFactoryMap[pluginToPluginFactoryKey]);
                for (var index = 0; index < elements.length; index++) {
                    this.pluginFactories[pluginToPluginFactoryKey].createPlugin(elements[index]);
                }
            }
        }
    }]);

    return Gatherapi;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExternalInput = function ExternalInput() {
    _classCallCheck(this, ExternalInput);

    this.connected = false;
    if (this.connectExternalInput === undefined) {
        throw new TypeError("Must override connectExternalInput");
    }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var clickersInstance = null;

var Clickers = function (_ExternalInput) {
    _inherits(Clickers, _ExternalInput);

    function Clickers() {
        var _ret;

        _classCallCheck(this, Clickers);

        var _this = _possibleConstructorReturn(this, (Clickers.__proto__ || Object.getPrototypeOf(Clickers)).call(this));

        if (!clickersInstance) {
            clickersInstance = _this;
        }
        _this.i = 0;
        return _ret = clickersInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Clickers, [{
        key: 'connectExternalInput',
        value: function connectExternalInput() {
            this.connected = true;
            myElement = document.querySelector('body');
            myElement.onmousedown = this.doubleclick;
            var blockContextMenu, myElement;
            blockContextMenu = function blockContextMenu(evt) {
                evt.preventDefault();
            };

            myElement.addEventListener('contextmenu', blockContextMenu);
        }
    }, {
        key: 'doubleclick',
        value: function doubleclick(event) {
            console.log(event);
            var self = this;
            var el = document.querySelector('body');
            if (el.getAttribute("data-dblclick") == null) {
                el.setAttribute("data-dblclick", 1);
                setTimeout(function () {
                    if (el.getAttribute("data-dblclick") == 1) {
                        if (event.button == 0) {
                            clickersInstance.rightClickFunction();
                        } else {
                            clickersInstance.leftClickFunction();
                        }
                    }
                    el.removeAttribute("data-dblclick");
                }, 300);
            } else {
                el.removeAttribute("data-dblclick");
                clickersInstance.chooseFunction();
            }
        }
    }, {
        key: 'leftClickFunction',
        value: function leftClickFunction() {
            var markables = document.querySelectorAll("input,a,select,button,textarea,.tg-library-img");
            if (this.i == 1) {
                this.i = markables.length - 1;
            }
            var mark = markables[this.i];
            mark.style.border = "none";
            this.i--;
            mark = markables[this.i];
            console.log(mark);
            if (mark.tagName == "IMG") {
                mark.style.border = "5px solid blue";
            } else {
                mark.focus();
            }
        }
    }, {
        key: 'rightClickFunction',
        value: function rightClickFunction() {
            var markables = document.querySelectorAll("input,a,select,button,textarea,.tg-library-img");
            if (this.i == markables.length - 1) {
                this.i = -1;
            }
            var mark = markables[this.i];
            mark.style.border = "none";
            this.i = this.i + 1;
            mark = markables[this.i];
            console.log(mark);
            console.log(mark.tagName);
            if (mark.tagName == "IMG") {
                mark.style.border = "5px solid blue";
            } else {
                mark.focus();
            }
        }
    }, {
        key: 'chooseFunction',
        value: function chooseFunction() {
            var markables = document.querySelectorAll("input,a,select,button,textarea,.tg-library-img");
            markables[this.i].click();
        }
    }]);

    return Clickers;
}(ExternalInput);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var joystickInstance = null;

var Joystick = function (_ExternalInput) {
    _inherits(Joystick, _ExternalInput);

    function Joystick() {
        var _ret;

        _classCallCheck(this, Joystick);

        var _this = _possibleConstructorReturn(this, (Joystick.__proto__ || Object.getPrototypeOf(Joystick)).call(this));

        if (!joystickInstance) {
            joystickInstance = _this;
        }
        return _ret = joystickInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Joystick, [{
        key: "connectExternalInput",
        value: function connectExternalInput() {
            this.connected = true;
        }
    }]);

    return Joystick;
}(ExternalInput);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tobiiInstance = null;

var Tobii = function (_ExternalInput) {
    _inherits(Tobii, _ExternalInput);

    function Tobii() {
        var _ret;

        _classCallCheck(this, Tobii);

        var _this = _possibleConstructorReturn(this, (Tobii.__proto__ || Object.getPrototypeOf(Tobii)).call(this));

        if (!tobiiInstance) {
            tobiiInstance = _this;
        }
        return _ret = tobiiInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Tobii, [{
        key: "connectExternalInput",
        value: function connectExternalInput() {
            this.connected = true;
        }
    }]);

    return Tobii;
}(ExternalInput);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Middleware = function () {
    function Middleware(devices, gatherApiObject) {
        _classCallCheck(this, Middleware);

        this.devices = devices;
        this.gatherApiObject = gatherApiObject;
        this.connectedDevices = {};
        this.externalInputs = {
            Clickers: new Clickers(),
            Tobii: new Tobii(),
            joystick: new Joystick()
        };
    }

    _createClass(Middleware, [{
        key: "init",
        value: function init(callback) {
            var devicesToCheck = [];
            for (var key in this.devices) {
                devicesToCheck.push({ productId: this.devices[key].productId, vendorId: this.devices[key].vendorId });
            }
            this.checkForConnectedDevices(JSON.stringify(devicesToCheck), callback);
        }
    }, {
        key: "checkForConnectedDevices",
        value: function checkForConnectedDevices(data, callback) {
            var xmlhttp = new XMLHttpRequest();
            var self = this;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    self.connectedDevices = JSON.parse(xmlhttp.responseText);
                    var needExternalInit = false;
                    for (var externalInput in self.externalInputs) {
                        if (self.devices[externalInput]) {
                            var ei = self.externalInputs[externalInput];
                            for (var connectedDevice in self.connectedDevices) {
                                if (self.connectedDevices[connectedDevice].productId == self.devices[externalInput].productId && self.connectedDevices[connectedDevice].vendorId == self.devices[externalInput].vendorId) {
                                    ei.connectExternalInput();
                                    needExternalInit = true;
                                    break;
                                }
                            }
                            if (needExternalInit) {
                                self.gatherApiObject.enableExternalInputsHandlers();
                            } else if (self.devices.length != 0 && callback) {
                                callback();
                            } else if (self.devices.length != 0) {
                                alert("one of the following required devices isn't connected: " + Object.keys(self.devices));
                            }
                        }
                    }
                }
            };

            xmlhttp.open("POST", "http://localhost:8082/device-checker/get-user-active-devices", true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.setRequestHeader('Accept', 'application/JSON');
            xmlhttp.send(data);
        }
    }, {
        key: "getConnectedDevices",
        value: function getConnectedDevices() {
            return this.connectedDevices;
        }
    }, {
        key: "showConnectedDevices",
        value: function showConnectedDevices() {
            console.log(this.connectedDevices);
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {
            console.log("enabled Tobii");
        }
    }, {
        key: "enableKeyboard",
        value: function enableKeyboard() {
            console.log("enbled Keyboard");
        }
    }]);

    return Middleware;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buttonFactoryInstance = null;

var ButtonFactory = function (_ObjectFactory) {
    _inherits(ButtonFactory, _ObjectFactory);

    function ButtonFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, ButtonFactory);

        var _this = _possibleConstructorReturn(this, (ButtonFactory.__proto__ || Object.getPrototypeOf(ButtonFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!buttonFactoryInstance) {
            buttonFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = buttonFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ButtonFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var button = void 0;
            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                button = new Button(domElement);
                button.draw();
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            } else {
                this.options = options;
                button = new Button(domElement);
                button.draw(this.options);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            }
            this.gatherApiObject.objects.push(button);
            return button;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {

            var commands = {};

            if (this.options.commands) {

                for (var command in this.options.commands) {
                    commands[this.options.commands[command].name] = this.options.commands[command].func;
                }
            } else {
                if (this.options.onClickFunc) {

                    var langObj = this.annyangUtil.getLangObj();
                    for (var langCommand in langObj) {

                        if (langObj[langCommand].hasOwnProperty("button")) {
                            commands[langObj[langCommand]["button"] + " " + this.options["buttonValue"]] = this.options.onClickFunc.func;
                        }
                    }
                }
            }
            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return ButtonFactory;
}(ObjectFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var imgFactoryInstance = null;

var ImgFactory = function (_ObjectFactory) {
    _inherits(ImgFactory, _ObjectFactory);

    function ImgFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, ImgFactory);

        var _this = _possibleConstructorReturn(this, (ImgFactory.__proto__ || Object.getPrototypeOf(ImgFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!imgFactoryInstance) {
            imgFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = imgFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ImgFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var img = void 0;
            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                img = new Img(domElement, this.gatherApiObject);
                img.draw();
            } else {
                this.options = options;
                img = new Img(domElement, this.gatherApiObject);
                img.draw(this.options);
            }
            this.gatherApiObject.objects.push(img);
            return img;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {}
    }]);

    return ImgFactory;
}(ObjectFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inputFactoryInstance = null;

var InputFactory = function (_ObjectFactory) {
    _inherits(InputFactory, _ObjectFactory);

    function InputFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, InputFactory);

        var _this = _possibleConstructorReturn(this, (InputFactory.__proto__ || Object.getPrototypeOf(InputFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!inputFactoryInstance) {
            inputFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = inputFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(InputFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var inputText = void 0;

            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                inputText = new InputText(domElement);
                inputText.draw(null);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            } else {
                this.options = options;
                inputText = new InputText(domElement);
                inputText.draw(this.options);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            }
            this.gatherApiObject.objects.push(inputText);
            return inputText;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {

            var commands = {};

            for (var command in this.options.commands) {
                commands[this.options.commands[command].name] = this.options.commands[command].func;
            }
            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return InputFactory;
}(ObjectFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var liFactoryInstance = null;

var LiFactory = function (_ObjectFactory) {
    _inherits(LiFactory, _ObjectFactory);

    function LiFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, LiFactory);

        var _this = _possibleConstructorReturn(this, (LiFactory.__proto__ || Object.getPrototypeOf(LiFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!liFactoryInstance) {
            liFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = liFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LiFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var li = void 0;
            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                li = new Li(domElement);
                li.draw();
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            } else {
                this.options = options;
                li = new Li(domElement);
                li.draw(this.options);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            }
            this.gatherApiObject.objects.push(li);
            return li;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {

            var commands = {};

            if (this.options.commands) {
                for (var command in this.options.commands) {
                    commands[this.options.commands[command].name] = this.options.commands[command].func;
                }
            }

            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return LiFactory;
}(ObjectFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var linkFactoryInstance = null;

var LinkFactory = function (_ObjectFactory) {
    _inherits(LinkFactory, _ObjectFactory);

    function LinkFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, LinkFactory);

        var _this = _possibleConstructorReturn(this, (LinkFactory.__proto__ || Object.getPrototypeOf(LinkFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!linkFactoryInstance) {
            linkFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = linkFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LinkFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var link = void 0;

            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                link = new Link(domElement);
                link.draw(null);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            } else {
                this.options = options;
                link = new Link(domElement);
                link.draw(this.options);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            }
            this.gatherApiObject.objects.push(link);
            return link;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {
            var _this2 = this;

            var commands = {};

            for (var propertyName in this.options) {

                if (this.options[propertyName]["commandTrigger"]) {
                    (function () {
                        var webPage = _this2.options[propertyName].href;
                        commands[_this2.options[propertyName]["commandTrigger"]] = function () {
                            window.location.replace(webPage);
                        };
                    })();
                } else {
                    if (this.options[propertyName]["href"]) {
                        var langObj = this.annyangUtil.getLangObj();
                        for (var langCommand in langObj) {
                            if (langObj[langCommand].hasOwnProperty("link")) {
                                (function () {
                                    var webPage = _this2.options[propertyName]["href"];
                                    commands[langObj[langCommand]["link"] + " " + _this2.options[propertyName]["text"]] = function () {
                                        window.location.replace(webPage);
                                    };
                                })();
                            }
                        }
                    }
                }
            }
            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return LinkFactory;
}(ObjectFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var paragraphFactoryInstance = null;

var ParagraphFactory = function (_ObjectFactory) {
    _inherits(ParagraphFactory, _ObjectFactory);

    function ParagraphFactory(gatherApiObject) {
        var _ret;

        _classCallCheck(this, ParagraphFactory);

        var _this = _possibleConstructorReturn(this, (ParagraphFactory.__proto__ || Object.getPrototypeOf(ParagraphFactory)).call(this));

        _this.gatherApiObject = gatherApiObject;
        if (!paragraphFactoryInstance) {
            paragraphFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
            _this.speechUtil = new SpeechUtil();
        }
        return _ret = paragraphFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ParagraphFactory, [{
        key: "createObject",
        value: function createObject(domElement, options) {

            var paragraph = void 0;

            if (options == null || options == undefined) {
                this.options = eval(domElement.getAttribute("options"));
                paragraph = new Paragraph(domElement);
                paragraph.draw(null);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1) {
                    this.initUtils();
                }
            } else {
                this.options = options;
                paragraph = new Paragraph(domElement);
                paragraph.draw(this.options);
                if (this.gatherApiObject.requiredUtills.indexOf("voice commands") != -1 || this.gatherApiObject.requiredUtills.indexOf("ttv") != -1) {
                    this.initUtils();
                }
            }
            this.gatherApiObject.objects.push(paragraph);
            return paragraph;
        }
    }, {
        key: "initUtils",
        value: function initUtils() {
            this.initAnnyang();
        }
    }, {
        key: "initAnnyang",
        value: function initAnnyang() {

            var commands = {};
            var self = this;
            var text = this.options.commands.content;

            if (this.options.commands.commandTrigger) {
                var dataCommand = this.options.voiceCommand;
                commands[this.options.commands.commandTrigger] = function () {
                    self.speechUtil.readText(text);
                };
            }

            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return ParagraphFactory;
}(ObjectFactory);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectFactory = function ObjectFactory() {
    _classCallCheck(this, ObjectFactory);

    if (this.createObject === undefined) {
        throw new TypeError("Must override createObject");
    }
    if (this.initUtils === undefined) {
        throw new TypeError("Must override initUtils");
    }
    // if (this.initHearingUtils === undefined) {
    //     throw new TypeError("Must override initHearingUtils");
    // }
    // if(sessionStorage.getItem("disability").indexOf("hearing") != -1){
    //     this.initHearingUtils();
    // }
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_TGObject) {
    _inherits(Button, _TGObject);

    function Button(domElement) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

        _this.domElement = domElement;
        return _this;
    }

    _createClass(Button, [{
        key: "draw",
        value: function draw(options) {

            var button = void 0;

            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                button = this.initButton();
            } else {
                this.options = options;
                button = this.initButton();
            }
            this.domElement.appendChild(button);
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {
            this.button.classList.add("btn-lg");
        }
    }, {
        key: "enablejoystick",
        value: function enablejoystick() {}
    }, {
        key: "initButton",
        value: function initButton() {

            this.button = document.createElement("button");

            if (this.options.buttonAttribute) {
                for (var attribute in this.options.buttonAttribute) {
                    this.button.setAttribute(attribute, this.options.buttonAttribute[attribute]);
                }
            }
            if (this.options.buttonValue) {
                this.button.innerHTML = this.options.buttonValue;
            }
            if (this.options.onClickFunc) {
                this.button.onclick = this.options.onClickFunc.func;
            } else if (this.options.commands) {
                this.button.onclick = this.options.commands.submit.func;
            }
            return this.button;
        }
    }, {
        key: "enableClickers",
        value: function enableClickers() {}
    }, {
        key: "enableTobii",
        value: function enableTobii() {
            this.button.style.fontSize = "2em";
            console.log("button tobi");
        }
    }]);

    return Button;
}(TGObject);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Img = function (_TGObject) {
    _inherits(Img, _TGObject);

    function Img(domElement, gatherApiObject) {
        _classCallCheck(this, Img);

        var _this = _possibleConstructorReturn(this, (Img.__proto__ || Object.getPrototypeOf(Img)).call(this));

        _this.domElement = domElement;
        _this.annyangUtil = new AnnyangUtil();
        _this.speechUtil = new SpeechUtil();
        _this.boxModal = new BoxModelUtil();
        _this.gatherApiObject = gatherApiObject;
        return _this;
    }

    _createClass(Img, [{
        key: "draw",
        value: function draw(options) {

            var img = void 0;

            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                img = this.initImage();
            } else {
                this.options = options;
                img = this.initImage();
            }

            this.domElement.appendChild(img);
        }
    }, {
        key: "initImage",
        value: function initImage() {
            var self = this;

            this.img = document.createElement("img");

            if (this.options.imgAttribute) {
                for (var attribute in this.options.imgAttribute) {
                    this.img.setAttribute(attribute, this.options.imgAttribute[attribute]);
                }
            }
            if (this.options.img) {
                this.img.setAttribute("src", this.options["img"]);
            }
            if (this.options.path) {

                var path = this.options["path"];
                // When the user clicks the button, open the modal
                this.img.onclick = function () {

                    document.getElementsByClassName("content-paragraph").innerHTML += "";
                    var rawFile = new XMLHttpRequest();
                    rawFile.open("GET", path, false);
                    rawFile.onreadystatechange = function () {
                        if (rawFile.readyState === 4) {
                            if (rawFile.status === 200 || rawFile.status == 0) {
                                var allText = rawFile.responseText;
                                // let boxModal = new BoxModelUtil();
                                self.boxModal.setText(allText);
                            }
                        }
                    };
                    rawFile.send(null);
                };
            }
            //init voice command
            var commands = {};
            if (this.gatherApiObject.requiredUtills.indexOf("voice command") != -1) {

                //first check if there is file path exist for voice command
                if (this.options.path) {
                    sessionStorage.scrollPosition = 0;
                    if (this.options.voiceCommand) {
                        var dataCommand = this.options.voiceCommand;
                        commands[this.options.voiceCommand] = function () {
                            self.img.click();
                        };
                    }
                    var langObj = this.annyangUtil.getLangObj();
                    for (var langCommand in langObj) {
                        if (langObj[langCommand].hasOwnProperty("imgCloseModal")) {
                            commands[langObj[langCommand]["imgCloseModal"]] = function () {
                                var modal = document.getElementById('myModal');
                                sessionStorage.scrollPosition = 0;
                                console.log("insied modal close " + sessionStorage.getItem("scrollPosition"));
                                $(".modal-content").scrollTop(0);
                                modal.style.display = "none";
                            };
                        } else if (langObj[langCommand].hasOwnProperty("imgScrollModalDown")) {
                            commands[langObj[langCommand]["imgScrollModalDown"]] = function () {
                                // var modal = document.getElementsByClassName('modal-content');
                                // modal.scrollTop = 100;
                                var position = parseInt(sessionStorage.getItem("scrollPosition"));
                                console.log(position + " before");
                                position = position + 50;
                                sessionStorage.scrollPosition = position;
                                console.log(position + " after");
                                $(".modal-content").scrollTop(position);
                            };
                        }
                    }
                }
            }
            //the user is blind
            if (this.gatherApiObject.requiredUtills.indexOf("ttv") != -1) {
                var self = this;
                var _path = this.options["path"];
                if (this.options.path) {
                    if (this.options.voiceCommand) {
                        var _dataCommand = this.options.voiceCommand;
                        commands[this.options.voiceCommand] = function () {
                            self.speechUtil.read(_path);
                        };
                    }
                }
            }

            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);

            return this.img;
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {
            this.img.style.transform = "scale(2)";
            console.log("img tobi");
        }
    }, {
        key: "enablejoystick",
        value: function enablejoystick() {}
    }, {
        key: "enableClickers",
        value: function enableClickers() {
            this.img.addEventListener("focus", function () {
                this.style.backgroundColor = "red";
                this.style.opacity = "0.7";
            });
        }
    }]);

    return Img;
}(TGObject);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputText = function (_TGObject) {
    _inherits(InputText, _TGObject);

    function InputText(domElement) {
        _classCallCheck(this, InputText);

        var _this = _possibleConstructorReturn(this, (InputText.__proto__ || Object.getPrototypeOf(InputText)).call(this));

        _this.domElement = domElement;
        return _this;
    }

    _createClass(InputText, [{
        key: "draw",
        value: function draw(options) {

            var input = void 0;
            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                input = this.initInput();
            } else {
                this.options = options;
                input = this.initInput();
            }
            this.domElement.appendChild(input);
        }
    }, {
        key: "initInput",
        value: function initInput() {
            var input = document.createElement("input");
            if (this.options.inputAttribute) {
                for (var attribute in this.options.inputAttribute) {
                    input.setAttribute(attribute, this.options.inputAttribute[attribute]);
                }
            }

            return input;
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {}
    }, {
        key: "enablejoystick",
        value: function enablejoystick(lang) {
            $('#' + this.options.inputAttribute.id).keyboard({
                layout: lang
            });
        }
    }, {
        key: "enableClickers",
        value: function enableClickers() {}
    }]);

    return InputText;
}(TGObject);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Li = function (_TGObject) {
    _inherits(Li, _TGObject);

    function Li(domElement) {
        _classCallCheck(this, Li);

        var _this = _possibleConstructorReturn(this, (Li.__proto__ || Object.getPrototypeOf(Li)).call(this));

        _this.domElement = domElement;
        _this.annyangUtil = new AnnyangUtil();

        return _this;
    }

    _createClass(Li, [{
        key: "draw",
        value: function draw(options) {

            var li = void 0;

            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                li = this.initLi();
            } else {
                this.options = options;
                li = this.initLi();
            }

            this.domElement.appendChild(li);
        }
    }, {
        key: "initLi",
        value: function initLi() {

            var li = document.createElement("li");

            if (this.options.liAttribute) {
                for (var attribute in this.options.liAttribute) {
                    if (attribute == "text") {
                        li.innerHTML += this.options.liAttribute[attribute];
                    }
                    li.setAttribute(attribute, this.options.liAttribute[attribute]);
                }
            }
            if (this.options.commands) {
                li.onclick = this.options.commands.submit.func;
            }

            return li;
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {}
    }, {
        key: "enablejoystick",
        value: function enablejoystick() {}
    }, {
        key: "enableClickers",
        value: function enableClickers() {}
    }]);

    return Li;
}(TGObject);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Link = function (_TGObject) {
    _inherits(Link, _TGObject);

    function Link(domElement) {
        _classCallCheck(this, Link);

        var _this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this));

        _this.domElement = domElement;
        return _this;
    }

    _createClass(Link, [{
        key: "draw",
        value: function draw(options) {

            var link = void 0;
            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                this.link = this.initLink();
            } else {
                this.options = options;
                this.link = this.initLink();
            }
            this.domElement.appendChild(this.link);
        }
    }, {
        key: "initLink",
        value: function initLink() {
            var link = document.createElement("a");
            for (var propertyName in this.options) {
                for (var attribute in this.options[propertyName]) {
                    if (attribute == "text") {
                        link.innerHTML = this.options[propertyName][attribute];
                    } else if (attribute == "commandTrigger") {} else {
                        link.setAttribute(attribute, this.options[propertyName][attribute]);
                    }
                }
            }
            return link;
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {
            this.link.style.fontSize = "2em";
            console.log("li tobi");
        }
    }, {
        key: "enablejoystick",
        value: function enablejoystick() {}
    }, {
        key: "enableClickers",
        value: function enableClickers() {}
    }]);

    return Link;
}(TGObject);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Paragraph = function (_TGObject) {
    _inherits(Paragraph, _TGObject);

    function Paragraph(domElement) {
        _classCallCheck(this, Paragraph);

        var _this = _possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).call(this));

        _this.domElement = domElement;
        return _this;
    }

    _createClass(Paragraph, [{
        key: "draw",
        value: function draw(options) {

            var paragraph = void 0;
            if (options == null || options == undefined) {
                this.options = eval(this.domElement.getAttribute("options"));
                paragraph = this.initpPragraph();
            } else {
                this.options = options;
                paragraph = this.initpPragraph();
            }
            this.domElement.appendChild(paragraph);
        }
    }, {
        key: "initpPragraph",
        value: function initpPragraph() {
            var paragraph = document.createElement("p");
            paragraph.innerHTML = this.options.commands.content;
            return paragraph;
        }
    }, {
        key: "enableTobii",
        value: function enableTobii() {}
    }, {
        key: "enablejoystick",
        value: function enablejoystick() {}
    }, {
        key: "enableClickers",
        value: function enableClickers() {}
    }]);

    return Paragraph;
}(TGObject);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TGObject = function TGObject() {
    _classCallCheck(this, TGObject);

    if (this.draw === undefined) {
        throw new TypeError("Must override draw");
    }
    if (this.enableTobii === undefined) {
        throw new TypeError("Must override draw");
    }
    if (this.enablejoystick === undefined) {
        throw new TypeError("Must override draw");
    }
    if (this.enableClickers === undefined) {
        throw new TypeError("Must override draw");
    }
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var accessibilityFactoryInstance = null;

var AccessibilityFactory = function (_PluginFactory) {
    _inherits(AccessibilityFactory, _PluginFactory);

    function AccessibilityFactory() {
        var _ret;

        _classCallCheck(this, AccessibilityFactory);

        var _this = _possibleConstructorReturn(this, (AccessibilityFactory.__proto__ || Object.getPrototypeOf(AccessibilityFactory)).call(this));

        if (!accessibilityFactoryInstance) {
            accessibilityFactoryInstance = _this;
        }
        return _ret = accessibilityFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(AccessibilityFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var accessibility = new Accessibility(domElement);
            this.options = eval(domElement.getAttribute("options"));
            accessibility.draw();
            return accessibility;
        }
    }]);

    return AccessibilityFactory;
}(PluginFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var chatFactoryInstance = null;

var ChatFactory = function (_PluginFactory) {
    _inherits(ChatFactory, _PluginFactory);

    function ChatFactory() {
        var _ret;

        _classCallCheck(this, ChatFactory);

        var _this = _possibleConstructorReturn(this, (ChatFactory.__proto__ || Object.getPrototypeOf(ChatFactory)).call(this));

        if (!chatFactoryInstance) {
            chatFactoryInstance = _this;
        }
        return _ret = chatFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ChatFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var chat = new Chat(domElement);
            this.options = eval(domElement.getAttribute("options"));
            chat.draw(this.options.wsURL);
            return chat;
        }
    }]);

    return ChatFactory;
}(PluginFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var gameFactoryInstance = null;

var GameFactory = function (_PluginFactory) {
    _inherits(GameFactory, _PluginFactory);

    function GameFactory() {
        var _ret;

        _classCallCheck(this, GameFactory);

        var _this = _possibleConstructorReturn(this, (GameFactory.__proto__ || Object.getPrototypeOf(GameFactory)).call(this));

        if (!gameFactoryInstance) {
            gameFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = gameFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(GameFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var game = new Game(domElement);
            this.options = eval(domElement.getAttribute("options"));
            game.draw();
            return game;
        }
    }]);

    return GameFactory;
}(PluginFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var libraryFactoryInstance = null;

var LibraryFactory = function (_PluginFactory) {
    _inherits(LibraryFactory, _PluginFactory);

    function LibraryFactory() {
        var _ret;

        _classCallCheck(this, LibraryFactory);

        var _this = _possibleConstructorReturn(this, (LibraryFactory.__proto__ || Object.getPrototypeOf(LibraryFactory)).call(this));

        if (!libraryFactoryInstance) {
            libraryFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = libraryFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LibraryFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var library = new Library(domElement);
            this.options = eval(domElement.getAttribute("options"));
            library.draw();
            return library;
        }
    }]);

    return LibraryFactory;
}(PluginFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var loginFactoryInstance = null;

var LoginFactory = function (_PluginFactory) {
    _inherits(LoginFactory, _PluginFactory);

    function LoginFactory() {
        var _ret;

        _classCallCheck(this, LoginFactory);

        var _this = _possibleConstructorReturn(this, (LoginFactory.__proto__ || Object.getPrototypeOf(LoginFactory)).call(this));

        if (!loginFactoryInstance) {
            loginFactoryInstance = _this;
            _this.annyangUtil = new AnnyangUtil();
        }
        return _ret = loginFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LoginFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var login = new Login(domElement);
            this.options = eval(domElement.getAttribute("options"));
            login.draw();
            return login;
        }
    }]);

    return LoginFactory;
}(PluginFactory);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var menuFactoryInstance = null;

var MenuFactory = function (_PluginFactory) {
    _inherits(MenuFactory, _PluginFactory);

    function MenuFactory() {
        var _ret;

        _classCallCheck(this, MenuFactory);

        var _this = _possibleConstructorReturn(this, (MenuFactory.__proto__ || Object.getPrototypeOf(MenuFactory)).call(this));

        if (!menuFactoryInstance) {
            menuFactoryInstance = _this;
        }
        return _ret = menuFactoryInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MenuFactory, [{
        key: "createPlugin",
        value: function createPlugin(domElement) {
            var menu = new Menu(domElement);
            this.options = eval(domElement.getAttribute("options"));
            menu.draw();
            return menu;
        }
    }]);

    return MenuFactory;
}(PluginFactory);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PluginFactory = function PluginFactory() {
    _classCallCheck(this, PluginFactory);

    if (this.createPlugin === undefined) {
        throw new TypeError("Must override createPlugin");
    }
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Accessibility = function (_Plugin) {
    _inherits(Accessibility, _Plugin);

    function Accessibility(domElement) {
        _classCallCheck(this, Accessibility);

        var _this = _possibleConstructorReturn(this, (Accessibility.__proto__ || Object.getPrototypeOf(Accessibility)).call(this));

        _this.domElement = domElement;
        _this.annyangUtil = new AnnyangUtil();
        _this.buttonFactory = new ButtonFactory();
        _this.liFactory = new LiFactory();
        _this.jsonData = {
            "objects": {
                "bigger_font": {
                    "id": "bigger_font",
                    "func": "var divtxt = document.querySelector('body > div:not(#acc_panel)');" + "var curSize  = window.getComputedStyle(divtxt, null).getPropertyValue('font-size');" + "var newSize = parseInt(curSize.replace('px', '')) + 1;" + "divtxt.style.fontSize = newSize + 'px';"
                },
                "smaller_font": {
                    "id": "smaller_font",
                    "func": "var divtxt = document.querySelector('body > div:not(#acc_panel)');" + "var curSize  = window.getComputedStyle(divtxt, null).getPropertyValue('font-size');" + "var newSize = parseInt(curSize.replace('px', '')) - 1;" + "if (newSize <= 10) {" + "newSize = 10+ 'px';}" + "divtxt.style.fontSize = newSize + 'px';"
                },
                "legible_font": {
                    "id": "legible_font",
                    "func": "$('body').toggleClass('lfont');"
                },
                "bright_Contrast": {
                    "id": "bright_Contrast",
                    "func": "$('body,nav,main,header,section,article,footer,div,button').toggleClass('bc_blocks');" + "$('main,header,footer,div,button').toggleClass('bc_border');" + "$('h1,h2,h3,h4,h5,h6,span,label').toggleClass('bc_headers');" + "$('a').toggleClass('bc_links');" + "$('img,svg').toggleClass('bc_image');"
                },
                "impared": {
                    "id": "impared",
                    "func": "$('body,main,nav,header,section,article,footer,div').toggleClass('vi_whitefont');" + "$('h1,h2,h3,h4,h5,h6,span,label,button').toggleClass('vi_yellowfont');" + "$('a').toggleClass('vi_link');" + "$('img,svg').toggleClass('vi_image');"
                },
                "color_blind": {
                    "id": "color_blind",
                    "func": "$('body,img').toggleClass('cb_grayscale');" + "$('body,main').toggleClass('cb_bodyWhite');"
                },
                "blackCursor": {
                    "id": "blackCursor",
                    "func": "$('body').toggleClass('black_cursor');"
                },
                "whiteCursor": {
                    "id": "whiteCursor",
                    "func": "$('body').toggleClass('white_cursor');"
                },
                "magnifier": {
                    "id": "magnifier",
                    "func": "$('.wrapper').toggleClass('largeBodyFonts');" + "$('header,#question,.buttonGame').toggleClass('lfonts');" + "$('.row_activity').toggleClass('largeB');" + "$('.container').toggleClass('largef');" + "$('.snow-globe').toggleClass('largeSnowGlobe');" + "$('.bottom').toggleClass('largeSnowBottom');" + "$('.cell img').toggleClass('largeimg');"
                },
                "imagesDescriptions": {
                    "id": "imagesDescriptions",
                    "func": "if(flag ==0){iDescriptions();" + "$('#text').css('display','block');}" + "else{flag =0;" + "$('#text').css('display','none');}"
                },
                "hightlightTitles": {
                    "id": "hightlightTitles",
                    "func": "$('h1,h2,h3,h4,h5,h6').toggleClass('hightlight_titles');"
                },
                "hightlightLinks": {
                    "id": "hightlightLinks",
                    "func": "$('a').toggleClass('hightlight_Links');"
                }
            }
        };

        return _this;
    }

    _createClass(Accessibility, [{
        key: "draw",
        value: function draw() {
            var _this2 = this;

            this.options = eval(this.domElement.getAttribute("options"));

            if (this.options == undefined) {
                throw "Exception: Can't init tg-accessibility, option attribute is undefined";
            }

            var tgButtonElement = document.createElement("tg-button");
            this.domElement.appendChild(tgButtonElement);

            //main container
            var divAccPanel = document.createElement("div");
            divAccPanel.setAttribute("id", "acc_panel");
            this.domElement.appendChild(divAccPanel);

            //accessibility header
            var divHeader = document.createElement("div");
            divHeader.setAttribute("class", "header_panel");

            var ulHeader = document.createElement("ul");
            divAccPanel.appendChild(divHeader);
            divHeader.appendChild(ulHeader);

            var tgLButtonClose = document.createElement("tg-button");
            ulHeader.appendChild(tgLButtonClose);
            var buttonClose = {
                liAttribute: {
                    id: "hide_panel"
                },
                buttonValue: "x",
                commands: {
                    submit: {}
                }
            };

            var langObj = this.annyangUtil.getLangObj();
            for (var langCommand in langObj) {
                if (langObj[langCommand].hasOwnProperty("accessibility_close")) {
                    buttonClose.commands["submit"]["name"] = langObj[langCommand]["accessibility_close"];
                };
            }

            buttonClose.commands["submit"]["func"] = function () {
                $('#acc_panel').hide();
            };

            this.buttonFactory.createObject(tgLButtonClose, buttonClose);

            var headerAccess = document.createElement("h3");
            headerAccess.innerHTML += "Accessibility";
            divHeader.appendChild(headerAccess);

            var divButtonPanel = document.createElement("div");
            divButtonPanel.setAttribute("class", "buttons_panel");
            divAccPanel.appendChild(divButtonPanel);

            var div_row_panel;
            var row3_panel;
            var ul;

            var index = 0;

            var _loop = function _loop(propertyName) {
                tgLi = document.createElement("tg-li");

                //create duc for put 3 li inside it

                if (index == 0 || index == 3 || index == 6) {

                    div_row_panel = document.createElement("div");
                    div_row_panel.setAttribute("class", "row_panel");
                    divButtonPanel.appendChild(div_row_panel);

                    row3_panel = document.createElement("div");
                    row3_panel.setAttribute("class", "row3_panel");
                    div_row_panel.appendChild(row3_panel);

                    ul = document.createElement("ul");
                    row3_panel.appendChild(ul);
                }

                var li = {
                    liAttribute: {},
                    commands: {
                        submit: {}
                    }
                };

                var option = _this2.options[propertyName]["option"];
                var text = _this2.options[propertyName]["text"];
                var func = void 0;
                var image = _this2.options[propertyName]["image"];

                //set func
                if (option != null || option != undefined) {
                    li.liAttribute.id = _this2.jsonData.objects[option]["id"];
                    func = _this2.jsonData.objects[option]["func"];
                    li.commands["submit"]["func"] = function () {
                        eval(func);
                    };
                }
                //set text to function
                if (text != null || text != undefined) {
                    li.liAttribute.text = _this2.options[propertyName]["text"];
                    li.commands["submit"]["name"] = _this2.options[propertyName]["text"];
                }

                _this2.liFactory.createObject(tgLi, li);

                var img = document.createElement("img");
                //set img to function
                if (image != null || image != undefined) {
                    img.setAttribute("src", image);
                }

                liChild = tgLi.firstChild;

                liChild.appendChild(img);
                ul.appendChild(tgLi);

                index++;
            };

            for (var propertyName in this.options) {
                var tgLi;
                var liChild;

                _loop(propertyName);
            }

            var tgLi = document.createElement("tg-li");
            div_row_panel = document.createElement("div");
            div_row_panel.setAttribute("class", "row_panel");
            divButtonPanel.appendChild(div_row_panel);

            row3_panel = document.createElement("div");
            row3_panel.setAttribute("class", "row3_panel");
            div_row_panel.appendChild(row3_panel);

            var tgButton = this.domElement.getElementsByTagName("tg-button");

            var buttonAccess = {
                buttonAttribute: {
                    id: "acc_logo"
                },
                // buttonValue : "Open Accessibility",
                commands: {
                    submit: {}
                }
            };

            for (var _langCommand in langObj) {
                if (langObj[_langCommand].hasOwnProperty("accessibility_open")) {
                    buttonAccess["commands"]["submit"]["name"] = langObj[_langCommand]["accessibility_open"];
                };
            }

            buttonAccess["commands"]["submit"]["func"] = function () {
                $("#acc_panel").toggle();
                console.log("tg-button");
            };

            this.buttonFactory.createObject(tgButton[0], buttonAccess);
        }
    }]);

    return Accessibility;
}(Plugin);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_Plugin) {
    _inherits(Chat, _Plugin);

    function Chat(domElement) {
        _classCallCheck(this, Chat);

        var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this));

        _this.domElement = domElement;
        _this.inputFactory = new InputFactory();
        _this.buttonFactory = new ButtonFactory();
        _this.chatUtil = new ChatUtil();
        return _this;
    }

    _createClass(Chat, [{
        key: 'draw',
        value: function draw(wsChatServer) {

            this.domElement.innerHTML += '<div class="chatmain">' + '<div class="messages">' + '<div class="above"  id="message_box">' + '</div>' + '<div class="bellow">' + '<tg-input class="text" name="name" id="name" placeholder="Your Name" /></tg-input>' + '<tg-input class="text" name="message" id="message" placeholder="Message" /></tg-input>' +
            // '<section class="text"> </section>'+1
            '<tg-button></tg-button>' + '</div>' + '</div>' + '<div class="loggedin">' + '<section class="me">' + '<img class="mypic" src="images/anyone.png">' + '<p class="name">Me me: </p>' + '<p class="status">Online</hp>' + '</section>' + '<section class="others">' + '</section>' + '</div>' + '<div class="clear"></div>' + '</div>';

            var inputOption = {
                inputAttribute: {},
                commands: {
                    name: {}

                }
            };

            this.options = eval(this.domElement.getAttribute("options"));

            var inputs = this.domElement.getElementsByTagName("tg-input");

            for (var i = 0; i < inputs.length; i++) {
                var attributes = inputs[i].attributes;
                if (i == 0) {
                    inputOption.commands["name"]["name"] = this.options.commands.name.name;
                    inputOption.commands["name"]["func"] = this.options.commands.name.func;
                } else {
                    inputOption.commands["name"]["name"] = this.options.commands.message.name;
                    inputOption.commands["name"]["func"] = this.options.commands.message.func;
                }

                while (inputs[i].attributes.length > 0) {
                    var attributeName = attributes[0].nodeName;
                    inputOption.inputAttribute[attributeName] = attributes[0].nodeValue;
                    inputs[i].removeAttribute(attributeName);
                }
                this.inputFactory.createObject(inputs[i], inputOption);
            }

            var tgButton = this.domElement.getElementsByTagName("tg-button");

            var buttonSend = {
                buttonAttribute: {
                    id: "send-btn",
                    class: "send"
                },
                buttonValue: "שלח",
                onClickFunc: {}
            };
            buttonSend["onClickFunc"]["func"] = this.options.onClickFunc.func;
            this.buttonFactory.createObject(tgButton[0], buttonSend);

            this.chatUtil.initChat(wsChatServer);
        }
    }]);

    return Chat;
}(Plugin);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_Plugin) {
    _inherits(Game, _Plugin);

    function Game(domElement) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this.domElement = domElement;
        console.log("it's game");
        _this.questionCounter = 0;
        _this.selections = [];
        _this.questions;
        $(domElement).append("<div id='quiz'></div>");
        _this.quiz = $('#quiz');
        _this.buttonFactory = new ButtonFactory();
        _this.inputFactory = new InputFactory();
        return _this;
    }

    _createClass(Game, [{
        key: "draw",
        value: function draw() {
            var self = this;
            for (var index = 0; index < 3; index++) {

                var tgbutton = document.createElement("tg-button");

                var button = {
                    buttonAttribute: {},
                    buttonValue: {},
                    commands: {
                        submit: {}
                    }
                };

                if (index == 0) {
                    button.buttonValue = "הבא";
                    button.buttonAttribute["id"] = "next";
                    button.buttonAttribute["class"] = "buttonGame";
                    button["commands"]["submit"]["name"] = "הבא";
                    button["commands"]["submit"]["func"] = function () {
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
                    };
                } else if (index == 1) {
                    button.buttonValue = "הקודם";
                    button.buttonAttribute["id"] = "prev";
                    button.buttonAttribute["class"] = "buttonGame";
                    button["commands"]["submit"]["name"] = "הקודם";
                    button["commands"]["submit"]["func"] = function () {

                        event.preventDefault();
                        if (self.quiz.is(':animated')) {
                            return false;
                        }
                        self.choose();
                        self.questionCounter--;
                        self.displayNext();
                    };
                } else {
                    button.buttonValue = "מהתחלה";
                    button.buttonAttribute["id"] = "start";
                    button.buttonAttribute["class"] = "buttonGame";
                    button["commands"]["submit"]["name"] = "מהתחלה";
                    button["commands"]["submit"]["func"] = function () {

                        event.preventDefault();
                        if (self.quiz.is(':animated')) {
                            return false;
                        }
                        self.questionCounter = 0;
                        self.selections = [];
                        self.displayNext();
                        $('#start').hide();
                    };
                }

                this.buttonFactory.createObject(tgbutton, button);
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
    }, {
        key: "checkUser",
        value: function checkUser() {
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
        }
    }, {
        key: "createQuestionElement",
        value: function createQuestionElement(index) {
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
    }, {
        key: "createRadios",
        value: function createRadios(index) {

            var map = { "ראשונה": "0", "שנייה": "1", "שלישית": "2", "רביעית": "3", "שניה": "1" };
            var radioList = $('<div>', {
                class: 'row'
            });
            var input = '';
            // var item = '';
            for (var i = 0; i < this.questions[index].choices.length; i++) {

                var tginput = document.createElement("tg-input");

                var radioinput = {
                    inputAttribute: {
                        type: {}
                    },
                    commands: {
                        name: {}

                    }
                };

                radioinput.inputAttribute["type"] = "radio";
                radioinput.inputAttribute["name"] = "answer";
                radioinput.inputAttribute["id"] = "radio_" + i;
                radioinput.inputAttribute["value"] = i;
                radioinput.commands["name"]["name"] = "תשובה *search";
                radioinput.commands["name"]["func"] = function (content) {
                    console.log(content);
                    $("#radio_" + map[content]).attr('checked', 'checked');
                };
                this.inputFactory.createObject(tginput, radioinput);

                var questionContainer = document.createElement("label");
                questionContainer.setAttribute("class", "cell");
                questionContainer.appendChild(tginput);
                questionContainer.innerHTML += i + 1;

                var image = document.createElement("img");
                image.setAttribute("src", "images/quez/" + this.questions[index].choices[i] + "." + "jpg");
                image.setAttribute("width", "40%");
                image.setAttribute("alt", this.questions[index].choices[i]);

                questionContainer.appendChild(image);

                radioList.append(questionContainer);
            }
            return radioList;
        }
    }, {
        key: "choose",
        value: function choose() {
            this.selections[this.questionCounter] = +$('input[name="answer"]:checked').val();
        }
    }, {
        key: "displayNext",
        value: function displayNext() {
            var self = this;
            this.quiz.fadeOut(function () {
                $('#question').remove();

                if (self.questionCounter < self.questions.length) {
                    var nextQuestion = self.createQuestionElement(self.questionCounter);
                    self.quiz.append(nextQuestion).fadeIn();
                    if (!isNaN(self.selections[self.questionCounter])) {
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
    }, {
        key: "displayScore",
        value: function displayScore() {
            var score = $('<p>', { class: 'score' });
            var numCorrect = 0;
            for (var i = 0; i < this.selections.length; i++) {
                if (this.selections[i] === this.questions[i].correctAnswer) {
                    numCorrect++;
                }
            }
            score.append('ענית על ' + numCorrect + ' שאלות מתוך ' + this.questions.length);
            return score;
        }
    }]);

    return Game;
}(Plugin);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Library = function (_Plugin) {
    _inherits(Library, _Plugin);

    function Library(domElement) {
        _classCallCheck(this, Library);

        var _this = _possibleConstructorReturn(this, (Library.__proto__ || Object.getPrototypeOf(Library)).call(this));

        _this.domElement = domElement;
        _this.imgFactory = new ImgFactory();

        return _this;
    }

    _createClass(Library, [{
        key: "draw",
        value: function draw() {
            try {
                var options = eval(this.domElement.getAttribute("options"));
                if (this.options == undefined) {
                    throw "Exception: Can't init tg-library, option attribute is undefined";
                }

                var libraryContainer = document.createElement("div");
                //our class for this divContainer plugin
                libraryContainer.setAttribute("class", "tg-library-books");

                for (var propertyName in options) {

                    var divStory = document.createElement("div");
                    //our class for this divStory plugin
                    divStory.setAttribute("class", "tg-library-story");

                    //our class for this header
                    var bookHeader = document.createElement("h5");
                    bookHeader.setAttribute("class", "tg-library-header");

                    var tgImg = document.createElement("tg-img");

                    var libraryImg = {
                        imgAttribute: {},
                        path: "",
                        img: "",
                        voiceCommand: ""
                    };

                    for (var propertyAtrr in options[propertyName]["imgAttribute"]) {
                        libraryImg.imgAttribute[propertyAtrr] = options[propertyName]["imgAttribute"][propertyAtrr];
                    }

                    libraryImg.path = options[propertyName]["path"];
                    libraryImg.img = options[propertyName]["img"];
                    libraryImg.voiceCommand = options[propertyName]["voiceCommand"];
                    bookHeader.innerHTML += options[propertyName]["voiceCommand"];

                    this.imgFactory.createObject(tgImg, libraryImg);

                    divStory.appendChild(bookHeader);
                    divStory.appendChild(tgImg);
                    libraryContainer.appendChild(divStory);
                }

                this.domElement.appendChild(libraryContainer);
            } catch (e) {
                console.log(e);
            }
        }
    }]);

    return Library;
}(Plugin);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_Plugin) {
    _inherits(Login, _Plugin);

    function Login(domElement) {
        _classCallCheck(this, Login);

        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

        _this.domElement = domElement;
        _this.inputFactory = new InputFactory();
        _this.buttonFactory = new ButtonFactory();
        return _this;
    }

    _createClass(Login, [{
        key: "draw",
        value: function draw() {
            try {
                this.options = eval(this.domElement.getAttribute("options"));

                if (this.options == undefined) {
                    throw "Exception: Can't init tg-login, option attribute is undefined";
                }
                //if user define label in login options
                if (this.options.labels) {

                    this.domElement.innerHTML += "<label> </label>" + "<label> </label>";

                    var labels = this.domElement.getElementsByTagName("label");
                    var labelChild = 0;
                    for (var label in this.options.labels) {
                        labels[labelChild].innerHTML += this.options.labels[label];
                        labels[labelChild++].innerHTML += "<tg-input></tg-input>";
                    }
                    this.domElement.innerHTML += "<tg-button></tg-button>";
                } else {
                    this.domElement.innerHTML += "<tg-input></tg-input>" + "<tg-input></tg-input>" + "<tg-button></tg-button>";
                }

                var textInput = {
                    inputAttribute: {
                        type: "text"
                    },
                    commands: {
                        name: {}

                    }
                };

                var passInput = {
                    inputAttribute: {
                        type: "password"
                    },
                    commands: {
                        name: {}

                    }
                };

                var inputs = this.domElement.getElementsByTagName("tg-input");
                for (var i = 0; i < inputs.length; i++) {
                    if (i == 0) {

                        textInput.commands["name"]["name"] = this.options.commands.username.name;
                        textInput.commands["name"]["func"] = this.options.commands.username.func;
                        this.inputFactory.createObject(inputs[i], textInput);
                    } else {
                        passInput.commands["name"]["name"] = this.options.commands.password.name;
                        passInput.commands["name"]["func"] = this.options.commands.password.func;
                        this.inputFactory.createObject(inputs[i], passInput);
                    }
                }

                //check if user define button value and button function
                if (this.options.buttonValue && this.options.commands.submit || this.options.buttonValue && this.options.onClickFunc) {

                    var tgButton = this.domElement.getElementsByTagName("tg-button");

                    //if user define own voice command by submit property inside commands
                    if (this.options.commands.submit) {

                        var buttonLogin = {
                            buttonAttribute: {},
                            buttonValue: this.options.buttonValue,
                            commands: {
                                submit: {}
                            }
                        };

                        buttonLogin["commands"]["submit"]["name"] = this.options.commands.submit.name;
                        buttonLogin["commands"]["submit"]["func"] = this.options.commands.submit.func;
                    }
                    //we use 2gather button keyword
                    else {

                            var buttonLogin = {
                                buttonAttribute: {},
                                buttonValue: this.options.buttonValue,
                                onClickFunc: {}
                            };

                            buttonLogin["onClickFunc"]["func"] = this.options.onClickFunc.func;
                        }
                    this.buttonFactory.createObject(tgButton[0], buttonLogin);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }]);

    return Login;
}(Plugin);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = function (_Plugin) {
    _inherits(Menu, _Plugin);

    function Menu(domElement) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this));

        _this.domElement = domElement;
        _this.linkFactory = new LinkFactory();
        return _this;
    }

    _createClass(Menu, [{
        key: "draw",
        value: function draw() {
            try {
                this.options = eval(this.domElement.getAttribute("options"));

                if (this.options == undefined) {
                    throw "Exception: Can't init tg-menu, option attribute is undefined";
                }

                var nav = document.createElement("nav");
                var ul = document.createElement("ul");
                ul.setAttribute("class", "tg-ul");

                for (var propertyName in this.options) {
                    var li = document.createElement("li");
                    li.setAttribute("class", "tg-li");
                    var a = document.createElement("tg-a");

                    var menuOptions = {
                        link: {}
                    };

                    for (var propertyAtrr in this.options[propertyName]) {
                        menuOptions.link[propertyAtrr] = this.options[propertyName][propertyAtrr];
                    }

                    this.linkFactory.createObject(a, menuOptions);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                nav.appendChild(ul);
                this.domElement.appendChild(nav);
            } catch (e) {
                console.log(e);
            }
        }
    }]);

    return Menu;
}(Plugin);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function Plugin() {
    _classCallCheck(this, Plugin);

    if (this.draw === undefined) {
        throw new TypeError("Must override draw");
    }
};
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

//! annyang
//! version : 2.6.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://www.TalAter.com/annyang/
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD + global
    define([], function () {
      return root.annyang = factory(root);
    });
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(root);
  } else {
    // Browser globals
    root.annyang = factory(root);
  }
})(typeof window !== 'undefined' ? window : undefined, function (root, undefined) {
  'use strict';

  /**
   * # Quick Tutorial, Intro and Demos
   *
   * The quickest way to get started is to visit the [annyang homepage](https://www.talater.com/annyang/).
   *
   * For a more in-depth look at annyang, read on.
   *
   * # API Reference
   */

  var annyang;

  // Get the SpeechRecognition object, while handling browser prefixes
  var SpeechRecognition = root.SpeechRecognition || root.webkitSpeechRecognition || root.mozSpeechRecognition || root.msSpeechRecognition || root.oSpeechRecognition;

  // Check browser support
  // This is done as early as possible, to make it as fast as possible for unsupported browsers
  if (!SpeechRecognition) {
    return null;
  }

  var commandsList = [];
  var recognition;
  var callbacks = { start: [], error: [], end: [], soundstart: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [] };
  var autoRestart;
  var lastStartedAt = 0;
  var autoRestartCount = 0;
  var debugState = false;
  var debugStyle = 'font-weight: bold; color: #00f;';
  var pauseListening = false;
  var _isListening = false;

  // The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
  var optionalParam = /\s*\((.*?)\)\s*/g;
  var optionalRegex = /(\(\?:[^)]+\))\?/g;
  var namedParam = /(\(\?)?:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#]/g;
  var commandToRegExp = function commandToRegExp(command) {
    command = command.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
      return optional ? match : '([^\\s]+)';
    }).replace(splatParam, '(.*?)').replace(optionalRegex, '\\s*$1?\\s*');
    return new RegExp('^' + command + '$', 'i');
  };

  // This method receives an array of callbacks to iterate over, and invokes each of them
  var invokeCallbacks = function invokeCallbacks(callbacks) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    callbacks.forEach(function (callback) {
      callback.callback.apply(callback.context, args);
    });
  };

  var isInitialized = function isInitialized() {
    return recognition !== undefined;
  };

  // method for logging in developer console when debug mode is on
  var logMessage = function logMessage(text, extraParameters) {
    if (text.indexOf('%c') === -1 && !extraParameters) {
      console.log(text);
    } else {
      console.log(text, extraParameters || debugStyle);
    }
  };

  var initIfNeeded = function initIfNeeded() {
    if (!isInitialized()) {
      annyang.init({}, false);
    }
  };

  var registerCommand = function registerCommand(command, callback, originalPhrase) {
    commandsList.push({ command: command, callback: callback, originalPhrase: originalPhrase });
    if (debugState) {
      logMessage('Command successfully loaded: %c' + originalPhrase, debugStyle);
    }
  };

  var parseResults = function parseResults(results) {
    invokeCallbacks(callbacks.result, results);
    var commandText;
    // go over each of the 5 results and alternative results received (we've set maxAlternatives to 5 above)
    for (var i = 0; i < results.length; i++) {
      // the text recognized
      commandText = results[i].trim();
      if (debugState) {
        logMessage('Speech recognized: %c' + commandText, debugStyle);
      }

      // try and match recognized text to one of the commands on the list
      for (var j = 0, l = commandsList.length; j < l; j++) {
        var currentCommand = commandsList[j];
        var result = currentCommand.command.exec(commandText);
        if (result) {
          var parameters = result.slice(1);
          if (debugState) {
            logMessage('command matched: %c' + currentCommand.originalPhrase, debugStyle);
            if (parameters.length) {
              logMessage('with parameters', parameters);
            }
          }
          // execute the matched command
          currentCommand.callback.apply(this, parameters);
          invokeCallbacks(callbacks.resultMatch, commandText, currentCommand.originalPhrase, results);
          return;
        }
      }
    }
    invokeCallbacks(callbacks.resultNoMatch, results);
  };

  annyang = {

    /**
     * Initialize annyang with a list of commands to recognize.
     *
     * #### Examples:
     * ````javascript
     * var commands = {'hello :name': helloFunction};
     * var commands2 = {'hi': helloFunction};
     *
     * // initialize annyang, overwriting any previously added commands
     * annyang.init(commands, true);
     * // adds an additional command without removing the previous commands
     * annyang.init(commands2, false);
     * ````
     * As of v1.1.0 it is no longer required to call init(). Just start() listening whenever you want, and addCommands() whenever, and as often as you like.
     *
     * @param {Object} commands - Commands that annyang should listen to
     * @param {boolean} [resetCommands=true] - Remove all commands before initializing?
     * @method init
     * @deprecated
     * @see [Commands Object](#commands-object)
     */
    init: function init(commands) {
      var resetCommands = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // Abort previous instances of recognition already running
      if (recognition && recognition.abort) {
        recognition.abort();
      }

      // initiate SpeechRecognition
      recognition = new SpeechRecognition();

      // Set the max number of alternative transcripts to try and match with a command
      recognition.maxAlternatives = 5;

      // In HTTPS, turn off continuous mode for faster results.
      // In HTTP,  turn on  continuous mode for much slower results, but no repeating security notices
      recognition.continuous = root.location.protocol === 'http:';

      // Sets the language to the default 'en-US'. This can be changed with annyang.setLanguage()
      recognition.lang = 'en-US';

      recognition.onstart = function () {
        _isListening = true;
        invokeCallbacks(callbacks.start);
      };

      recognition.onsoundstart = function () {
        invokeCallbacks(callbacks.soundstart);
      };

      recognition.onerror = function (event) {
        invokeCallbacks(callbacks.error, event);
        switch (event.error) {
          case 'network':
            invokeCallbacks(callbacks.errorNetwork, event);
            break;
          case 'not-allowed':
          case 'service-not-allowed':
            // if permission to use the mic is denied, turn off auto-restart
            autoRestart = false;
            // determine if permission was denied by user or automatically.
            if (new Date().getTime() - lastStartedAt < 200) {
              invokeCallbacks(callbacks.errorPermissionBlocked, event);
            } else {
              invokeCallbacks(callbacks.errorPermissionDenied, event);
            }
            break;
        }
      };

      recognition.onend = function () {
        _isListening = false;
        invokeCallbacks(callbacks.end);
        // annyang will auto restart if it is closed automatically and not by user action.
        if (autoRestart) {
          // play nicely with the browser, and never restart annyang automatically more than once per second
          var timeSinceLastStart = new Date().getTime() - lastStartedAt;
          autoRestartCount += 1;
          if (autoRestartCount % 10 === 0) {
            if (debugState) {
              logMessage('Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips.');
            }
          }
          if (timeSinceLastStart < 1000) {
            setTimeout(function () {
              annyang.start({ paused: pauseListening });
            }, 1000 - timeSinceLastStart);
          } else {
            annyang.start({ paused: pauseListening });
          }
        }
      };

      recognition.onresult = function (event) {
        if (pauseListening) {
          if (debugState) {
            logMessage('Speech heard, but annyang is paused');
          }
          return false;
        }

        // Map the results to an array
        var SpeechRecognitionResult = event.results[event.resultIndex];
        var results = [];
        for (var k = 0; k < SpeechRecognitionResult.length; k++) {
          results[k] = SpeechRecognitionResult[k].transcript;
        }

        parseResults(results);
      };

      // build commands list
      if (resetCommands) {
        commandsList = [];
      }
      if (commands.length) {
        this.addCommands(commands);
      }
    },

    /**
     * Start listening.
     * It's a good idea to call this after adding some commands first, but not mandatory.
     *
     * Receives an optional options object which supports the following options:
     *
     * - `autoRestart`  (boolean, default: true) Should annyang restart itself if it is closed indirectly, because of silence or window conflicts?
     * - `continuous`   (boolean) Allow forcing continuous mode on or off. Annyang is pretty smart about this, so only set this if you know what you're doing.
     * - `paused`       (boolean, default: true) Start annyang in paused mode.
     *
     * #### Examples:
     * ````javascript
     * // Start listening, don't restart automatically
     * annyang.start({ autoRestart: false });
     * // Start listening, don't restart automatically, stop recognition after first phrase recognized
     * annyang.start({ autoRestart: false, continuous: false });
     * ````
     * @param {Object} [options] - Optional options.
     * @method start
     */
    start: function start(options) {
      initIfNeeded();
      options = options || {};
      if (options.paused !== undefined) {
        pauseListening = !!options.paused;
      } else {
        pauseListening = false;
      }
      if (options.autoRestart !== undefined) {
        autoRestart = !!options.autoRestart;
      } else {
        autoRestart = true;
      }
      if (options.continuous !== undefined) {
        recognition.continuous = !!options.continuous;
      }

      lastStartedAt = new Date().getTime();
      try {
        recognition.start();
      } catch (e) {
        if (debugState) {
          logMessage(e.message);
        }
      }
    },

    /**
     * Stop listening, and turn off mic.
     *
     * Alternatively, to only temporarily pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
     * @see [pause()](#pause)
     *
     * @method abort
     */
    abort: function abort() {
      autoRestart = false;
      autoRestartCount = 0;
      if (isInitialized()) {
        recognition.abort();
      }
    },

    /**
     * Pause listening. annyang will stop responding to commands (until the resume or start methods are called), without turning off the browser's SpeechRecognition engine or the mic.
     *
     * Alternatively, to stop the SpeechRecognition engine and close the mic, use abort() instead.
     * @see [abort()](#abort)
     *
     * @method pause
     */
    pause: function pause() {
      pauseListening = true;
    },

    /**
     * Resumes listening and restores command callback execution when a result matches.
     * If SpeechRecognition was aborted (stopped), start it.
     *
     * @method resume
     */
    resume: function resume() {
      annyang.start();
    },

    /**
     * Turn on output of debug messages to the console. Ugly, but super-handy!
     *
     * @param {boolean} [newState=true] - Turn on/off debug messages
     * @method debug
     */
    debug: function debug() {
      var newState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      debugState = !!newState;
    },

    /**
     * Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
     *
     * @param {String} language - The language (locale)
     * @method setLanguage
     * @see [Languages](https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported)
     */
    setLanguage: function setLanguage(language) {
      initIfNeeded();
      recognition.lang = language;
    },

    /**
     * Add commands that annyang will respond to. Similar in syntax to init(), but doesn't remove existing commands.
     *
     * #### Examples:
     * ````javascript
     * var commands = {'hello :name': helloFunction, 'howdy': helloFunction};
     * var commands2 = {'hi': helloFunction};
     *
     * annyang.addCommands(commands);
     * annyang.addCommands(commands2);
     * // annyang will now listen to all three commands
     * ````
     *
     * @param {Object} commands - Commands that annyang should listen to
     * @method addCommands
     * @see [Commands Object](#commands-object)
     */
    addCommands: function addCommands(commands) {
      var cb;

      initIfNeeded();

      for (var phrase in commands) {
        if (commands.hasOwnProperty(phrase)) {
          cb = root[commands[phrase]] || commands[phrase];
          if (typeof cb === 'function') {
            // convert command to regex then register the command
            registerCommand(commandToRegExp(phrase), cb, phrase);
          } else if ((typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) === 'object' && cb.regexp instanceof RegExp) {
            // register the command
            registerCommand(new RegExp(cb.regexp.source, 'i'), cb.callback, phrase);
          } else {
            if (debugState) {
              logMessage('Can not register command: %c' + phrase, debugStyle);
            }
            continue;
          }
        }
      }
    },

    /**
     * Remove existing commands. Called with a single phrase, array of phrases, or methodically. Pass no params to remove all commands.
     *
     * #### Examples:
     * ````javascript
     * var commands = {'hello': helloFunction, 'howdy': helloFunction, 'hi': helloFunction};
     *
     * // Remove all existing commands
     * annyang.removeCommands();
     *
     * // Add some commands
     * annyang.addCommands(commands);
     *
     * // Don't respond to hello
     * annyang.removeCommands('hello');
     *
     * // Don't respond to howdy or hi
     * annyang.removeCommands(['howdy', 'hi']);
     * ````
     * @param {String|Array|Undefined} [commandsToRemove] - Commands to remove
     * @method removeCommands
     */
    removeCommands: function removeCommands(commandsToRemove) {
      if (commandsToRemove === undefined) {
        commandsList = [];
      } else {
        commandsToRemove = Array.isArray(commandsToRemove) ? commandsToRemove : [commandsToRemove];
        commandsList = commandsList.filter(function (command) {
          for (var i = 0; i < commandsToRemove.length; i++) {
            if (commandsToRemove[i] === command.originalPhrase) {
              return false;
            }
          }
          return true;
        });
      }
    },

    /**
     * Add a callback function to be called in case one of the following events happens:
     *
     * * `start` - Fired as soon as the browser's Speech Recognition engine starts listening
     * * `soundstart` - Fired as soon as any sound (possibly speech) has been detected.
     *     This will fire once per Speech Recognition starting. See https://is.gd/annyang_sound_start
     * * `error` - Fired when the browser's Speech Recogntion engine returns an error, this generic error callback will be followed by more accurate error callbacks (both will fire if both are defined)
     *     Callback function will be called with the error event as the first argument
     * * `errorNetwork` - Fired when Speech Recognition fails because of a network error
     *     Callback function will be called with the error event as the first argument
     * * `errorPermissionBlocked` - Fired when the browser blocks the permission request to use Speech Recognition.
     *     Callback function will be called with the error event as the first argument
     * * `errorPermissionDenied` - Fired when the user blocks the permission request to use Speech Recognition.
     *     Callback function will be called with the error event as the first argument
     * * `end` - Fired when the browser's Speech Recognition engine stops
     * * `result` - Fired as soon as some speech was identified. This generic callback will be followed by either the `resultMatch` or `resultNoMatch` callbacks.
     *     Callback functions for to this event will be called with an array of possible phrases the user said as the first argument
     * * `resultMatch` - Fired when annyang was able to match between what the user said and a registered command
     *     Callback functions for this event will be called with three arguments in the following order:
     *       * The phrase the user said that matched a command
     *       * The command that was matched
     *       * An array of possible alternative phrases the user might have said
     * * `resultNoMatch` - Fired when what the user said didn't match any of the registered commands.
     *     Callback functions for this event will be called with an array of possible phrases the user might've said as the first argument
     *
     * #### Examples:
     * ````javascript
     * annyang.addCallback('error', function() {
     *   $('.myErrorText').text('There was an error!');
     * });
     *
     * annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
     *   console.log(userSaid); // sample output: 'hello'
     *   console.log(commandText); // sample output: 'hello (there)'
     *   console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
     * });
     *
     * // pass local context to a global function called notConnected
     * annyang.addCallback('errorNetwork', notConnected, this);
     * ````
     * @param {String} type - Name of event that will trigger this callback
     * @param {Function} callback - The function to call when event is triggered
     * @param {Object} [context] - Optional context for the callback function
     * @method addCallback
     */
    addCallback: function addCallback(type, callback, context) {
      var cb = root[callback] || callback;
      if (typeof cb === 'function' && callbacks[type] !== undefined) {
        callbacks[type].push({ callback: cb, context: context || this });
      }
    },

    /**
     * Remove callbacks from events.
     *
     * - Pass an event name and a callback command to remove that callback command from that event type.
     * - Pass just an event name to remove all callback commands from that event type.
     * - Pass undefined as event name and a callback command to remove that callback command from all event types.
     * - Pass no params to remove all callback commands from all event types.
     *
     * #### Examples:
     * ````javascript
     * annyang.addCallback('start', myFunction1);
     * annyang.addCallback('start', myFunction2);
     * annyang.addCallback('end', myFunction1);
     * annyang.addCallback('end', myFunction2);
     *
     * // Remove all callbacks from all events:
     * annyang.removeCallback();
     *
     * // Remove all callbacks attached to end event:
     * annyang.removeCallback('end');
     *
     * // Remove myFunction2 from being called on start:
     * annyang.removeCallback('start', myFunction2);
     *
     * // Remove myFunction1 from being called on all events:
     * annyang.removeCallback(undefined, myFunction1);
     * ````
     *
     * @param type Name of event type to remove callback from
     * @param callback The callback function to remove
     * @returns undefined
     * @method removeCallback
     */
    removeCallback: function removeCallback(type, callback) {
      var compareWithCallbackParameter = function compareWithCallbackParameter(cb) {
        return cb.callback !== callback;
      };
      // Go over each callback type in callbacks store object
      for (var callbackType in callbacks) {
        if (callbacks.hasOwnProperty(callbackType)) {
          // if this is the type user asked to delete, or he asked to delete all, go ahead.
          if (type === undefined || type === callbackType) {
            // If user asked to delete all callbacks in this type or all types
            if (callback === undefined) {
              callbacks[callbackType] = [];
            } else {
              // Remove all matching callbacks
              callbacks[callbackType] = callbacks[callbackType].filter(compareWithCallbackParameter);
            }
          }
        }
      }
    },

    /**
     * Returns true if speech recognition is currently on.
     * Returns false if speech recognition is off or annyang is paused.
     *
     * @return boolean true = SpeechRecognition is on and annyang is listening
     * @method isListening
     */
    isListening: function isListening() {
      return _isListening && !pauseListening;
    },

    /**
     * Returns the instance of the browser's SpeechRecognition object used by annyang.
     * Useful in case you want direct access to the browser's Speech Recognition engine.
     *
     * @returns SpeechRecognition The browser's Speech Recognizer currently used by annyang
     * @method getSpeechRecognizer
     */
    getSpeechRecognizer: function getSpeechRecognizer() {
      return recognition;
    },

    /**
     * Simulate speech being recognized. This will trigger the same events and behavior as when the Speech Recognition
     * detects speech.
     *
     * Can accept either a string containing a single sentence, or an array containing multiple sentences to be checked
     * in order until one of them matches a command (similar to the way Speech Recognition Alternatives are parsed)
     *
     * #### Examples:
     * ````javascript
     * annyang.trigger('Time for some thrilling heroics');
     * annyang.trigger(
     *     ['Time for some thrilling heroics', 'Time for some thrilling aerobics']
     *   );
     * ````
     *
     * @param string|array sentences A sentence as a string or an array of strings of possible sentences
     * @returns undefined
     * @method trigger
     */
    trigger: function trigger(sentences) {
      if (!annyang.isListening()) {
        if (debugState) {
          if (!_isListening) {
            logMessage('Cannot trigger while annyang is aborted');
          } else {
            logMessage('Speech heard, but annyang is paused');
          }
        }
        return;
      }

      if (!Array.isArray(sentences)) {
        sentences = [sentences];
      }

      parseResults(sentences);
    }
  };

  return annyang;
});

/**
 * # Good to Know
 *
 * ## Commands Object
 *
 * Both the [init()]() and addCommands() methods receive a `commands` object.
 *
 * annyang understands commands with `named variables`, `splats`, and `optional words`.
 *
 * * Use `named variables` for one word arguments in your command.
 * * Use `splats` to capture multi-word text at the end of your command (greedy).
 * * Use `optional words` or phrases to define a part of the command as optional.
 *
 * #### Examples:
 * ````html
 * <script>
 * var commands = {
 *   // annyang will capture anything after a splat (*) and pass it to the function.
 *   // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
 *   'show me *tag': showFlickr,
 *
 *   // A named variable is a one word variable, that can fit anywhere in your command.
 *   // e.g. saying "calculate October stats" will call calculateStats('October');
 *   'calculate :month stats': calculateStats,
 *
 *   // By defining a part of the following command as optional, annyang will respond
 *   // to both: "say hello to my little friend" as well as "say hello friend"
 *   'say hello (to my little) friend': greeting
 * };
 *
 * var showFlickr = function(tag) {
 *   var url = 'http://api.flickr.com/services/rest/?tags='+tag;
 *   $.getJSON(url);
 * }
 *
 * var calculateStats = function(month) {
 *   $('#stats').text('Statistics for '+month);
 * }
 *
 * var greeting = function() {
 *   $('#greeting').text('Hello!');
 * }
 * </script>
 * ````
 *
 * ### Using Regular Expressions in commands
 * For advanced commands, you can pass a regular expression object, instead of
 * a simple string command.
 *
 * This is done by passing an object containing two properties: `regexp`, and
 * `callback` instead of the function.
 *
 * #### Examples:
 * ````javascript
 * var calculateFunction = function(month) { console.log(month); }
 * var commands = {
 *   // This example will accept any word as the "month"
 *   'calculate :month stats': calculateFunction,
 *   // This example will only accept months which are at the start of a quarter
 *   'calculate :quarter stats': {'regexp': /^calculate (January|April|July|October) stats$/, 'callback': calculateFunction}
 * }
 ````
 *
 */
//# sourceMappingURL=annyang.js.map
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (a) {
  return typeof a === "undefined" ? "undefined" : _typeof2(a);
} : function (a) {
  return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a === "undefined" ? "undefined" : _typeof2(a);
};
//! annyang
//! version : 2.6.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://www.TalAter.com/annyang/
!function (a, b) {
  "function" == typeof define && define.amd ? define([], function () {
    return a.annyang = b(a);
  }) : "object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = b(a) : a.annyang = b(a);
}("undefined" != typeof window ? window : void 0, function (a, b) {
  var c,
      d = a.SpeechRecognition || a.webkitSpeechRecognition || a.mozSpeechRecognition || a.msSpeechRecognition || a.oSpeechRecognition;if (!d) return null;var e,
      f,
      g = [],
      h = { start: [], error: [], end: [], soundstart: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [] },
      i = 0,
      j = 0,
      k = !1,
      l = "font-weight: bold; color: #00f;",
      m = !1,
      n = !1,
      o = /\s*\((.*?)\)\s*/g,
      p = /(\(\?:[^)]+\))\?/g,
      q = /(\(\?)?:\w+/g,
      r = /\*\w+/g,
      s = /[\-{}\[\]+?.,\\\^$|#]/g,
      t = function t(a) {
    return a = a.replace(s, "\\$&").replace(o, "(?:$1)?").replace(q, function (a, b) {
      return b ? a : "([^\\s]+)";
    }).replace(r, "(.*?)").replace(p, "\\s*$1?\\s*"), new RegExp("^" + a + "$", "i");
  },
      u = function u(a) {
    for (var b = arguments.length, c = Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++) {
      c[d - 1] = arguments[d];
    }a.forEach(function (a) {
      a.callback.apply(a.context, c);
    });
  },
      v = function v() {
    return e !== b;
  },
      w = function w(a, b) {
    a.indexOf("%c") !== -1 || b ? console.log(a, b || l) : console.log(a);
  },
      x = function x() {
    v() || c.init({}, !1);
  },
      y = function y(a, b, c) {
    g.push({ command: a, callback: b, originalPhrase: c }), k && w("Command successfully loaded: %c" + c, l);
  },
      z = function z(a) {
    u(h.result, a);for (var b, c = 0; c < a.length; c++) {
      b = a[c].trim(), k && w("Speech recognized: %c" + b, l);for (var d = 0, e = g.length; d < e; d++) {
        var f = g[d],
            i = f.command.exec(b);if (i) {
          var j = i.slice(1);return k && (w("command matched: %c" + f.originalPhrase, l), j.length && w("with parameters", j)), f.callback.apply(this, j), void u(h.resultMatch, b, f.originalPhrase, a);
        }
      }
    }u(h.resultNoMatch, a);
  };return c = { init: function init(l) {
      var o = !(arguments.length > 1 && arguments[1] !== b) || arguments[1];e && e.abort && e.abort(), e = new d(), e.maxAlternatives = 5, e.continuous = "http:" === a.location.protocol, e.lang = "en-US", e.onstart = function () {
        n = !0, u(h.start);
      }, e.onsoundstart = function () {
        u(h.soundstart);
      }, e.onerror = function (a) {
        switch (u(h.error, a), a.error) {case "network":
            u(h.errorNetwork, a);break;case "not-allowed":case "service-not-allowed":
            f = !1, new Date().getTime() - i < 200 ? u(h.errorPermissionBlocked, a) : u(h.errorPermissionDenied, a);}
      }, e.onend = function () {
        if (n = !1, u(h.end), f) {
          var a = new Date().getTime() - i;j += 1, j % 10 === 0 && k && w("Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips."), a < 1e3 ? setTimeout(function () {
            c.start({ paused: m });
          }, 1e3 - a) : c.start({ paused: m });
        }
      }, e.onresult = function (a) {
        if (m) return k && w("Speech heard, but annyang is paused"), !1;for (var b = a.results[a.resultIndex], c = [], d = 0; d < b.length; d++) {
          c[d] = b[d].transcript;
        }z(c);
      }, o && (g = []), l.length && this.addCommands(l);
    }, start: function start(a) {
      x(), a = a || {}, m = a.paused !== b && !!a.paused, f = a.autoRestart === b || !!a.autoRestart, a.continuous !== b && (e.continuous = !!a.continuous), i = new Date().getTime();try {
        e.start();
      } catch (a) {
        k && w(a.message);
      }
    }, abort: function abort() {
      f = !1, j = 0, v() && e.abort();
    }, pause: function pause() {
      m = !0;
    }, resume: function resume() {
      c.start();
    }, debug: function debug() {
      var a = !(arguments.length > 0 && arguments[0] !== b) || arguments[0];k = !!a;
    }, setLanguage: function setLanguage(a) {
      x(), e.lang = a;
    }, addCommands: function addCommands(b) {
      var c;x();for (var d in b) {
        if (b.hasOwnProperty(d)) if (c = a[b[d]] || b[d], "function" == typeof c) y(t(d), c, d);else {
          if (!("object" === ("undefined" == typeof c ? "undefined" : _typeof(c)) && c.regexp instanceof RegExp)) {
            k && w("Can not register command: %c" + d, l);continue;
          }y(new RegExp(c.regexp.source, "i"), c.callback, d);
        }
      }
    }, removeCommands: function removeCommands(a) {
      a === b ? g = [] : (a = Array.isArray(a) ? a : [a], g = g.filter(function (b) {
        for (var c = 0; c < a.length; c++) {
          if (a[c] === b.originalPhrase) return !1;
        }return !0;
      }));
    }, addCallback: function addCallback(c, d, e) {
      var f = a[d] || d;"function" == typeof f && h[c] !== b && h[c].push({ callback: f, context: e || this });
    }, removeCallback: function removeCallback(a, c) {
      var d = function d(a) {
        return a.callback !== c;
      };for (var e in h) {
        h.hasOwnProperty(e) && (a !== b && a !== e || (c === b ? h[e] = [] : h[e] = h[e].filter(d)));
      }
    }, isListening: function isListening() {
      return n && !m;
    }, getSpeechRecognizer: function getSpeechRecognizer() {
      return e;
    }, trigger: function trigger(a) {
      return c.isListening() ? (Array.isArray(a) || (a = [a]), void z(a)) : void (k && w(n ? "Speech heard, but annyang is paused" : "Cannot trigger while annyang is aborted"));
    } };
});
"use strict";

/* ========================================================================
* Copyright (c) <2013> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function () {
	"use strict";

	var Dropdown = {};

	Dropdown.prototype = {
		btn: null,
		prt: null,
		menu: null,
		wrap: "false",

		clearMenus: function clearMenus() {
			var self = this;
			setTimeout(function () {
				var isActive = self.prt.classList.contains('open');
				if (!isActive || self.prt.contains(document.activeElement)) {
					return;
				}
				self.prt.classList.remove('open');
				self.btn.setAttribute('aria-expanded', 'false');
			}, 150);
		},

		toggleOptList: function toggleOptList(e) {
			this.btn = e.target;
			this.prt = this.btn.parentNode;
			this.menu = document.getElementById(this.btn.getAttribute('data-target'));

			if (typeof this.btn.getAttribute('data-wrap') !== 'undefined') {
				this.wrap = this.btn.getAttribute('data-wrap');
			}
			this.prt.classList.toggle('open');
			//Set Aria-expanded to true only if the class open exists in dropMenu div
			if (this.prt.classList.contains('open')) {
				this.btn.setAttribute('aria-expanded', 'true');
			} else {
				this.btn.setAttribute('aria-expanded', 'false');
			}
			try {
				this.menu.getElementsByTagName('a')[0].focus();
			} catch (err) {}
		},

		navigateMenus: function navigateMenus(e) {
			var keyCode = e.keyCode || e.which,
			    arrow = {
				spacebar: 32,
				up: 38,
				esc: 27,
				down: 40
			},
			    isActive = this.prt.classList.contains('open'),
			    items = this.menu.getElementsByTagName("a"),
			    index = Array.prototype.indexOf.call(items, e.target);

			if (!/(32|38|40|27)/.test(keyCode)) {
				return;
			}
			e.preventDefault();

			switch (keyCode) {
				case arrow.down:
					index = index + 1;
					break;
				case arrow.up:
					index = index - 1;
					break;
				case arrow.esc:
					if (isActive) {
						this.btn.click();
						this.btn.focus();
						return;
					}
					break;
			}
			if (index < 0) {
				if (this.wrap === 'true') {
					index = items.length - 1;
				} else {
					index = 0;
				}
			}
			if (index === items.length) {
				if (this.wrap === 'true') {
					index = 0;
				} else {
					index = items.length - 1;
				}
			}

			items.item(index).focus();
		},

		init: function init() {
			var toggle = document.getElementsByClassName('dropMenu-toggle'),
			    toggleBtn,
			    k,
			    l,
			    menu,
			    items,
			    i,
			    j,
			    self = this,
			    item;

			for (k = 0, l = toggle.length; k < l; k = k + 1) {
				toggleBtn = toggle[k];
				menu = document.getElementById(toggleBtn.getAttribute('data-target'));
				items = menu.getElementsByTagName("a");

				toggleBtn.addEventListener('click', function (e) {
					self.toggleOptList(e);
				});
				toggleBtn.addEventListener('keydown', function (e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode === 32) {
						//SpaceBar should open the menu
						this.click(e);
						e.preventDefault();
					}
				});

				for (i = 0, j = items.length; i < j; i = i + 1) {
					item = items[i];
					item.addEventListener('keydown', function (e) {
						self.navigateMenus(e);
					});

					item.addEventListener('blur', function (e) {
						self.clearMenus(e);
					});
				}
			}
		} //end init

	}; //End Dropdown class

	Dropdown.prototype.init();
})();
"use strict";

/* ========================================================================
* Copyright (c) <2013> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function () {

	/*global self, document, DOMException */
	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

		(function (view) {

			"use strict";

			if (!('HTMLElement' in view) && !('Element' in view)) return;

			var classListProp = "classList",
			    protoProp = "prototype",
			    elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
			    objCtr = Object,
			    strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			    arrIndexOf = Array[protoProp].indexOf || function (item) {
				var i = 0,
				    len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			,
			    DOMEx = function DOMEx(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
				if (token === "") {
					throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
				}
				if (/\s/.test(token)) {
					throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
				}
				return arrIndexOf.call(classList, token);
			},
			    ClassList = function ClassList(elem) {
				var trimmedClasses = strTrim.call(elem.className),
				    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
				    i = 0,
				    len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.className = this.toString();
				};
			},
			    classListProto = ClassList[protoProp] = [],
			    classListGetter = function classListGetter() {
				return new ClassList(this);
			};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false;
				do {
					token = tokens[i] + "";
					var index = checkTokenAndGetIndex(this, token);
					if (index !== -1) {
						this.splice(index, 1);
						updated = true;
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, forse) {
				token += "";

				var result = this.contains(token),
				    method = result ? forse !== true && "remove" : forse !== false && "add";

				if (method) {
					this[method](token);
				}

				return !result;
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) {
					// IE 8 doesn't support enumerable:true
					if (ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}
		})(self);
	}
	/* End classList.js */

	if (!Window.prototype.addEventListener) {

		HTMLDocument.prototype.addEventListener = Element.prototype.addEventListener = Window.prototype.addEventListener = function (type, fCallback, capture) {
			var modtypeForIE = "on" + type;
			if (capture) {
				throw new Error("This implementation of addEventListener does not support the capture phase");
			}
			var nodeWithListener = this;
			this.attachEvent(modtypeForIE, function (e) {
				// Add some extensions directly to 'e' (the actual event instance)
				// Create the 'currentTarget' property (read-only)
				Object.defineProperty(e, 'currentTarget', {
					get: function get() {
						// 'nodeWithListener' as defined at the time the listener was added.
						return nodeWithListener;
					}
				});
				// Create the 'eventPhase' property (read-only)
				Object.defineProperty(e, 'eventPhase', {
					get: function get() {
						return e.srcElement == nodeWithListener ? 2 : 3; // "AT_TARGET" = 2, "BUBBLING_PHASE" = 3
					}
				});
				// Create a 'timeStamp' (a read-only Date object)
				var time = new Date(); // The current time when this anonymous function is called.
				Object.defineProperty(e, 'timeStamp', {
					get: function get() {
						return time;
					}
				});
				// Call the function handler callback originally provided...if callback function available
				if (typeof fCallback === 'function') fCallback.call(nodeWithListener, e); // Re-bases 'this' to be correct for the callback.
			});
		};

		// Extend Event.prototype with a few of the W3C standard APIs on Event Add 'target' object (read-only)
		Object.defineProperty(Event.prototype, 'target', {
			get: function get() {
				return this.srcElement;
			}
		});
		// Add 'stopPropagation' and 'preventDefault' methods
		Event.prototype.stopPropagation = function () {
			this.cancelBubble = true;
		};
		Event.prototype.preventDefault = function () {
			this.returnValue = false;
		};
	}

	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function (classNames) {
			classNames = String(classNames).replace(/^|\s+/g, '.');
			return document.querySelectorAll(classNames);
		};
		Element.prototype.getElementsByClassName = document.getElementsByClassName;
	}

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
			if (this == null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;

			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) {
					// shortcut for verifying if it's NaN
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		};
	}
})();
'use strict';

/* ========================================================================
* Copyright (c) <2013> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function (appConfig) {
	"use strict";

	var SkipTo = {};

	SkipTo.prototype = {
		headingElementsArr: [],
		landmarkElementsArr: [],
		idElementsArr: [],
		dropdownHTML: null,
		config: {
			buttonLabel: 'Skip To...',
			menuLabel: 'Skip To and Page Outline',
			landmarksLabel: 'Skip To',
			headingsLabel: 'Page Outline',
			main: 'main, [role="main"]',
			landmarks: '[role="navigation"], [role="search"]',
			sections: 'nav',
			headings: 'h1, h2, h3',
			ids: '#SkipToA1, #SkipToA2',
			accessKey: '0',
			wrap: "false",
			visibility: "onFocus",
			customClass: "",
			attachElement: document.body
		},

		setUpConfig: function setUpConfig(appConfig) {
			var localConfig = this.config,
			    name,
			    appConfigSettings = typeof appConfig.settings !== 'undefined' ? appConfig.settings.skipTo : {};

			for (name in appConfigSettings) {
				//overwrite values of our local config, based on the external config
				if (localConfig.hasOwnProperty(name)) {
					localConfig[name] = appConfigSettings[name];
				}
			}
		},

		init: function init(appConfig) {

			this.setUpConfig(appConfig);

			var div = document.createElement('div'),
			    attachElement = !this.config.attachElement.nodeType ? document.querySelector(this.config.attachElement) : this.config.attachElement,
			    htmlStr = '';
			div.setAttribute('id', 'skipToMenu');
			div.setAttribute('role', 'complementary');
			div.setAttribute('title', 'Skip To Keyboard Navigation');

			this.addStyles("@@cssContent");

			this.dropdownHTML = '<a accesskey="' + this.config.accessKey + '" tabindex="0" data-wrap="' + this.config.wrap + '"class="dropMenu-toggle skipTo ' + this.config.visibility + ' ' + this.config.customClass + '" id="drop4" role="button" aria-haspopup="true" ';
			this.dropdownHTML += 'aria-expanded="false" data-toggle="dropMenu" href="#" data-target="menu1">' + this.config.buttonLabel + '<span class="caret"></span></a>';
			this.dropdownHTML += '<ul id="menu1" class="dropMenu-menu" role="menu" aria-label="' + this.config.menuLabel + '" style="top:3%; text-align:left">';

			this.getLandMarks(this.config.main);
			this.getLandMarks(this.config.landmarks);
			this.getSections(this.config.sections);

			this.getIdElements();

			this.getHeadings();

			htmlStr = this.getdropdownHTML();
			this.dropdownHTML += htmlStr + '</ul>';

			if (htmlStr.length > 0) {
				div.className = "dropMenu";
				attachElement.insertBefore(div, attachElement.firstChild);
				div.innerHTML = this.dropdownHTML;
				this.addListeners();
			}
		},

		normalizeName: function normalizeName(name) {
			if (typeof name === 'string') return name.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
			return "";
		},

		getTextContent: function getTextContent(elem) {

			function getText(e, strings) {
				// If text node get the text and return
				if (e.nodeType === 3) {
					/*IE8 - Node.TEXT_NODE*/
					strings.push(e.data);
				} else {
					// if an element for through all the children elements looking for text
					if (e.nodeType === 1) {
						/*IE8 - Node.ELEMENT_NODE*/
						// check to see if IMG or AREA element and to use ALT content if defined
						var tagName = e.tagName.toLowerCase();
						if (tagName === 'img' || tagName === 'area') {
							if (e.alt) {
								strings.push(e.alt);
							}
						} else {
							var c = e.firstChild;
							while (c) {
								getText(c, strings);
								c = c.nextSibling;
							} // end loop
						}
					}
				}
			} // end function getStrings

			// Create return object
			var str = "Test",
			    strings = [];
			getText(elem, strings);
			if (strings.length) str = strings.join(" ");
			if (str.length > 30) str = str.substring(0, 27) + "...";
			return str;
		},

		getAccessibleName: function getAccessibleName(elem) {
			var labelledbyIds = elem.getAttribute('aria-labelledby'),
			    label = elem.getAttribute('aria-label'),
			    title = elem.getAttribute('title'),
			    name = "";

			if (labelledbyIds && labelledbyIds.length) {
				var str,
				    strings = [],
				    ids = labelledbyIds.split(' ');
				if (!ids.length) ids = [labelledbyIds];
				for (var i = 0, l = ids.length; i < l; i += 1) {
					var e = document.getElementById(ids[i]);
					if (e) str = this.getTextContent(e);
					if (str.length) strings.push(str);
				}
				name = strings.join(" ");
			} else {
				if (label && label.length) {
					name = label;
				} else {
					if (title && title.length) {
						name = title;
					}
				}
			}
			return name;
		},

		getHeadings: function getHeadings() {
			var targets = this.config.headings;
			if (typeof targets !== 'string' || targets.length === 0) return;
			var headings = document.querySelectorAll(targets),
			    i,
			    j,
			    heading,
			    role,
			    id;
			for (i = 0, j = headings.length; i < j; i = i + 1) {
				heading = headings[i];
				role = heading.getAttribute('role');
				if (typeof role === 'string' && role === 'presentation') continue;
				if (this.isVisible(heading)) {
					id = heading.getAttribute('id') || heading.innerHTML.replace(/\s+/g, '_').toLowerCase().replace(/[&\/\\#,+()$~%.'"!:*?<>{}¹]/g, '') + '_' + i;

					heading.tabIndex = "-1";
					heading.setAttribute('id', id);

					//this.headingElementsArr[id] = heading.tagName.toLowerCase() + ": " + this.getTextContent(heading);
					//IE8 fix: Use JSON object to supply names to array values. This allows enumerating over the array without picking up prototype properties.
					this.headingElementsArr[id] = { id: id, name: heading.tagName.toLowerCase() + ": " + this.getTextContent(heading) };
				}
			}
		},

		isVisible: function isVisible(element) {

			function isVisibleRec(el) {
				if (el.nodeType === 9) return true; /*IE8 does not support Node.DOCUMENT_NODE*/

				//For IE8: Use standard means if available, otherwise use the IE methods
				var display = document.defaultView ? document.defaultView.getComputedStyle(el, null).getPropertyValue('display') : el.currentStyle.display;
				var visibility = document.defaultView ? document.defaultView.getComputedStyle(el, null).getPropertyValue('visibility') : el.currentStyle.visibility;
				//var computedStyle = window.getComputedStyle(el, null);
				//var display = computedStyle.getPropertyValue('display');
				//var visibility = computedStyle.getPropertyValue('visibility');
				var hidden = el.getAttribute('hidden');
				var ariaHidden = el.getAttribute('aria-hidden');
				var clientRect = el.getBoundingClientRect();

				if (display === 'none' || visibility === 'hidden' || hidden !== null || ariaHidden === 'true' || clientRect.height < 4 || clientRect.width < 4) {
					return false;
				}

				return isVisibleRec(el.parentNode);
			}

			return isVisibleRec(element);
		},

		getSections: function getSections(targets) {
			if (typeof targets !== 'string' || targets.length === 0) return;
			var sections = document.querySelectorAll(targets),
			    k,
			    l,
			    section,
			    id1,
			    role,
			    val,
			    name;

			for (k = 0, l = sections.length; k < l; k = k + 1) {
				section = sections[k];
				role = section.getAttribute(role);
				if (typeof role === 'string' && role === 'presentation') continue;
				if (this.isVisible(section)) {
					id1 = section.getAttribute('id') || 'ui-skip-' + Math.floor(Math.random() * 100 + 1);
					section.tabIndex = "-1";
					section.setAttribute('id', id1);
					role = section.tagName.toLowerCase();
					val = this.normalizeName(role);

					name = this.getAccessibleName(section);

					if (name && name.length) {
						val += ": " + name;
					} else {
						if (role === 'main') {
							val += ' Content';
						}
					}
					this.landmarkElementsArr[id1] = val;
				}
			}
		},

		getLandMarks: function getLandMarks(targets) {
			if (typeof targets !== 'string' || targets.length === 0) return;
			var landmarks = document.querySelectorAll(targets),
			    k,
			    l,
			    landmark,
			    id1,
			    role,
			    name,
			    val;

			for (k = 0, l = landmarks.length; k < l; k = k + 1) {
				landmark = landmarks[k];
				role = landmark.getAttribute('role');
				if (typeof role === 'string' && role === 'presentation') continue;
				if (this.isVisible(landmark)) {
					id1 = landmark.getAttribute('id') || 'ui-skip-' + Math.floor(Math.random() * 100 + 1);
					landmark.tabIndex = "-1";
					landmark.setAttribute('id', id1);
					if (!role) role = landmark.tagName.toLowerCase();
					name = this.getAccessibleName(landmark);

					if (role === 'banner') {
						role = 'header';
					} // banner landmark is the same as header element in HTML5

					if (role === 'contentinfo') {
						role = 'footer';
					} //contentinfo landmark is the same as footer element in HTML5

					if (role === 'navigation') {
						role = 'nav';
					} // navigation landmark is the same as nav element in HTML5

					val = this.normalizeName(role);

					if (name && name.length) {
						val += ": " + name;
					} else {
						if (role === 'main') {
							val += ' Content';
						}
					}
					this.landmarkElementsArr[id1] = val;
				}
			}
		},

		getIdElements: function getIdElements() {
			var els = document.querySelectorAll(this.config.ids),
			    i,
			    j,
			    el,
			    id,
			    val;

			for (i = 0, j = els.length; i < j; i = i + 1) {
				el = els[i];
				id = el.getAttribute('id');
				/*val = el.innerHTML.replace(/<\/?[^>]+>/gi, '').replace(/\s+/g, ' ').trim();*/
				val = el.innerHTML.replace(/<\/?[^>]+>/gi, '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ""); /*for IE8*/

				if (val.length > 30) val = val.replace(val, val.substr(0, 30) + '...');
				this.idElementsArr[id] = "id: " + val;
			}
		},

		getdropdownHTML: function getdropdownHTML() {
			var key,
			    val,
			    htmlStr = '',
			    landmarkSep = true,
			    headingSep = true,
			    headingClass = '';

			// window.console.log(this.elementsArr);

			//IE8 fix: for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//Make sure that the key is not from the prototype.
			for (key in this.landmarkElementsArr) {
				if (this.landmarkElementsArr.hasOwnProperty(key)) {
					if (landmarkSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.landmarksLabel + '</li>';
						landmarkSep = false;
					}
					val = this.landmarkElementsArr[key];
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">' + val;
					htmlStr += '</a></li>';
				}
			}

			//IE8 fix: for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//Make sure that the key is not from the prototype.
			for (key in this.idElementsArr) {
				if (this.idElementsArr.hasOwnProperty(key)) {
					if (landmarkSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.landmarksLabel + '</li>';
						landmarkSep = false;
					}
					val = this.idElementsArr[key];
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">' + val;
					htmlStr += '</a></li>';
				}
			}
			//for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//James' workaround to get for JSON name/value pair appears to address the issue.
			for (key in this.headingElementsArr) {
				if (this.headingElementsArr[key].name) {
					if (headingSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.headingsLabel + '</li>';
						headingSep = false;
					}
					val = this.headingElementsArr[key].name;

					headingClass = val.substring(0, 2);

					htmlStr += '<li role="presentation" style="list-style:none outside none"><a class="po-' + headingClass + '" tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">' + val;
					htmlStr += '</a></li>';
				}
			}

			return htmlStr;
		},

		addStyles: function addStyles(cssString) {
			var ss1 = document.createElement('style'),
			    hh1 = document.getElementsByTagName('head')[0],
			    tt1;

			ss1.setAttribute("type", "text/css");
			hh1.appendChild(ss1);

			if (ss1.styleSheet) {
				// IE
				ss1.styleSheet.cssText = cssString;
			} else {
				tt1 = document.createTextNode(cssString);
				ss1.appendChild(tt1);
			}
		},

		addListeners: function addListeners() {
			window.addEventListener("hashchange", function () {
				var element = document.getElementById(location.hash.substring(1));
				if (element) {
					if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
						element.tabIndex = -1;
					}
					element.focus();
					element.scrollIntoView(true); //IE8 - Make sure to scroll to top
				}
			}, false);
		}
	};

	SkipTo.prototype.init(appConfig);
})(window.Drupal || window.Wordpress || window.SkipToConfig || {});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var accessibilityUtilInstance = null;

var AccessibilityUtil = function (_Util) {
    _inherits(AccessibilityUtil, _Util);

    function AccessibilityUtil() {
        var _ret;

        _classCallCheck(this, AccessibilityUtil);

        var _this = _possibleConstructorReturn(this, (AccessibilityUtil.__proto__ || Object.getPrototypeOf(AccessibilityUtil)).call(this));

        if (!accessibilityUtilInstance) {
            accessibilityUtilInstance = _this;
        }
        return _ret = accessibilityUtilInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(AccessibilityUtil, [{
        key: 'initAccessibility',
        value: function initAccessibility() {}
    }]);

    return AccessibilityUtil;
}(Util);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var annyangUtilInstance = null;

var AnnyangUtil = function (_Util) {
    _inherits(AnnyangUtil, _Util);

    function AnnyangUtil() {
        var _ret;

        _classCallCheck(this, AnnyangUtil);

        var _this = _possibleConstructorReturn(this, (AnnyangUtil.__proto__ || Object.getPrototypeOf(AnnyangUtil)).call(this));

        if (!annyangUtilInstance) {
            _this.languages = { hebrew: 'he', english: 'en-US', arabic: 'ar' };
            _this.jsonData = {
                "lang": [{ "he": [{ "link": "עבור" }, { "button": "לחץ על" }, { "imgCloseModal": "סגור חלון" }, { "imgScrollModalDown": "למטה" }, { "imgScrollModalUp": "למעלה" }, { "accessibility_close": "סגור נגישות" }, { "accessibility_open": "פתח נגישות" }, { "exit": "יציאה" }],
                    "en-US": [{ "link": "go to" }, { "button": "click on" }, { "imgCloseModal": "close window" }, { "imgScrollModalDown": "down" }, { "imgScrollModalUp": "up" }, { "accessibility_close": "close accessibility" }, { "accessibility_open": "open accessibility" }, { "stopTTV": "stop" }, { "exit": "exit" }]
                }]
            };
            _this.userLanguages;
            annyangUtilInstance = _this;
        }
        return _ret = annyangUtilInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(AnnyangUtil, [{
        key: 'setLanguages',
        value: function setLanguages(languages) {
            this.userLanguages = languages;
        }
        //init annyang if the admin does not define lang the default lang will be hebrew

    }, {
        key: 'initAnnyang',
        value: function initAnnyang(languages) {
            this.setLanguages(languages);
            if (annyang) {
                if (languages != null || languages != undefined) {
                    console.log(languages);
                    annyang.setLanguage(this.languages[languages]);
                } else {
                    annyang.setLanguage('he');
                }
                annyang.start();
                annyang.debug();
            }
        }
    }, {
        key: 'addAnnyangCommands',
        value: function addAnnyangCommands(options) {
            annyang.addCommands(options.commands);
        }

        //this function return keyword according the lang

    }, {
        key: 'getLangObj',
        value: function getLangObj() {
            // let jsonObject = JSON.parse(this.jsonData);
            if (this.userLanguages != null || this.userLanguages != undefined) {
                return this.jsonData["lang"][0][this.languages[this.userLanguages]];
            } else {
                return this.jsonData["lang"][0]["he"];
            }
        }
        //init exit command

    }, {
        key: 'addExitCommand',
        value: function addExitCommand() {

            var commands = {};

            var langObj = this.getLangObj();
            for (var langCommand in langObj) {
                if (langObj[langCommand].hasOwnProperty("exit")) {
                    commands[langObj[langCommand]["exit"]] = function () {
                        window.location.replace("index.html");
                    };
                }
            }

            var annyangOptions = { commands: commands };
            this.addAnnyangCommands(annyangOptions);
        }
    }]);

    return AnnyangUtil;
}(Util);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var boxModalUtilInstance = null;

var BoxModelUtil = function (_Util) {
    _inherits(BoxModelUtil, _Util);

    function BoxModelUtil() {
        var _ret;

        _classCallCheck(this, BoxModelUtil);

        var _this = _possibleConstructorReturn(this, (BoxModelUtil.__proto__ || Object.getPrototypeOf(BoxModelUtil)).call(this));

        if (!boxModalUtilInstance) {
            _this.annyangUtil = new AnnyangUtil();
            _this.divModel = document.createElement("div");
            _this.divContent = document.createElement("div");
            _this.spanClose = document.createElement("span");
            _this.pararpghText = document.createElement("p");
            _this.initModal();
            boxModalUtilInstance = _this;
        }
        return _ret = boxModalUtilInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(BoxModelUtil, [{
        key: "initModal",
        value: function initModal() {
            // let divModel = document.createElement("div");
            this.divModel.setAttribute("id", "myModal");
            this.divModel.setAttribute("class", "modal");
            // let divContent = document.createElement("div");
            this.divContent.setAttribute("class", "modal-content");
            // let spanClose = document.createElement("span");
            this.spanClose.setAttribute("class", "close");
            this.spanClose.innerHTML = "&times";
            // let pararpghText = document.createElement("p");
            this.pararpghText.setAttribute("class", "content-paragraph modal-scroll");
            this.pararpghText.innerHTML = "";
            this.divContent.appendChild(this.spanClose);
            this.divContent.appendChild(this.pararpghText);
            this.divModel.appendChild(this.divContent);
            document.body.appendChild(this.divModel);

            // Get the modal
            var modal = document.getElementById('myModal');
            // modal.style.display = "block";


            // When the user clicks on <span> (x), close the modal
            this.spanClose.onclick = function () {
                var modal = document.getElementById('myModal');
                modal.style.display = "none";
            };

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                var modal = document.getElementById('myModal');
                if (event.target == modal) {
                    sessionStorage.scrollPosition = 0;
                    console.log("insied modal close " + sessionStorage.getItem("scrollPosition"));
                    $(".modal-content").scrollTop(0);
                    modal.style.display = "none";
                }
            };
        }
    }, {
        key: "setText",
        value: function setText(allText) {

            this.pararpghText.innerHTML = "";
            // By lines
            var lines = allText.split('\n');
            for (var line = 0; line < lines.length; line++) {
                this.pararpghText.innerHTML += lines[line];
                this.pararpghText.innerHTML += "<br>";
            }
            this.divModel.style.display = "block";
        }
    }]);

    return BoxModelUtil;
}(Util);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var chatUtilInstance = null;

var ChatUtil = function (_Util) {
    _inherits(ChatUtil, _Util);

    function ChatUtil() {
        var _ret;

        _classCallCheck(this, ChatUtil);

        var _this = _possibleConstructorReturn(this, (ChatUtil.__proto__ || Object.getPrototypeOf(ChatUtil)).call(this));

        if (!chatUtilInstance) {
            chatUtilInstance = _this;
        }
        return _ret = chatUtilInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ChatUtil, [{
        key: 'initChat',
        value: function initChat(wsChatServer) {
            var wsUri = wsChatServer;
            var websocket = new WebSocket(wsUri);
            var myname;

            websocket.onopen = function (ev) {
                // connection is open
                $('#message_box').append("<div class=\"system_msg\">Connected!</div>"); //notify user
            };

            $('#send-btn').click(function () {
                //use clicks message send button
                var mymessage = $('#message').val(); //get message text
                myname = $('#name').val(); //get user name

                if (myname == "") {
                    //empty name?
                    alert("Enter your Name please!");
                    return;
                }
                if (mymessage == "") {
                    //emtpy message?
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
                    color: '<?php echo $colours[$user_colour]; ?>'
                };
                //convert and send data to server
                websocket.send(JSON.stringify(msg));
            });

            //#### Message received from server?
            websocket.onmessage = function (ev) {
                var msg = JSON.parse(ev.data); //PHP sends Json data
                var type = msg.type; //message type
                var umsg = msg.message; //message text
                var uname = msg.name; //user name
                var ucolor = msg.color; //color

                if (type == 'usermsg' && uname != null) {
                    $('#message_box').append("<div><span class=\"user_name\" style=\"color:#" + ucolor + "\">" + uname + "</span> : <span class=\"user_message\">" + umsg + "</span></div>");
                    //voice to text only what the other says
                    if (sessionStorage.getItem("utils").indexOf("ttv") != -1) {
                        if (uname != myname) {
                            var u = new SpeechSynthesisUtterance(uname + "said" + umsg);
                            u.lang = 'en-US';
                            var speaker = new SpeechUtil();
                            speaker.startSpeak(u);
                        }
                    }
                }
                if (type == 'system' && umsg != null) {
                    $('#message_box').append("<div class=\"system_msg\">" + umsg + "</div>");
                }

                $('#message').val(''); //reset text

                var objDiv = document.getElementById("message_box");
                objDiv.scrollTop = objDiv.scrollHeight;
            };

            websocket.onerror = function (ev) {
                $('#message_box').append("<div class=\"system_error\">Error Occurred - " + ev.data + "</div>");
            };
            websocket.onclose = function (ev) {
                $('#message_box').append("<div class=\"system_msg\">Connection Closed</div>");
            };
        }
    }]);

    return ChatUtil;
}(Util);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpeechUtilInstance = null;

var SpeechUtil = function (_Util) {
    _inherits(SpeechUtil, _Util);

    function SpeechUtil() {
        var _ret;

        _classCallCheck(this, SpeechUtil);

        var _this = _possibleConstructorReturn(this, (SpeechUtil.__proto__ || Object.getPrototypeOf(SpeechUtil)).call(this));

        if (!SpeechUtilInstance) {
            _this.languages = { english: 'en-US', france: 'fr-FR', arabic: 'ar-SA' };
            _this.SpeechUtilInstance = _this;
            // this.utterance = new SpeechSynthesisUtterance();
            _this.userLanguages;
            _this.annyangUtil = new AnnyangUtil();
            _this.initAnnyang();
        }
        return _ret = _this.SpeechUtilInstance, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SpeechUtil, [{
        key: 'initSpeech',
        value: function initSpeech(languages) {
            if (languages != null || languages != undefined) {
                this.userLanguages = this.languages[this.languages[languages]];
            } else {
                this.userLanguages = 'english';
            }
        }
    }, {
        key: 'startSpeak',
        value: function startSpeak(utterance) {
            console.log("inside startSpeak");
            window.speechSynthesis.speak(utterance);
        }
    }, {
        key: 'cancelSpeak',
        value: function cancelSpeak() {
            window.speechSynthesis.cancel();
        }
    }, {
        key: 'read',
        value: function read(path) {
            var speaker = new SpeechUtil();
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", path, false);
            var userLanguage = this.userLanguages;
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        var allText = rawFile.responseText;

                        var chunkLength = 120;
                        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
                        var arr = [];
                        var txt = allText;
                        while (txt.length > 0) {
                            arr.push(txt.match(pattRegex)[0]);
                            txt = txt.substring(arr[arr.length - 1].length);
                        }
                        arr.forEach(function (element) {
                            var content = element.trim();
                            var utterance = new SpeechSynthesisUtterance(content);
                            utterance.lang = userLanguage;
                            speaker.startSpeak(utterance);
                        });
                    };
                }
            };
            rawFile.send(null);
        }
    }, {
        key: 'readText',
        value: function readText(contents) {
            var speaker = new SpeechUtil();

            var userLanguage = this.userLanguages;
            var allText = contents;
            var chunkLength = 120;
            var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
            var arr = [];
            var txt = allText;
            while (txt.length > 0) {
                arr.push(txt.match(pattRegex)[0]);
                txt = txt.substring(arr[arr.length - 1].length);
            }
            arr.forEach(function (element) {
                var content = element.trim();
                var utterance = new SpeechSynthesisUtterance(content);
                utterance.lang = userLanguage;
                speaker.startSpeak(utterance);
            });
        }
    }, {
        key: 'initAnnyang',
        value: function initAnnyang() {

            var commands = {};
            commands['stop'] = function () {
                window.speechSynthesis.cancel();
                console.log("stop");
            };
            var annyangOptions = { commands: commands };
            this.annyangUtil.addAnnyangCommands(annyangOptions);
        }
    }]);

    return SpeechUtil;
}(Util);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function Util() {
    _classCallCheck(this, Util);
};
