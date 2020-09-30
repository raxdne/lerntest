//
// New class TestMath
//
qx.Class.define("lerntest.TestMath", 
{
  extend : qx.ui.window.Window,

  properties : {
      resultReadonly : {init: true, check: "Boolean"}, // flag for write protection of result field
      login          : {init : null},
      title          : {init : ''}
  },

    construct : function(strTypeMath,intCount)
    {
	this.base(arguments);

	this.iIndex = -1;
	this.iOK = 0;
	this.setTitle('LernTest »' + strTypeMath + '«');
	qx.log.Logger.info(this,'New ' + this.getTitle());

	var intBase;
	if (strTypeMath.match(/(EinMalEinsGross)/)) {
	    intBase = Math.ceil(Math.random() * 100);
	}
	else {
	    intBase = Math.ceil(Math.random() * 10);
	}

	var intSkips = 0;
	this.arrTask = new Array();
	for (var i = 0; i < intCount; i++) {
	    //
	    switch(strTypeMath) {
	    case 'Klammern':
		this.arrTask[i] = new lerntest.TaskMathOrderOperation(1,10,2,false);
		break;
	    case 'KlammernMinus':
		this.arrTask[i] = new lerntest.TaskMathOrderOperation(1,10,2,true);
		break;
	    case 'MultiplikationGross':
		this.arrTask[i] = new lerntest.TaskMathMultiplication(1,1000,2);
		break;
	    case 'MultiplikationDezimal':
		this.arrTask[i] = new lerntest.TaskMathMultiplicationDecimal(1,10,2);
		break;
	    case 'DivisionDezimal':
		this.arrTask[i] = new lerntest.TaskMathDivisionDecimal(1,10,2);
		break;
	    case 'AdditionDezimal':
		this.arrTask[i] = new lerntest.TaskMathAdditionDecimal(1,10,2);
		break;
	    case 'EinMalEinsGross':
		this.arrTask[i] = new lerntest.TaskMathMultiplicationTable(Math.ceil(Math.random() * 100),intBase);
		break;
	    case 'Runden':
		break;
	    case 'DivisionRest':
		this.arrTask[i] = new lerntest.TaskMathDivisionRemainder(10,10);
		break;
	    case 'DivisionGross':
		this.arrTask[i] = new lerntest.TaskMathDivisionRemainder(10000,13);
		break;
	    case 'Division':
		this.arrTask[i] = new lerntest.TaskMathDivision(i+1,100);
		break;
	    case 'Multiplikation':
		this.arrTask[i] = new lerntest.TaskMathMultiplication(2,10,2);
		break;
	    case 'AdditionHunderter':
		this.arrTask[i] = new lerntest.TaskMathAddition(10,100,2);
		break;
	    case 'AdditionSchriftlich':
		this.arrTask[i] = new lerntest.TaskMathAddition(100,10000,5);
		break;
	    case 'Subtraktion':
		this.arrTask[i] = new lerntest.TaskMathSubtraction(3,20,3);
		break;
	    case 'SubtraktionSchriftlich':
		this.arrTask[i] = new lerntest.TaskMathSubtraction(100,10000,3);
		break;
	    case 'AdditionUndSubtraktion':
		if (i % 2) {
		    this.arrTask[i] = new lerntest.TaskMathSubtraction(3,20,3);
		} else {
		    this.arrTask[i] = new lerntest.TaskMathAddition(3,20,3);
		}
		break;
	    case 'EinMalEinsKlein':
		this.arrTask[i] = new lerntest.TaskMathMultiplicationTable(i+1,intBase);
		this.shuffle();
		break;
	    case 'Zerlegung':
		this.arrTask[i] = new lerntest.TaskMathDecomposition(6,20,2);
		break;
	    case 'AdditionMittel':
		this.arrTask[i] = new lerntest.TaskMathAddition(1,25,2);
		break;
	    case 'Addition':
	    default:
		this.arrTask[i] = new lerntest.TaskMathAddition(1,10,2);
	    }
	    this.arrTask[i].iResult = 0;

	    if (intSkips < 30 && this.checkRedundancy(i)) {
		intSkips++;
		this.arrTask[i].dispose();
		i--;		// skip this task
	    }
	    else {
		this.arrTask[i].info();
	    }
	}

	if (strTypeMath.match(/(EinMalEinsKlein|AdditionDezimal)/)) {
	    //this.shuffle();
	} 
	if (strTypeMath.match(/(Addition|AdditionMittel|Subtraktion|EinMalEinsKlein|DivisionGross|MultiplikationGross|Zerlegung)/)) {
	    this.setResultReadonly(false);
	}
    },

    members :
    {
	//
	//
	//
	createWindow : function() {

	    this.iOK = 0;
	    var _this = this;

	    var win = new qx.ui.window.Window(this.getTitle(), "lerntest/internet-feed-reader.png");
	    win.setLayout(new qx.ui.layout.VBox(10));
	    win.setStatus("Application is ready");
	    win.setShowMinimize(false);
	    win.setShowMaximize(false);
	    win.setAllowStretchX(false,false);
	    win.setAllowStretchY(false,false);

	    if (this.getLogin()) {
		// An short Hello with Icon
		var atomHello = new qx.ui.basic.Atom('Hello ' + this.getLogin() + '!', "lerntest/hello-math.png");
		atomHello.setRich(true);
		win.add(atomHello);
	    }

	    //
	    // a new layout for input fields
	    //
	    var layoutGroup = new qx.ui.layout.Grid(3,4);
	    layoutGroup.setColumnAlign(0,'right','middle');

	    var buttonGroupBox = new qx.ui.groupbox.GroupBox();
	    buttonGroupBox.setLayout(layoutGroup);
	    win.add(buttonGroupBox, {flex:1});

	    for (var i=0; i<this.arrTask.length; i++) {
		var fieldQuestion = new qx.ui.form.TextField('');
		fieldQuestion.set({
		    decorator: new qx.ui.decoration.Decorator().set({
			width: 1,
			style: "solid",
			color: "black"
		    })
		});

		var strTask = this.arrTask[i].getPrintable();
		if (strTask == undefined || strTask == null || ! strTask instanceof String) {
		    continue;
		}

		var labelQuestion = new qx.ui.basic.Label(strTask + ' = ');
		labelQuestion.setTextAlign('right');
		labelQuestion.setBuddy(fieldQuestion);
		buttonGroupBox.add(labelQuestion, {row: i, column: 0});

		buttonGroupBox.add(fieldQuestion, {row: i, column: 1});
		fieldQuestion.index = i; // add a new property

		fieldQuestion.addListener("focusin", function(e) {
		    this.setBackgroundColor('#FFFF00');
		    //qx.log.Logger.info(this,'Task ' + iIndex);
		});

		fieldQuestion.addListener("focusout", function(e) {
		    var strAnswer = this.getValue();
		    if (strAnswer != null && strAnswer != '') {
			if (_this.arrTask[this.index].check(this.getValue())) {
			    this.setReadOnly(true);
			    this.setBackgroundColor('#00FF00');
			    _this.iOK++;
			    _this.arrTask[this.index].iResult = 1;
			}
			else {
			    // this.setValue(this.getValue() + ' ?? ' + window.eval(_this.arrTask[this.index].getValue()));
			    if (_this.getResultReadonly()) {
				this.setReadOnly(true);
			    }
			    this.setBackgroundColor('#FF0000');
			}
			_this.iIndex++;
			atomStat.setLabel(_this.iOK + " von " + _this.arrTask.length + " richtig");
			// set emoticon
			if (_this.iOK == 0 || _this.iOK / _this.iIndex < 0.5) {
			    atomStat.setIcon("lerntest/face-raspberry.png"); 
			}
			else if (_this.iOK / _this.iIndex < 0.75) {
			    atomStat.setIcon("lerntest/face-sad.png"); 
			}
			else {
			    atomStat.setIcon("lerntest/face-smile.png"); 
			}

			if (_this.iIndex == _this.arrTask.length - 1) {
			    _this.saveResult(); // save when last task finished
			}
		    }
		});
	    }

	    // Add an Atom
	    var atomStat = new qx.ui.basic.Atom("Start", "lerntest/face-smile.png");
	    atomStat.setRich(true);
	    win.add(atomStat);

	    win.open();

	    return win;
	},

	//
	//
	//
	createWindowPrint : function() {

	    var winTab = window.open('about:blank');

	    qx.log.Logger.info(winTab.document,'New printable tab');

	    var strTest = '<tr><th colspan="3">Test';
	    if (this.getLogin() != 'unknown') {
		strTest += ' für ' + this.getLogin();
	    }
	    strTest += '</th></tr>';

	    for (var i=0; i<this.arrTask.length; i++) {
		strTest += '\n'
		    + '<tr>'
		    + '<td align="right">' + (i+1) + ')</td>' 
		    + '<td align="center">' + this.arrTask[i].getPrintable() + '</td>'
		    + '<td>=</td>'
		    + '<td></td>'
		    + '</tr>';
	    }
	    winTab.document.write('<table style="border-spacing:0.5em;">' + strTest + '</table>');
	    winTab.print();
	},

	//
	//
	//
	shuffle : function() {
	    qx.log.Logger.info(this,'Shuffle content');
	    // sort order
	    for (var i=0; i<this.arrTask.length; i++) {
		var tmp, rand;

		rand = Math.floor(Math.random() * this.arrTask.length);
		tmp                 = this.arrTask[i].getValue();
		this.arrTask[i].setValue(this.arrTask[rand].getValue());
		this.arrTask[rand].setValue(tmp);
		// TODO: this.setDecimal();
	    }
	},

	//
	//
	//
	saveResult : function() {

	    if (location.protocol=='file:') {
		qx.log.Logger.info(this,'Dont save in offline mode');
	    } else {
		var req = new qx.io.request.Xhr();

		var strResult = '* ' + this.getTitle() + '\n';
		// for (var i=0; i < this.arrTask.length; i++) {
		// 	strResult = strResult + _this.arrTask[i].getValue() + ';' + this.arrTask[i].iResult + '\n';
		// }

		req.setUrl('/cxproc/exe');

		// Set method (defaults to GET)
		//req.setMethod("POST");

		// Set request data. Accepts String, Map or qooxdoo Object.
		req.setRequestData({"id": this.getLogin(), "cxp": "LernTestSaveResult", "content": qx.util.Base64.encode(strResult)});

		qx.log.Logger.info(req,'New request');

		req.addListener("error", function(e) {
		    var req = e.getTarget();
		    alert('Error: ' + req.getResponse());
		}, this);

		// Send request
		req.send();
	    }
	},

	checkRedundancy : function(intMax) {

	    for (var i=0; i<intMax; i++) {
	      for (var j=0; j<i; j++) {
		  //qx.log.Logger.info(this,'Check content ' + this.arrTask[i].getValue() + ' zu ' + this.arrTask[j].getValue());
		  if (i != j && this.arrTask[i].getValue() == this.arrTask[j].getValue()) {
		      qx.log.Logger.info(this,'Skip content ' + this.arrTask[i].getValue());
		      return true;
		  }
	      }
	    }
	}
    }
});
