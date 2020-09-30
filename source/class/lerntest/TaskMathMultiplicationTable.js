//
// New class TaskMathMultiplicationTable
//
qx.Class.define("lerntest.TaskMathMultiplicationTable", 
{
  extend : lerntest.TaskMath,

    construct : function(intCounter, intBase) {
	
	this.base(arguments);
	this.setValue(intCounter + ' * ' + intBase);
    }
});

