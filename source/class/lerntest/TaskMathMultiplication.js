//
// New class TaskMathMultiplication
//
qx.Class.define("lerntest.TaskMathMultiplication", 
{
  extend : lerntest.TaskMath,

  construct : function(intMin, intMax, intSummanden) {
		
      var arrSummanden = [];
      var j;
      var n = intSummanden - Math.floor((Math.random() * (intSummanden - 2)));

      this.base(arguments);

      for (var i = 0; i < n; i++) {

	  arrSummanden[i] = Math.ceil(Math.random() * intMax);

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
	  }
      }

      var strTask = '';
      for (var i = 0; i < arrSummanden.length; i++) {
	  if (i > 0) {
	      strTask = strTask + " * " + arrSummanden[i];
	  } else {
	      strTask = arrSummanden[i];
	  }
      }

      this.setValue(strTask);
  }
});

