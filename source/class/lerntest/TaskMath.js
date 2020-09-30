//
// New abstract class TaskMath
//
qx.Class.define("lerntest.TaskMath", 
{
  extend     : qx.core.Object,

  type       : "abstract",

  properties : {
      login : {init : ''},
      value : {},
      decimal : {init: false, check: "Boolean"}
  },

    construct : function() {
	this.base(arguments);
	this.setValue('');
    },

    members : {
  	info : function() {
  	    qx.log.Logger.info(this, this.getValue() + ' = ' + this.solve());
  	},

  	solve : function() {
  	    return window.eval(this.getValue());
  	},

  	getPrintable : function() {

	    var strTask = this.getValue();

	    // reformat string for display (s. http://www.unicode.org/charts/)
	    strTask = strTask.replace(/\./g,',');
	    strTask = strTask.replace(/\-/g,'\u2212');
	    strTask = strTask.replace(/\*/g,'\u2219');
	    strTask = strTask.replace(/\//g,':');
	    
  	    return strTask;
  	},

	check : function (strAnswer) {

	    if (strAnswer == '') {
		return false;
	    }

	    var iValue  = window.eval(this.getValue());

	    if (this.isDecimal()) {
		var floatAnswer = window.eval(strAnswer.replace(/,/,'.'));
		if (Math.abs(floatAnswer - iValue) < Math.abs((0.001 * iValue))) {
		    qx.log.Logger.info(this,'Decimal value of answer ' + strAnswer + ': OK');
		    return true;
		}
		else {
		    qx.log.Logger.info(this,'Decimal value of answer ' + strAnswer + ': error');
		    return false;
		}
	    }
	    else {
		var intAnswer = window.eval(strAnswer);
		if (intAnswer == iValue) {
		    qx.log.Logger.info(this,'Integer value of answer ' + strAnswer + ': OK');
		    return true;
		}
		else {
		    qx.log.Logger.info(this,'Integer value of answer ' + strAnswer + ': error');
		    return false;
		}
	    }
	}
    }
});

