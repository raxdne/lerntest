//
// New class TestLanguage
//
qx.Class.define("lerntest.TestLanguage", 
{
    extend : qx.ui.window.Window,

    properties : {
	login : {init : ''},
	title : {init : 'LernTest'},
	url   : {init : ''},
	mode  : {init : 'Klassenarbeit'},
	hint  : {init : 0},
	SpecialCharButtons : {init : false, check: "Boolean"},
	Strict : {init : false, check: "Boolean"},
	Counted : {init : false, check: "Boolean"},
	Save : {init : false, check: "Boolean"},
	TimeStart : {init : null},
	atomStat : {init : null},
	buttonStart : {init : null}
    },

    construct : function(strUrl,strMode)
    {
	this.base(arguments, "LernTest");
	
	this.iIndex = -1;
	this.arrQuestions = new Array();
	this.arrIndex = new Array();
	this.arrFilter = new Array();
	this.arrT = new Array();
	this.iOK = 0;
	this.setHint(1);
	this.setUrl(strUrl);
	this.setTimeStart((new Date()).getTime());

	if (strMode == undefined) {
	} else {
	    qx.log.Logger.info(this,'New ' + this.getTitle() + ' in ' + strMode);
	    this.setMode(strMode);
	}
    },

    destruct : function ()
    {
	qx.log.Logger.info(this,'destruct');
    },

    members :
    {
	//
	//
	//
	shuffle : function() {

	    qx.log.Logger.info(this,'Resort content');
	    // sort order
	    for (var i=0; i<this.arrIndex.length; i++) {
		var tmp, rand;

		rand = Math.floor(Math.random() * this.arrIndex.length);
		tmp                 = this.arrIndex[i];
		this.arrIndex[i]    = this.arrIndex[rand];
		this.arrIndex[rand] = tmp;
	    }
	},

	//
	//
	//
	applyFilter : function() {

	    if (this.arrFilter.length > 0 && this.arrQuestions.length > 0) {
		qx.log.Logger.info(this,'Filter content');

		for (var i=0; i < this.arrQuestions.length; i++) {
		    //qx.log.Logger.info(this,this.arrQuestions[i].arrV[0] + ' ' + i);
		    for (var j=0; j < this.arrFilter.length; j++) {
			//qx.log.Logger.info(this,this.arrFilter[j] + ' ' + j);
			if (this.arrQuestions[i].arrV.join(' ') == this.arrFilter[j]) {
			    // compare all alternatives
			    qx.log.Logger.info(this, 'Remove ' + j + ': ' + this.arrFilter[j]);
			    this.arrQuestions.splice(i,1);
			    i--;
			    break;
			}
		    }
		}
	    }
	},

	//
	//
	//
       requestDictionary : function() {

	   var _this = this;
	   var request = new qx.io.request.Xhr();

	   qx.log.Logger.info(request,'New request ' + this.getUrl());

	   request.setUrl(this.getUrl());

	   request.addListener("success", function(e) {

	       //qx.log.Logger.info(this,this.responseText);
	       var arrAnswer = window.eval(request.getResponse().replace(/[\n\r\t]+/g,' ')); // 

	       _this.setTitle('LernTest »' + arrAnswer[0] + '«'); // BUG: new title is not shown
	       _this.arrQuestions = arrAnswer[1];
	       if (_this.arrQuestions.length > 0) {
		   _this.applyFilter();
	    	   // build sort order array
		   _this.arrIndex = new Array();
	    	   for (var i=0; i < _this.arrQuestions.length; i++) {
	    	       _this.arrIndex.push(i);
		       //qx.log.Logger.info(_this,_this.arrIndex);
	    	       for (var j=0; j < _this.arrT.length; j++) {
	    		   if (_this.cleanUp(_this.arrQuestions[i].arrV[0]) == _this.arrT[j].arrV[0]) {
	    		       //qx.log.Logger.info(_this,'Stat ' + _this.arrT[j].arrV[0] + ': ' +_this.arrT[j].arrS);
	    		       break;
	    		   }
	    	       }
	    	   }
	    	   _this.shuffle();
	    	   qx.log.Logger.info(_this,'Build dictionary with ' + _this.arrIndex.length + ' of ' + _this.arrQuestions.length + ' entries');
		   //alert(_this.arrIndex);
	    	   _this.buttonStart.execute();
	       } else {
	    	   qx.log.Logger.info(_this,'Ignore empty array content');
	       }
	   }, this);

	   // Send request
	   request.send();
	},

	//
	//
	//
	requestFilter : function() {

	    var strUrl = '/GetFilter.cxp?id=' + this.getLogin();
	    var request = new qx.io.request.Xhr();

	    qx.log.Logger.info(request,'New filter request ' + strUrl);

	    request.setUrl(strUrl);
	    // TODO: avoid deprecated sync request
	    request.setAsync(false);
	    request.send();

	    this.arrFilter = window.eval(request.getResponse().replace(/[\n\r\t]+/g,' '));

	    qx.log.Logger.info(this,'Filter array statistics ' + this.arrFilter.length + ' entries');
	},

	//
	//
	//
	saveSingleResult : function(strArgQuestion) {

	    if (location.protocol=='file:') {
		qx.log.Logger.info(this,'Dont save in offline mode');
	    } else {
		var request = new qx.io.request.Xhr();

		var strXml = '<result>'
		    + '<entry>'
		    + '<dict>' + this.getTitle() + '</dict>'
		    + '<timestamp type="int">' + Math.floor((new Date).getTime() / 1000) + '</timestamp>'
		    + '<value>' + strArgQuestion.replace(/[\n\r\t ]+/g,' ').replace(/ +$/g,'') + '</value>'
		    + '</entry>'
		    + '</result>';
		
		request.setAsync(true);
		request.setUrl('/SaveResult.cxp');
		request.setRequestData({"id": this.getLogin(),
					"content": qx.util.Base64.encode(strXml)});
		qx.log.Logger.info(request,'New save request for: "' + strArgQuestion + '"');

		request.addListener("error", function(e) {
		    var request = e.getTarget();
		    alert('Error: ' + request.getResponse());
		}, this);

		// Send request
		request.send();
	    }
	},

	//
	// returns a cleaned string of strArg
	//
	cleanUp : function (strArg) {

	    var strResult;

	    strResult = strArg.replace(/\([^\)]*\)/g,'')
		.replace(/^[\!\.\,\;\?\n\t ]+/,'')
		.replace(/[\!\.\,\;\?\n\t ]+$/,'')
		.replace(/[\!\.\,\;\?\n\t ]+/g,'_');
	    if (this.isStrict()) {
		return strResult;
	    } else {
		return strResult.toLowerCase();
	    }
	},

	//
	//
	//
	checkAnswer : function(strAnswer) {

	    if (strAnswer != undefined && strAnswer != null && strAnswer.length > 0) {
		for (var i=0; i < this.arrQuestions[this.arrIndex[this.iIndex]].arrAnswer.length; i++) {
		    //qx.log.Logger.info(this,'Compare ' + this.cleanUp(strAnswer) + ' to ' + this.cleanUp(this.arrQuestions[this.arrIndex[this.iIndex]].arrAnswer[i]));
		    if (this.cleanUp(strAnswer) == this.cleanUp(this.arrQuestions[this.arrIndex[this.iIndex]].arrAnswer[i])) {
			// compare all alternatives
			return true;
		    }
		}
	    }
	    return false;
	},

	//
	//
	//
	processQuery : function(strQuery) {

	    if (strQuery != undefined && strQuery != null && strQuery.length > 0) {
		var strQueryFixed = strQuery.replace(/[\n\t ]+/,' ');
		strQueryFixed = strQueryFixed.replace(/^[\n\t ]+/,'');
		strQueryFixed = strQueryFixed.replace(/[\n\t ]+$/,'');
		for (var i=0; i < this.arrQuestions.length; i++) {
		    for (var j=0; j < this.arrQuestions[i].arrV.length; j++) {
			if (this.arrQuestions[i].arrV[j].replace(/[\n\t ]+$/,'').match(strQueryFixed)) {
			    // compare all alternatives
			    return i;
			}
		    }
		}
	    }
	    return -1;
	},

	//
	//
	//
	setStat : function() {

	    this.atomStat.setLabel(this.iOK + " von " + (this.iIndex + 1) + " richtig = " + ((this.iOK > 0) ? Math.ceil(this.iOK / (this.iIndex + 1) * 100.0) : 0) + "% " + "(noch " + (this.arrIndex.length - this.iIndex - 1) + ")");
	    // set emoticon

	    if (this.iIndex < 1) {
	    }
	    else if (this.iOK == 0 || this.iOK / this.iIndex < 0.5) {
		this.atomStat.setIcon("lerntest/face-raspberry.png"); 
	    }
	    else if (this.iOK / this.iIndex < 0.75) {
		this.atomStat.setIcon("lerntest/face-sad.png"); 
	    }
	    else {
		this.atomStat.setIcon("lerntest/face-smile.png"); 
	    }
	},

	//
	//
	//
	createWindow : function() {

	    switch (this.getMode()) {
	    case 'Langzeit':
		this.requestFilter();
		this.setSave(true);
		this.createWindowDefault();
		break;
	    case 'Quiz':
		this.createWindowQuiz();
		break;
	    case 'Multiple Choice':
		this.createWindowMultipleChoice();
		break;
	    case 'Nachschlagen':
		this.createWindowDictionary();
		break;
	    case 'Klassenarbeit':
	    default:
		this.setSave(true);
		this.createWindowDefault();
	    }
	    this.requestDictionary();
	},

	//
	//
	//
	createWindowDefault : function() {

	    var _this = this;

	    var winListen;

	    var win = new qx.ui.window.Window(this.getTitle(), "lerntest/internet-feed-reader.png");
	    win.setLayout(new qx.ui.layout.VBox(10));
	    win.setStatus("Application is ready");
	    win.setShowMinimize(false);
	    win.setShowMaximize(false);
	    win.setAllowStretchX(false,false);
	    win.setAllowStretchY(false,false);

	    if (this.getLogin()) {
		// An short Hello with Icon
		var atomHello = new qx.ui.basic.Atom('Hello ' + this.getLogin() + '!', "lerntest/hello-lang.png");
		atomHello.setRich(true);
		win.add(atomHello);
	    }

	    //
	    // a new layout for input fields
	    //
	    var layoutGroup = new qx.ui.layout.Grid(8, 8);
	    layoutGroup.setColumnWidth(1, 300); // set with of column 1 to 200 pixel
	    //layoutGroup.setRowHeight(0, 100);
	    //layoutGroup.setRowHeight(1, 100);

	    var textGroupBox = new qx.ui.groupbox.GroupBox();
	    textGroupBox.setLayout(layoutGroup);
	    win.add(textGroupBox, {flex:1});

	    // 
	    var fieldQuestion = new qx.ui.form.TextArea();
	    fieldQuestion.set({
		placeholder: "Vokabel",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "black"
		})
	    });
	    // if (this.arrQuestions.length < 1) {
	    // 	fieldQuestion.setPlaceholder('No dictionary found!');
	    // }

	    var labelQuestion = new qx.ui.basic.Label("Frage");
	    labelQuestion.setBuddy(fieldQuestion);
	    textGroupBox.add(labelQuestion, {row: 0, column: 0});
	    textGroupBox.add(fieldQuestion, {row: 0, column: 1});
	    fieldQuestion.setReadOnly(true);

	    // 
	    var fieldAnswer = new qx.ui.form.TextArea();
	    fieldAnswer.set({
		placeholder: "Antwort",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "red"
		})
	    });
	    var labelAnswer = new qx.ui.basic.Label("Antwort");
	    labelAnswer.setBuddy(fieldAnswer);
	    textGroupBox.add(labelAnswer, {row: 1, column: 0});
	    textGroupBox.add(fieldAnswer, {row: 1, column: 1});

	    if (this.isSpecialCharButtons()) {
		var buttonGroupChars = new qx.ui.groupbox.GroupBox();
		buttonGroupChars.setLayout(new qx.ui.layout.Grid(4,4));
		textGroupBox.add(buttonGroupChars, {row: 1, column: 2});
		// s. http://de.wikipedia.org/wiki/Liste_der_IPA-Zeichen
		// s. http://www.unicode.org/charts/
		var arrChar = [
		    // (progn (setq i (string-to-number "250" 16)) (while (< i (string-to-number "2AF" 16)) (insert (format "'%c'," i)) (setq i (+ i 1))))
		    // (progn (setq i (string-to-number "AA" 16)) (while (< i (string-to-number "FF" 16)) (insert (format "'%c'," i)) (setq i (+ i 1))))
		    'À','Á','Â',
		    'à','á','â',
		    'Ç','ç','Œ','œ',
		    'È','É','Ê',
		    'è','é','ê','ë',
		    'Ì','Í','Î',
		    'ì','í','î',
		    'Ò','Ó','Ô',
		    'ò','ó','ô',
		    'Ù','Ú','Û',
		    'ù','ú','û',
		    '´'];
		var iCols = 6;

		for (var i=0; i<arrChar.length; i++) {
		    var buttonChar = new qx.ui.form.Button(arrChar[i]);
		    buttonGroupChars.add(buttonChar, {row: Math.floor(i / iCols), column: (i % iCols)});
		    buttonChar.addListener("execute", function() {
			var intPos = fieldAnswer.getTextSelectionStart();
			qx.log.Logger.info(this,'Insert ' + this.getLabel());
			if (fieldAnswer.getValue()==null) {
			    // empty field
			    fieldAnswer.setValue(this.getLabel());
			}
			else {
			    fieldAnswer.setValue(fieldAnswer.getValue() + this.getLabel());
			}
			intPos++;
			fieldAnswer.focus();
			fieldAnswer.setTextSelection(intPos,intPos);
		    });
		}
	    }

	    var buttonGroupBox = new qx.ui.groupbox.GroupBox();
	    buttonGroupBox.setLayout(new qx.ui.layout.HBox(10));
	    win.add(buttonGroupBox, {flex:1});

	    var buttonHelp = new qx.ui.form.Button("Helfen");
	    buttonGroupBox.add(buttonHelp, {flex:1});
	    buttonHelp.setIcon("lerntest/help-contents.png"); 
	    buttonHelp.setEnabled(false);
	    buttonHelp.addListener("execute", function() {
		var i;
		var strHelp = '';

		qx.log.Logger.info(fieldAnswer,'Hint ' + _this.getHint());

		strHelp = _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer[0].slice(0,_this.getHint());

		if (_this.getHint() > 0) {
		    //buttonOK.setEnabled(false);
		}

		if (_this.getHint() < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer[0].length) {
		    _this.setHint(_this.getHint() + 1);
		} else {
		    buttonHelp.setEnabled(false);

		}

		fieldAnswer.setValue(strHelp);
		//fieldAnswer.setReadOnly(true);
		fieldAnswer.setBackgroundColor('#0000FF');
		_this.setCounted(true); // dont count this result
	    });

	    var buttonOK = new qx.ui.form.Button("Prüfen");
	    buttonGroupBox.add(buttonOK, {flex:1});
	    buttonOK.setIcon("lerntest/dialog-cancel.png"); 
	    buttonOK.setEnabled(false);
	    buttonOK.addListener("execute", function() {

		if (buttonOK.getEnabled()) {
		    var strShow = fieldAnswer.getValue();

		    qx.log.Logger.info(fieldAnswer,'Test');
	   	    buttonOK.setEnabled(false);
		    buttonHelp.setEnabled(false);
		    fieldAnswer.setReadOnly(true);

		    if (fieldAnswer.getValue()=='') {
			// empty field
			fieldAnswer.setBackgroundColor('#FF0000');
		    }
		    else if (_this.checkAnswer(fieldAnswer.getValue())) {
			fieldAnswer.setBackgroundColor('#00FF00');
			if (_this.getHint() < 1) {
			    _this.iOK++;
			    if (_this.getSave()) {
				_this.saveSingleResult(fieldQuestion.getValue());
			    }
			}
			else {
			    _this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
			}
		    }
		    else {
			fieldAnswer.setBackgroundColor('#FF0000');
			_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
		    }
		    _this.setCounted(true);
		    _this.setStat();

		    if (strShow.length > 0) {
			strShow = strShow + '\n\n';
		    }
		    strShow = '';
		    for (i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer.length; i++) {
			strShow = strShow + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer[i] + '\n';
		    }
		    buttonListen.setEnabled(true);
		    fieldAnswer.setValue(strShow);
		    buttonNext.focus();
		}
	    });

	    var buttonListen = new qx.ui.form.Button("Hören");
	    buttonGroupBox.add(buttonListen, {flex:1});
	    buttonListen.setIcon("lerntest/media-audio-player.png"); 
	    buttonListen.setEnabled(false);
	    buttonListen.addListener("execute", function() {

		if (buttonListen.getEnabled()) {
		    var strListen = fieldAnswer.getValue().replace(/[\n\r]+/g,'; '); // .replace(/\n\r\t/g,'')
		    strListen = strListen.replace(/[\t]+/g," "); //
		    strListen = strListen.replace(/[\(\)\[\]]+/g,""); //
		    strListen = strListen.replace(/[\u00B4\u0060]+/g,"'"); // GRAVE ACCENT & ACUTE ACCENT
		    strListen = strListen.replace(/\bsth\.*/g,"something"); // 

		    qx.log.Logger.info(_this,': ' + strListen);
		    winListen = window.open('http://translate.google.de/#en/de/' + encodeURIComponent(strListen));

		    // if (winListen == undefined || winListen.location == undefined) {
		    // 	winListen = window.open('http://translate.google.de/#en/de/' + encodeURIComponent(strListen));
		    // } else {
		    // 	winListen.location.assign('http://translate.google.de/#en/de/' + encodeURIComponent(strListen));
		    // 	winListen.focus();
		    // }
		    //window.open('http://www.dict.cc/speak.php?tts_lang=en&text_en=' + encodeURIComponent(strListen));
		}
	    });

	    var buttonNext = new qx.ui.form.Button("Weiter");
	    buttonGroupBox.add(buttonNext, {flex:1});
	    buttonNext.setIcon("lerntest/go-next.png"); 
	    buttonNext.addListener("execute", function() {

		if (buttonNext.getEnabled()) {
		    if (_this.arrIndex.length < 1) {
			// no valid dictionary
			this.setEnabled(false);
			buttonOK.setEnabled(false);
			buttonHelp.setEnabled(false);
			return;
		    }

		    if (_this.isCounted()) {
			// result counted already
		    }
		    else if (fieldAnswer.getValue()=='') {
			// empty field
		    }
		    else if (_this.checkAnswer(fieldAnswer.getValue())) {
			if (_this.getHint() < 1) {
			    _this.iOK++;
			    _this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 1;
			    if (_this.getSave()) {
				_this.saveSingleResult(fieldQuestion.getValue());
			    }
			}
			else {
			    _this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
			}
		    }
		    else {
			//_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
		    }
		    _this.setCounted(false);

		    if (_this.iIndex < _this.arrIndex.length - 1) {
			_this.iIndex++;
			_this.setStat();
		    }

		    if (_this.iIndex + 1 == _this.arrIndex.length) {
			this.setEnabled(false);
		    }
		    buttonOK.setEnabled(true);
		    buttonListen.setEnabled(false);
		    buttonHelp.setEnabled(true);
		    qx.log.Logger.info(fieldQuestion,'Next question ' + _this.arrIndex[_this.iIndex]);
		    var strField = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV.length; i++) {
			strField = strField + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV[i] + '\n';
		    }
		    fieldQuestion.setValue(strField);
		    fieldAnswer.setReadOnly(false);
		    fieldAnswer.setBackgroundColor('#FFFFFF');
		    fieldAnswer.setValue('');
		    fieldAnswer.focus();
		    _this.setHint(0);
		}
	    });

	    // shortcuts 
	    win.addListener("keypress", function(e) {
		if (e.getKeyIdentifier() == "Enter") {
		    if (buttonOK.getEnabled()) {
			buttonOK.execute();
			buttonNext.focus();
		    } else {
		    }
		}
	    });


	    // Add an Atom
	    this.atomStat = new qx.ui.basic.Atom("", "lerntest/face-smile.png");
	    this.atomStat.setRich(true);
	    win.add(this.atomStat);

	    win.open();
	    this.buttonStart = buttonNext;

	    return win;
	},

	//
	//
	//
	createWindowMultipleChoice : function() {

	    var _this = this;

	    var arrChoices = new Array();
	    var arrChoiceIndex = new Array();
	    var iAnswerOK;

	    var win = new qx.ui.window.Window(this.getTitle(), "lerntest/internet-feed-reader.png");
	    win.setLayout(new qx.ui.layout.VBox(10));
	    win.setStatus("Application is ready");
	    win.setShowMinimize(false);
	    win.setShowMaximize(false);
	    win.setAllowStretchX(false,false);
	    win.setAllowStretchY(false,false);

	    if (this.getLogin()) {
		// An short Hello with Icon
		var atomHello = new qx.ui.basic.Atom('Hello ' + this.getLogin() + '!', "lerntest/hello-lang.png");
		atomHello.setRich(true);
		win.add(atomHello);
	    }

	    //
	    // a new layout for input fields
	    //
	    var layoutGroup = new qx.ui.layout.Grid(8, 8);
	    layoutGroup.setColumnWidth(1, 300); // set with of column 1 to 200 pixel
	    //layoutGroup.setRowHeight(0, 100);
	    //layoutGroup.setRowHeight(1, 100);

	    var textGroupBox = new qx.ui.groupbox.GroupBox();
	    textGroupBox.setLayout(layoutGroup);
	    win.add(textGroupBox, {flex:1});

	    // 
	    var fieldQuestion = new qx.ui.form.TextArea();
	    fieldQuestion.set({
		placeholder: "Vokabel",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "red"
		})
	    });
	    // if (this.arrQuestions.length < 1) {
	    // 	fieldQuestion.setPlaceholder('No dictionary found!');
	    // }

	    var labelQuestion = new qx.ui.basic.Label("Frage");
	    labelQuestion.setBuddy(fieldQuestion);
	    textGroupBox.add(labelQuestion, {row: 0, column: 0});
	    textGroupBox.add(fieldQuestion, {row: 0, column: 1});
	    fieldQuestion.setReadOnly(true);

	    var labelAnswer = new qx.ui.basic.Label("Antwort");
	    //labelAnswer.setBuddy();
	    textGroupBox.add(labelAnswer, {row: 1, column: 0});

	    var radioButtonGroupVBox = new qx.ui.form.RadioButtonGroup();
	    radioButtonGroupVBox.setLayout(new qx.ui.layout.VBox(1));

	    for (var r=0; r<4; r++) {
		arrChoices[r] = new qx.ui.form.RadioButton();
		radioButtonGroupVBox.add(arrChoices[r]);
		arrChoiceIndex[r] = -1;
	    }
	    textGroupBox.add(radioButtonGroupVBox, {row: 1, column: 1});

	    var buttonGroupBox = new qx.ui.groupbox.GroupBox();
	    buttonGroupBox.setLayout(new qx.ui.layout.HBox(10));
	    win.add(buttonGroupBox, {flex:1});

	    var buttonOK = new qx.ui.form.Button("Prüfen");
	    buttonGroupBox.add(buttonOK, {flex:1});
	    buttonOK.setIcon("lerntest/dialog-cancel.png"); 
	    buttonOK.setEnabled(false);
	    buttonOK.addListener("execute", function() {

		if (buttonOK.getEnabled()) {
		    var strShow = '';

		    //qx.log.Logger.info(fieldAnswer,'Test');
	   	    buttonOK.setEnabled(false);

		    arrChoices[iAnswerOK].setBackgroundColor('#00FF00');
		    for (var i=0; i < arrChoices.length; i++) {
			if (radioButtonGroupVBox.isSelected(arrChoices[i])) {
			    if (i == iAnswerOK) {
				_this.iOK++;
				_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 1;
			    }
			    else {
				_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
				arrChoices[i].setBackgroundColor('#FF0000');
			    }
			    break;
			}
		    }
		    _this.setCounted(true);
		    _this.setStat();

		    buttonNext.focus();
		}
	    });

	    var buttonNext = new qx.ui.form.Button("Weiter");
	    buttonGroupBox.add(buttonNext, {flex:1});
	    buttonNext.setIcon("lerntest/go-next.png"); 
	    buttonNext.addListener("execute", function() {

		if (buttonNext.getEnabled()) {
		    if (_this.arrIndex.length < 1) {
			// no valid dictionary
			this.setEnabled(false);
			buttonOK.setEnabled(false);
			return;
		    }

		    if (_this.isCounted()) {
			// result counted already
		    }
		    else {
			for (var i=0; i < arrChoices.length; i++) {
			    if (radioButtonGroupVBox.isSelected(arrChoices[i])) {
				if (i == iAnswerOK) {
				    _this.iOK++;
				    _this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 1;
				}
				else {
				    //_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
				}
				break;
			    }
			}
		    }
		    _this.setCounted(false);

		    if (_this.iIndex < _this.arrIndex.length - 1) {
			_this.iIndex++;
			_this.setStat();
		    }

		    if (_this.iIndex + 1 == _this.arrIndex.length) {
			this.setEnabled(false);
		    }
		    buttonOK.setEnabled(true);
		    qx.log.Logger.info(fieldQuestion,'Next question ' + _this.arrIndex[_this.iIndex]);
		    var strField = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV.length; i++) {
			strField = strField + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV[i] + '\n';
		    }
		    fieldQuestion.setValue(strField);

		    if (_this.arrQuestions.length > arrChoiceIndex.length) {
			// fill index array with according random values
			for (var i=0; i < arrChoiceIndex.length; ) {
			    var j = Math.floor(Math.random() * _this.arrQuestions.length);
			    if (j == _this.iIndex
				|| arrChoiceIndex.indexOf(j) > -1
				|| _this.arrQuestions[_this.arrIndex[j]].arrAnswer == undefined) {
				// ignore this index
			    }
			    else {
				arrChoiceIndex[i] = j;
				i++;
			    }
			}
		    }
		    else {
			for (var i=0; i < arrChoiceIndex.length; i++) {
			    arrChoiceIndex[i] = i;
			}
		    }
		    // redefine index of right answer
		    iAnswerOK = Math.floor(Math.random() * arrChoices.length);
		    arrChoiceIndex[iAnswerOK] = _this.iIndex;
		    qx.log.Logger.info(arrChoiceIndex,'Multiple choice index ' + arrChoiceIndex);

		    // set the radioButton labels
		    for (var i=0; i < arrChoices.length; i++) {
			var strShow = '';
			for (var j=0; j < _this.arrQuestions[_this.arrIndex[arrChoiceIndex[i]]].arrAnswer.length; j++) {
			    if (j>0) {
				strShow = strShow + ', ';
			    }
			    strShow = strShow + _this.arrQuestions[_this.arrIndex[arrChoiceIndex[i]]].arrAnswer[j];
			}
			arrChoices[i].setLabel(strShow);
			arrChoices[i].resetBackgroundColor();
		    }
		    radioButtonGroupVBox.resetSelection();
		}
	    });

	    // shortcuts 
	    win.addListener("keypress", function(e) {
		if (e.getKeyIdentifier() == "Enter") {
		    if (buttonOK.getEnabled()) {
			buttonOK.execute();
			buttonNext.focus();
		    } else {
		    }
		}
	    });


	    // Add an Atom
	    this.atomStat = new qx.ui.basic.Atom("", "lerntest/face-smile.png");
	    this.atomStat.setRich(true);
	    win.add(this.atomStat);

	    win.open();
	    this.buttonStart = buttonNext;

	    return win;
	},

	//
	//
	//
	createWindowQuiz : function() {

	    var _this = this;

	    var winListen;

	    var win = new qx.ui.window.Window(this.getTitle(), "lerntest/internet-feed-reader.png");
	    win.setLayout(new qx.ui.layout.VBox(10));
	    win.setStatus("Application is ready");
	    win.setShowMinimize(false);
	    win.setShowMaximize(false);
	    win.setAllowStretchX(false,false);
	    win.setAllowStretchY(false,false);

	    if (this.getLogin()) {
		// An short Hello with Icon
		var atomHello = new qx.ui.basic.Atom('Hello ' + this.getLogin() + '!', "lerntest/hello-lang.png");
		atomHello.setRich(true);
		win.add(atomHello);
	    }

	    //
	    // a new layout for input fields
	    //
	    var layoutGroup = new qx.ui.layout.Grid(8, 8);
	    layoutGroup.setColumnWidth(1, 300); // set with of column 1 to 200 pixel
	    //layoutGroup.setRowHeight(0, 100);
	    //layoutGroup.setRowHeight(1, 100);

	    var textGroupBox = new qx.ui.groupbox.GroupBox();
	    textGroupBox.setLayout(layoutGroup);
	    win.add(textGroupBox, {flex:1});

	    // 
	    var fieldQuestion = new qx.ui.form.TextArea();
	    fieldQuestion.set({
		placeholder: "Vokabel",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "black"
		})
	    });
	    var labelQuestion = new qx.ui.basic.Label("Frage");
	    labelQuestion.setBuddy(fieldQuestion);
	    textGroupBox.add(labelQuestion, {row: 0, column: 0});
	    textGroupBox.add(fieldQuestion, {row: 0, column: 1});
	    fieldQuestion.setReadOnly(true);

	    // 
	    var fieldAnswer = new qx.ui.form.TextArea();
	    fieldAnswer.set({
		placeholder: "Antwort",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "red"
		})
	    });
	    fieldAnswer.setReadOnly(true);
	    var labelAnswer = new qx.ui.basic.Label("Antwort");
	    labelAnswer.setBuddy(fieldAnswer);
	    textGroupBox.add(labelAnswer, {row: 1, column: 0});
	    textGroupBox.add(fieldAnswer, {row: 1, column: 1});

	    var buttonGroupBox = new qx.ui.groupbox.GroupBox();
	    buttonGroupBox.setLayout(new qx.ui.layout.HBox(10));
	    win.add(buttonGroupBox, {flex:1});

	    var buttonWrong = new qx.ui.form.Button("Falsch");
	    buttonGroupBox.add(buttonWrong, {flex:1});
	    buttonWrong.setIcon("lerntest/dialog-close.png"); 
	    buttonWrong.addListener("execute", function() {

		_this.arrQuestions[_this.arrIndex[_this.iIndex]].iResult = 0;
		_this.setStat();
		_this.iIndex++;

		if (_this.iIndex < _this.arrQuestions.length) {
		    var strShow;

		    qx.log.Logger.info(fieldQuestion,'Next question ' + _this.arrIndex[_this.iIndex]);
		    var strField = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV.length; i++) {
			strField = strField + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV[i] + '\n';
		    }
		    fieldQuestion.setValue(strField);

		    strShow = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer.length; i++) {
			strShow = strShow + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer[i] + '\n';
		    }
		    fieldAnswer.setValue(strShow);
		}
		else {
		    buttonRight.setEnabled(false);
		    buttonWrong.setEnabled(false);
		}
	    });

	    var buttonListen = new qx.ui.form.Button("Hören");
	    buttonGroupBox.add(buttonListen, {flex:1});
	    buttonListen.setIcon("lerntest/media-audio-player.png"); 
	    buttonListen.setEnabled(true);
	    buttonListen.addListener("execute", function() {

		var strListen = fieldAnswer.getValue().replace(/\n\r\t\(\)\[\]/g,''); // .replace(/\n\r\t/g,'')
		strListen = strListen.replace(/[\u00B4\u0060]+/g,"'"); // GRAVE ACCENT & ACUTE ACCENT
		strListen = strListen.replace(/\bsth\.*/g,"something"); // 

		qx.log.Logger.info(_this,': ' + strListen);
		winListen = window.open('http://translate.google.de/#en/de/' + encodeURIComponent(strListen));

		//window.open('http://www.dict.cc/speak.php?tts_lang=en&text_en=' + encodeURIComponent(strListen));
		//buttonRight.setEnabled(false);
	    });

	    var buttonRight = new qx.ui.form.Button("Richtig");
	    buttonGroupBox.add(buttonRight, {flex:1});
	    buttonRight.setIcon("lerntest/dialog-apply.png"); 

	    buttonRight.addListener("execute", function() {

		if (_this.arrIndex.length < 1) {
		    // no valid dictionary
		    this.setEnabled(false);
		    buttonWrong.setEnabled(false);
		    return;
		}

		qx.log.Logger.info(fieldAnswer,'Right answer');

		if (_this.iIndex < 0) {
		    // first automated execution
		} else {
		    _this.iOK++;
		}

		_this.setStat();
		_this.iIndex++;

		if (_this.iIndex < _this.arrQuestions.length) {
		    var strShow;

		    qx.log.Logger.info(fieldQuestion,'Next question ' + _this.arrIndex[_this.iIndex]);
		    var strField = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV.length; i++) {
			strField = strField + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrV[i] + '\n';
		    }
		    fieldQuestion.setValue(strField);

		    strShow = '';
		    for (var i=0; i < _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer.length; i++) {
			strShow = strShow + _this.arrQuestions[_this.arrIndex[_this.iIndex]].arrAnswer[i] + '\n';
		    }
		    fieldAnswer.setValue(strShow);
		}
		else {
		    buttonRight.setEnabled(false);
		    buttonWrong.setEnabled(false);
		}
	    });


	    // Add an Atom
	    this.atomStat = new qx.ui.basic.Atom("", "lerntest/face-smile.png");
	    this.atomStat.setRich(true);
	    win.add(this.atomStat);

	    this.buttonStart = buttonRight;
	    win.open();

	    return win;
	},

	//
	//
	//
	createWindowDictionary : function() {

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
		var atomHello = new qx.ui.basic.Atom('Hello ' + this.getLogin() + '!', "lerntest/hello-lang.png");
		atomHello.setRich(true);
		win.add(atomHello);
	    }

	    //
	    // a new layout for input fields
	    //
	    var layoutGroup = new qx.ui.layout.Grid(8, 8);
	    layoutGroup.setColumnWidth(1, 300); // set with of column 1 to 200 pixel
	    //layoutGroup.setRowHeight(0, 100);
	    //layoutGroup.setRowHeight(1, 100);

	    var textGroupBox = new qx.ui.groupbox.GroupBox();
	    textGroupBox.setLayout(layoutGroup);
	    win.add(textGroupBox, {flex:1});

	    // 
	    var fieldQuestion = new qx.ui.form.TextArea();
	    fieldQuestion.set({
		placeholder: "Vokabel",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "black"
		})
	    });
	    var labelQuestion = new qx.ui.basic.Label("Frage");
	    labelQuestion.setBuddy(fieldQuestion);
	    textGroupBox.add(labelQuestion, {row: 0, column: 0});
	    textGroupBox.add(fieldQuestion, {row: 0, column: 1});
	    fieldQuestion.setReadOnly(false);

	    // 
	    var fieldAnswer = new qx.ui.form.TextArea();
	    fieldAnswer.set({
		placeholder: "Antwort",
		decorator: new qx.ui.decoration.Decorator().set({
		    width: 1,
		    style: "solid",
		    color: "red"
		})
	    });
	    fieldAnswer.setReadOnly(true);
	    var labelAnswer = new qx.ui.basic.Label("Antwort");
	    labelAnswer.setBuddy(fieldAnswer);
	    textGroupBox.add(labelAnswer, {row: 1, column: 0});
	    textGroupBox.add(fieldAnswer, {row: 1, column: 1});

	    var buttonGroupBox = new qx.ui.groupbox.GroupBox();
	    buttonGroupBox.setLayout(new qx.ui.layout.HBox(10));
	    win.add(buttonGroupBox, {flex:1});

	    var buttonQuery = new qx.ui.form.Button("Nachschlagen");
	    buttonGroupBox.add(buttonQuery, {flex:1});
	    buttonQuery.setIcon("lerntest/dialog-apply.png"); 

	    buttonQuery.addListener("execute", function() {
		qx.log.Logger.info(fieldQuestion,'Next query ' + fieldQuestion.getValue());

		var iIndex = this.processQuery(fieldQuestion.getValue());

		if (iIndex < 0) {
		    //
		    qx.log.Logger.info(fieldQuestion,'No result');
		} else {
		    var strShow = '';
		    for (var i=0; i < this.arrQuestions[iIndex].arrAnswer.length; i++) {
			strShow = strShow + this.arrQuestions[iIndex].arrAnswer[i] + '\n';
		    }
		    fieldAnswer.setValue(strShow);
		}
	    }, this);

	    win.open();

	    return win;
	}
    }
});
