//
// New class TaskMathOrderOperation
//
qx.Class.define("lerntest.TaskMathOrderOperation", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intSummanden, flagMinus) {
	
	this.base(arguments);

	var a = Math.ceil(Math.random() * 15); 
	var b = Math.ceil((Math.random() + 1.0) * 5) + 1;
	var c = Math.ceil((Math.random() + 1.0) * 5) + a;
	var d = Math.ceil((Math.random() + 1.0) * 5) + b;
	var e = Math.ceil((Math.random() + 1.0) * 3);

	var strTask;
	var r = Math.random(); 
	var countTypes = 8.0;

	if (flagMinus == undefined || flagMinus == false) {	
	    // easier without double minus
	    if (r < (1.0 / countTypes)) {
		strTask = (a * (b + e)) + ' / (' + b + ' + ' + e + ')';			
	    } else if (r < (2.0 * 1.0 / countTypes)) {
	    	strTask = (a * d) + ' / ' + a + ' - ' + b;			
	    } else if (r < (3.0 * 1.0 / countTypes)) {
	     	strTask = a + ' * (' + c + ' - ' + b + ')';			
	    } else if (r < (4.0 * 1.0 / countTypes)) {
	     	strTask = a + ' + ' + (d * b) + ' / (' + b + ') - ' + e;
	    } else if (r < (5.0 * 1.0 / countTypes)) {
		strTask = a + ' + ' + (d * 4.0) + ' / (' + (d - e) + ' + ' + (d + e) + ')';
	    } else if (r < (6.0 * 1.0 / countTypes)) {
	     	strTask = a + ' * (' + d + ' + ' + (b * d) + ') / ' + d;
	    } else if (r < (7.0 * 1.0 / countTypes)) {
	     	strTask = c + ' * (' + d + ' - ' + b + ') - ' + a;
	    } else {
	     	strTask = a + ' + (' + c + ' - ' + a + ')';			
	    }
	} else {
	    if (r < (1.0 / countTypes)) {
		strTask = (a * b) + ' / ' + b + ' - (-' + c + ')';			
	    } else if (r < (2.0 * 1.0 / countTypes)) {
		strTask = (a * b) + ' / ' + b + ' - (-' + c + ')';			
	    } else if (r < (3.0 * 1.0 / countTypes)) {
		strTask = (a - b) * c + ' / (' + a + ' - ' + b + ')';			
	    } else if (r < (4.0 * 1.0 / countTypes)) {
		strTask = a + ' + ' + d * b + ' / (-' + b + ') + ' + c;
	    } else if (r < (5.0 * 1.0 / countTypes)) {
		strTask = a + ' + ' + d*b + ' / (-' + b + ') + ' + c;
	    } else if (r < (6.0 * 1.0 / countTypes)) {
		strTask = a + ' * ' + d + ' + (-' + b*d + ') / ' + d;
	    } else if (r < (7.0 * 1.0 / countTypes)) {
		strTask = a + ' * (' + d + ' + ' + b*b + ') - ' + d;
	    } else {
		strTask = a + ' + ' + c + ' - (-' + b + ')';			
	    }
	}

	this.setValue(strTask);
    }
});

