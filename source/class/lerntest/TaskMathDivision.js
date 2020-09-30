//
// New class TaskMathDivision
//
qx.Class.define("lerntest.TaskMathDivision", 
{
    extend : lerntest.TaskMath,

    construct : function(intBase, intMax) {
	
	var intFactor = Math.ceil(Math.random() * 10.0); // result :-)

	this.base(arguments);
	this.setValue((intFactor * intBase) + ' / ' + (intBase));
    }
});

