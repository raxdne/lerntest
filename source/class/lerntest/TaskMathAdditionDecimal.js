//
// New class TaskMathAdditionDecimal
//
qx.Class.define("lerntest.TaskMathAdditionDecimal", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intSummanden) {
	
	var arrSummanden = [];
	var j;
	var n = intSummanden - Math.floor((Math.random() * (intSummanden - 2)));

	this.base(arguments);

	for (var i = 0; i < n; i++) {
	    var floatRandom = Math.random();

	    arrSummanden[i] = Math.random() * intMax;
	    if (floatRandom < 0.2 && arrSummanden[i] > 1.0) {
		arrSummanden[i] = arrSummanden[i].toFixed(0);
	    } else if (floatRandom < 0.5) {
		arrSummanden[i] = arrSummanden[i].toFixed(1);
	    } else if (floatRandom < 0.85) {
		arrSummanden[i] = arrSummanden[i].toFixed(2);
	    } else {
		arrSummanden[i] = arrSummanden[i].toFixed(3);
	    }
	}

	var strTask = '';
	var floatSum = 0.0;
	for (var i = 0; i < arrSummanden.length; i++) {
	    if (i > 0 ) {
		if (floatSum - arrSummanden[i] > 0) {
		    strTask = strTask + " - " + arrSummanden[i];
		    floatSum =- arrSummanden[i];
		} else {
		    strTask = strTask + " + " + arrSummanden[i];
		    floatSum =+ arrSummanden[i];
		}
	    }
	    else {
		strTask = arrSummanden[i];
		floatSum = arrSummanden[i];
	    }
	}

	this.setValue(strTask);
	this.setDecimal(true);
    }
});

