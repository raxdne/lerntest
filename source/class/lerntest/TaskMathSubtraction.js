//
// New class TaskMathSubtraction
//
qx.Class.define("lerntest.TaskMathSubtraction", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intSubtrahend) {
	
	var arrSubtrahend = [];

	this.base(arguments);

	var intDifference = 0;
	var intPop = 0;
	for (var i = 0; i < intSubtrahend; i++) {

	    if (i == 0) {
		arrSubtrahend[0] = intMax - Math.ceil(Math.random() * (intMax * 0.5));
		intDifference = arrSubtrahend[0];
	    } else {
		arrSubtrahend[i] = Math.ceil(Math.random() * (intMax / (intSubtrahend - 1)));
		intDifference -= arrSubtrahend[i];
	    }
	    qx.log.Logger.info(this,'New Subtrahend ' + i + ' = ' + arrSubtrahend[i] + ', Diff = ' + intDifference);

	    //
	    // some numerical checks
	    //

	    if (intDifference < 1) {
	    	arrSubtrahend.pop();
	    	intPop++;
	    	if (i < 2 && intPop < 3) {
		    qx.log.Logger.info(this,'Skipping Subtrahend ' + i);
	    	    i--;
	    	    continue;
	    	} else {
	    	    break;
	    	}
	    }
	}

	var strTask = '';
	for (var i = 0; i < arrSubtrahend.length; i++) {
	    if (i > 0) {
		strTask = strTask + " - " + arrSubtrahend[i];
	    } else {
		strTask = arrSubtrahend[i];
	    }
	}
	
	this.setValue(strTask);
    }
});

