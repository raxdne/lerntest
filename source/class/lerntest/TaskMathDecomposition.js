//
// New class TaskMathDecomposition
//
qx.Class.define("lerntest.TaskMathDecomposition", 
{
  extend : lerntest.TaskMath,

    construct : function(intMin, intMax, intSummanden) {
	
	this.base(arguments);

	var strTask = Number(intMin + Math.ceil(Math.random() * (intMax - intMin))).toString();
	
	this.setValue(strTask);
    },

    members :
    {
	check : function (strAnswer) {

	    if (strAnswer == '') {
		return false;
	    }

	    var iValue  = window.eval(this.getValue());

	    var intAnswer = window.eval(strAnswer);

	    if (strAnswer.match(/[0-9]+ *\+ *[0-9]+/) && ! strAnswer.match(/\b0\b/) && intAnswer == iValue) {
		qx.log.Logger.info(this,'Integer value of answer ' + strAnswer + ': OK');
		return true;
	    }
	    else {
		qx.log.Logger.info(this,'Integer value of answer ' + strAnswer + ': error');
		return false;
	    }
	}
    }

});

