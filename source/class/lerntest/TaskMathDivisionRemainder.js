//
// New class TaskMathDivisionRemainder
//
qx.Class.define("lerntest.TaskMathDivisionRemainder", 
{
  extend : lerntest.TaskMath,

    construct : function(intBaseA,intBaseB) {
	
	this.base(arguments);

	var intFactorA, intFactorB, intRemainder;

	intFactorA = Math.ceil(Math.random() * intBaseA); // result :-)
	do {
	    intFactorB = Math.ceil(Math.random() * intBaseB);
	} while (intFactorB < 2 || intFactorA == intFactorB);

	do {
	    intRemainder = Math.floor(Math.random() * intFactorB); // result :-)
	} while (intRemainder < 1);

	this.setValue((intFactorA * intFactorB + intRemainder) + ' / ' + intFactorB);
    },

  members : {
        // special check method because of remainder values in answer string
  	check : function (strAnswer) {

	    var arrTask = this.getValue().split('/');

	    var arrAnswer = strAnswer.toLowerCase().split('r');

	    if (arrTask.length == 2) {
		// 
	    }
	    else {
		qx.log.Logger.error(this,"This is not a valid task!");
	    }

	    if (arrAnswer.length == 2) {
		// there is a remainder
		if (Number(arrAnswer[0]) * Number(arrTask[1]) + Number(arrAnswer[1]) == Number(arrTask[0])) {
		    qx.log.Logger.info(this,'Answer ' + strAnswer + ': OK');
		    return true;
		}
	    }
	    else if (arrAnswer.length == 1) {
		// there is no remainder
		if (Number(arrAnswer[0]) * Number(arrTask[1]) == Number(arrTask[0])) {
		    qx.log.Logger.info(this,'Answer ' + strAnswer + ': OK');
		    return true;
		}
	    }

	    qx.log.Logger.info(this,'Answer ' + strAnswer + ': error');
  	    return false;
  	}
  }
});

