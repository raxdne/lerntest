//
// New class TaskMathMultiplicationDecimal
//
qx.Class.define("lerntest.TaskMathMultiplicationDecimal", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intFactor) {
	
	var arrFactor = [];
	var j;
	var n = intFactor - Math.floor((Math.random() * (intFactor - 2)));

	this.base(arguments);

	for (var i = 0; i < n; i++) {
	    var floatRandom = Math.random();

	    arrFactor[i] = Math.random() * intMax;
	    if (floatRandom < 0.1 && arrFactor[i] > 2.0) {
		arrFactor[i] = arrFactor[i].toFixed(0);
	    } else if (floatRandom < 0.5) {
		arrFactor[i] = arrFactor[i].toFixed(1);
	    } else if (floatRandom < 0.85) {
		arrFactor[i] = arrFactor[i].toFixed(2);
	    } else {
		arrFactor[i] = arrFactor[i].toFixed(3);
	    }
	}

	var strTask = '';
	for (var i = 0; i < arrFactor.length; i++) {
	    if (i > 0 ) {
		strTask = strTask + " * " + arrFactor[i];
	    }
	    else {
		strTask = arrFactor[i];
	    }
	}

	this.setValue(strTask);
	this.setDecimal(true);
    }
});

