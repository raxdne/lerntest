/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

// s. http://manual.qooxdoo.org/current/pages/desktop/migration/migration_from_2_x.html

/* ************************************************************************

#asset(lerntest/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "LernTest"
 */
qx.Class.define("lerntest.Application",
{
  extend : qx.application.Standalone,


  statics:
  {
  },

  properties :
  {
      login : {init : null}
  },

  members :
  {
    main: function()
    {
	this.base(arguments);

	// Enable logging in debug variant
	if (qx.core.Environment.get("qx.debug")) {
	    // support native logging capabilities, e.g. Firebug for Firefox
	    qx.log.appender.Native;
	    // support additional cross-browser console. Press F7 to toggle visibility
	    //qx.log.appender.Console;
	}

	qx.log.Logger.info(this,'Init');

	if (location.protocol=='file:') {
	    this.startTestOffline();
	} else {
	    //this.startTestDummy();
	    this.getRoot().add(this.Login(), {left: "50%", top: "30%"});
	}
    }
  }
});


lerntest.Application.prototype.startTest = function() {

    //this._disposeObjects("__container");

    this.getRoot().set({decorator: "solid"});
    this.getRoot().add(this.createWindowTree(), {left:10, top:10});
};


//
// start Test in Offline mode (without login form)
//
lerntest.Application.prototype.startTestOffline = function() {

    qx.log.Logger.info(this,'Running in Offline mode');
    //this.setLogin('unknown');
    if (true) {
	this.getRoot().set({decorator: "solid"});
	this.getRoot().add(this.createWindowTree(), {left:10, top:10});
    } else {
	//
	var A = new lerntest.TestMath('Subtraktion');
	this.getRoot().add(A.createWindow(), {left:10, top:10});
    }
};


//
// for Development only
//
lerntest.Application.prototype.startTestDummy = function() {

    this.setLogin('unknown');
    //this.getRoot().set({decorator: "solid"});
    //this.getRoot().add(this.createWindowTree(), {left:10, top:10});

    var A = new lerntest.TestLanguage("/cxproc/exe?cxp=DictionaryODS2json&ods=karl/greenline-3.ods&langa=de&langb=en&lesson=0",'Multiple Choice');
    //var A = new lerntest.TestLanguage("/cxproc/exe?cxp=DictionaryODS2json&ods=unknown/Demo.ods&langa=de&langb=en&lesson=0",'Quiz');
    //A.setLogin(this.getLogin());
    //var A = new lerntest.TestMath('Klammern');
    this.getRoot().add(A.createWindowMultipleChoice(), {left:350, top:10});
    A.requestDictionary();
};


lerntest.Application.prototype.Login = function() {

      /* Container layout */
      var layout = new qx.ui.layout.Grid(9, 5);
      layout.setColumnAlign(0, "right", "top");
      layout.setColumnAlign(2, "right", "top");

      /* Container widget */
      this.group = new qx.ui.groupbox.GroupBox().set({
        contentPadding: [16, 16, 16, 16]
      });
      this.group.setLayout(layout);

      this.group.addListener("resize", function(e)
      {
        var bounds = this.group.getBounds();
        this.group.set({
          marginTop: Math.round(-bounds.height / 2),
          marginLeft : Math.round(-bounds.width / 2)
        });
      }, this);

      /* Text fields */

    this.group.add(new qx.ui.basic.Label('LernTest (p) 2011..2016 A. Tenbusch').set({
          allowShrinkX: false,
          paddingTop: 3
    }), {row: 0, column : 1, colSpan : 1});

        this.group.add(new qx.ui.basic.Label('Name').set({
          allowShrinkX: false,
          paddingTop: 3
        }), {row: 1, column : 0});

      var fieldName = new qx.ui.form.TextField();
      this.group.add(fieldName.set({
        allowShrinkX: false,
        paddingTop: 3
      }), {row: 1, column : 1});


      //   this.group.add(new qx.ui.basic.Label('Password').set({
      //     allowShrinkX: false,
      //     paddingTop: 3
      //   }), {row: 2, column : 0});

      // var fieldPassword = new qx.ui.form.PasswordField();
      // this.group.add(fieldPassword.set({
      //   allowShrinkX: false,
      //   paddingTop: 3
      // }), {row: 2, column : 1});

      /* Button */
      var buttonLogin = new qx.ui.form.Button("Anmelden");
      buttonLogin.setAllowStretchX(false);

      this.group.add(
        buttonLogin,
        {
          row : 4,
          column : 1
        }
      );

      var _this = this;

      /* Check input on click */
      buttonLogin.addListener("execute",function()
        {
	    if (fieldName.getValue() == null || fieldName.getValue() == '') {
		_this.setLogin('unknown');
	    } else {
		_this.setLogin(fieldName.getValue());
	    }
	    qx.log.Logger.info(this,'Login ' + _this.getLogin());
	    _this.group.hide();
	    _this.startTest();
	});

    this.group.addListener("keypress", function(e) {
	if (e.getKeyIdentifier() == "Enter") {
	    buttonLogin.execute();
	}
    });

    return this.group;
};

