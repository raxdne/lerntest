//
// New class TaskMathAddition
//
qx.Class.define("lerntest.TaskMathAddition", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intSummanden) {
	
	var arrSummanden = [];
	var j;
	var n = intSummanden - Math.floor((Math.random() * (intSummanden - 2)));

	this.base(arguments);

	for (var i = 0; i < n; i++) {

	    // if (i == 0) {
	    arrSummanden[i] = Math.ceil(Math.random() * intMax);
	    // } else {
	    // 	arrSummanden[i] = intMax - Math.ceil(Math.random() * 2 * intMax);
	    // }

	    //
	    // some numerical checks
	    //

	    if (arrSummanden[i] == 0) {
		// dont use this value
		i--;
		continue;
	    }

	    for (var intSum = 0, j = 0; j <= i; j++) {
		if (j != i && Math.abs(arrSummanden[i]) == Math.abs(arrSummanden[j])) {
		    // same values, dont use the newer one
		    i--;
		    break;
		}
		intSum += arrSummanden[j];
		// if (intSum < 0) {
		//     arrSummanden[j] = -arrSummanden[j];
		//     intSum += 2 * arrSummanden[j];
		// }
	    }
	}

	var strTask = '';
	for (var i = 0; i < arrSummanden.length; i++) {
	    if (i > 0) {
		// if (arrSummanden[i] > 0) {
		strTask = strTask + " + " + arrSummanden[i];
		// } else {
		//     strTask = strTask + " - " + Math.abs(arrSummanden[i]);
		// }
	    } else {
		strTask = arrSummanden[i];
	    }
	}
	
	this.setValue(strTask);
    }
});

