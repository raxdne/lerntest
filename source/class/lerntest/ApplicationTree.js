/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(lerntest/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "LernTest"
 */
qx.Class.define("lerntest.ApplicationTree",
{
    extend : qx.ui.tree.Tree,

    statics:
    {
    },

    properties :
    {
	login : {init : null},
	icon  : {init : 'resource/qx/icon/Tango/16/mimetypes/text-plain.png'}
    },

    construct : function(strLogin)
    {
	var _this = this;
	this.base(arguments);

	if (strLogin != null) {
	    var req = new qx.io.request.Xhr();

	    req.setUrl('/cxproc/exe');

	    // Set request data. Accepts String, Map or qooxdoo Object.
	    req.setRequestData({"ajax": '<xml name="' + strLogin.toLowerCase() + '/Tree.pie"/><xsl name="pie2qxmenu.xsl"/>'});

	    qx.log.Logger.info(req,'New request');

	    req.addListener("success", function(e) {
		var req = e.getTarget();
		//alert('Error: ' + req.getResponse());
		//var arrTree = [];
		
		try {
		    window.eval(req.getResponse());
		} catch( myError ) {
		    qx.log.Logger.info(this, myError.name + ': ' + myError.message );
		} finally {
		    qx.log.Logger.info(this,'Using default dictionary');
		}
 
		_this.setRoot(_this.build(null,arrTree[0]));
		_this.getRoot().setOpen(true);
	    }, this);

	    req.addListener("error", function(e) {
		var req = e.getTarget();
		alert('Error: ' + req.getResponse());
	    }, this);

	    req.send();
	} else {
	    // xsltproc pie2qxmenu.xsl klara/Tree.pie
	    var arrTreeOffline = [
		{strHeader: "LernTest",
		 arrChild: [
		     {strHeader: "Mathematik",
		      arrChild: [
			  {strHeader: "Klasse 1",
			   arrChild: [
			       {type : "Test", strHeader: "Addition", background: "background_shaun"},
			       {type : "Test", strHeader: "AdditionMittel", background: "background_shaun"},
			       {type : "Test", strHeader: "Zerlegung", background: "background_shaun"},
			       {type : "Test", strHeader: "Subtraktion", background: "background_shaun"},
			       {type : "Test", strHeader: "AdditionUndSubtraktion", background: "background_shaun"}
			   ]
			  },
			  {strHeader: "Klasse 2",
			   arrChild: [
			       {type : "Test", strHeader: "EinMalEinsKlein", background: "background_math"},
			       {type : "Test", strHeader: "AdditionHunderter", background: "background_math"},
			       {type : "Test", strHeader: "Multiplikation", background: "background_math"},
			       {type : "Test", strHeader: "Division", background: "background_math"},
			       {type : "Test", strHeader: "DivisionRest", background: "background_math"},
			       {type : "Test", strHeader: "Runden", background: "background_math"}
			   ]
			  },
			  {strHeader: "Klasse 3",
			   arrChild: [
			       {type : "Test", strHeader: "EinMalEinsGross", background: "background_math"}
			   ]
			  },
			  {strHeader: "Klasse 4",
			   arrChild: [
			       {type : "Test", strHeader: "AdditionSchriftlich", background: "background_math"},
			       {type : "Test", strHeader: "SubtraktionSchriftlich", background: "background_math"},
			       {type : "Test", strHeader: "DivisionGross", background: "background_math"},
			       {type : "Test", strHeader: "MultiplikationGross", background: "background_math"}
			   ]
			  },
			  {strHeader: "Klasse 5",
			   arrChild: [
			       {type : "Test", strHeader: "AdditionDezimal", background: "background_math"},
			       {type : "Test", strHeader: "MultiplikationDezimal", background: "background_math"},
			       {type : "Test", strHeader: "DivisionDezimal", background: "background_math"},
			       {type : "Test", strHeader: "Klammern", background: "background_math"}
			   ]
			  }
		      ]
		     }
		 ]
		}
	    ];
	    
	    _this.setRoot(_this.build(null,arrTreeOffline[0]));
	    _this.getRoot().setOpen(true);
	}

	_this.setHideRoot(false);
    },

    members :
    {
	build : function(wParent,objNode) {

	    var nodeNew = null;

	    if (objNode == undefined) {
		qx.log.Logger.error(this,'Cant initialize without args');
	    } else {
		var fSpecial = false;

		qx.log.Logger.info(this,objNode.strHeader);

		if (objNode.type != 'Test' && (objNode.arrChild == undefined || objNode.arrChild.length < 1)) {
		    return null;
		}

		nodeNew = new qx.ui.tree.TreeFolder(objNode.strHeader);

		if (objNode.icon == undefined) {
		} else {
		    nodeNew.setIcon(objNode.icon);
		}

		if (objNode.specialchars == undefined || objNode.specialchars == null) {
		} else if (objNode.specialchars.match(/yes/)) {
		    fSpecial = true;
		}

		nodeNew.setModel({type : objNode.type,
				  special :  fSpecial,
				  header : objNode.strHeader,
				  url : objNode.url,
				  background : objNode.background});
		//nodeNew.setOpen(false);
		if (wParent != null) {
		    wParent.add(nodeNew);
		}

		if (objNode.arrChild == undefined || objNode.arrChild.length < 1) {
		    //
		    if (wParent != null) {
			wParent.setOpen(false);
		    }
		    nodeNew.setIcon(this.getIcon());
		} else {
		    for (var i=0; i<objNode.arrChild.length; i++) {
			if (objNode.arrChild[i] == undefined) {
			    //
			} else {
			    this.build(nodeNew,objNode.arrChild[i]);
			}
		    }
		}
	    }
	    return nodeNew;
	}
    }
});