//
//
//
lerntest.Application.prototype.createWindowTree = function() {

    var _this = this;
    var win = new qx.ui.window.Window("LernTest" + (this.getLogin()==null ? "" : (" für " + this.getLogin())),
				      "lerntest/internet-feed-reader.png");
    win.setLayout(new qx.ui.layout.VBox(10));
    win.setStatus("Application is ready");
    win.setShowMinimize(false);
    win.setShowMaximize(false);
    win.setShowClose(false);
    win.setMovable(false);
    win.open();

    var tree = new lerntest.ApplicationTree(this.getLogin());
    win.add(tree, {flex:1});

    if (location.protocol=='file:') {
	qx.log.Logger.info(this,"Skip Radio buttons in offline mode");
    } else {
	var radioButtonGroupVBox = new qx.ui.form.RadioButtonGroup();
	radioButtonGroupVBox.setLayout(new qx.ui.layout.VBox(1));
	//radioButtonGroupVBox.add(new qx.ui.form.RadioButton("Langzeit"));
	radioButtonGroupVBox.add(new qx.ui.form.RadioButton("Klassenarbeit"));
	radioButtonGroupVBox.add(new qx.ui.form.RadioButton("Quiz"));
	//radioButtonGroupVBox.add(new qx.ui.form.RadioButton("Nachschlagen"));
	radioButtonGroupVBox.add(new qx.ui.form.RadioButton("Multiple Choice"));
	win.add(radioButtonGroupVBox, {flex:1});
    }

    tree.set({width : 300, height : 450});
    tree.setHideRoot(true);

    tree.addListener('click', function(e) {
	var A = null;
	var objClicked = this.getSelection()[0].getModel();

	if (objClicked == undefined || objClicked == null || objClicked.header == undefined) {
	    qx.log.Logger.error(this,"Clicked element has no associated model");
	    return;
	}
	
	if (objClicked.type != 'Test') {
	    qx.log.Logger.info(this,"Clicked element is no test");
	    this.getSelection()[0].toggleOpen();
	    return;
	}
	
	qx.log.Logger.info(this,objClicked.header);

	if (objClicked.background == undefined || objClicked.background == null) {
	    //
	    qx.log.Logger.info(this,"Clicked element is not valid");
	    return;
	} else {
	    _this.getRoot().set({decorator: objClicked.background});
	}

	// If there is no URL set, its a TestMath
	if (objClicked.url == undefined) {
	    if (e.isShiftPressed()) {
		A = new lerntest.TestMath(objClicked.header,30);
		A.setLogin(_this.getLogin());
		A.createWindowPrint();
	    } else {
		A = new lerntest.TestMath(objClicked.header,10);
		A.setLogin(_this.getLogin());
		_this.getRoot().add(A.createWindow(),{
		    left: (Math.floor(300 + Math.random() * 100)), 
		    top: (Math.floor( 20 + Math.random() * 100))});
	    }
	}
	else {
	    A = new lerntest.TestLanguage(objClicked.url,radioButtonGroupVBox.getSelection()[0].getLabel());
	    if (A == null || A == undefined) {
		alert('Noch kein Test hinterlegt!');
	    }
	    else {
		A.setSpecialCharButtons(objClicked.special);
		if (_this.getLogin()) {
		    A.setLogin(_this.getLogin());
		}
		if (e.isCtrlPressed()) {
		    _this.getRoot().add(_this.createWindowResult(),{
			left: (Math.floor(300 + Math.random() * 100)), 
			top: (Math.floor( 20 + Math.random() * 100))});
		} else if (e.isShiftPressed()) {
		    open('/cxproc/exe?cxp=LernTestShowStatistics&id=' + _this.getLogin().toLowerCase());
		} else {
		    _this.getRoot().add(A.createWindow(),{
			left: (Math.floor(300 + Math.random() * 100)), 
			top: (Math.floor( 20 + Math.random() * 100))});
		}
	    }
	}

    });

    return win;
};

//
//
//
lerntest.Application.prototype.createWindowResult = function() {

    var _this = this;

    var win = new qx.ui.window.Window(
	'Ergebnisse von ' + this.getLogin(),
	"icon/16/categories/internet.png"
    );

    var layout = new qx.ui.layout.VBox();
    layout.setSeparator("separator-vertical");
    win.setLayout(layout);
    win.setShowMinimize(false);
    win.setAllowClose(true);
    win.setContentPadding(0);
    win.open();

    var iframe = new qx.ui.embed.Iframe().set({
	width: 600,
	height: 500,
	minWidth: 200,
	minHeight: 150,
	source: '/cxproc/exe?cxp=LernTestGetResult&id=' + _this.getLogin().toLowerCase() + '#today',
	decorator : null
    });
    win.add(iframe, {flex: 1});

    return win;
};

