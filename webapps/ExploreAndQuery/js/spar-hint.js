///////////////////////////////v9////////////////////////
(function() {
    CodeMirror.sparHints = []; // static
	CodeMirror.sparHintsQuestionMark=[]; // dynamic
	CodeMirror.sparHintsCTRL=[]; // dynamic

    CodeMirror.sparHint = function(cm,options) {
	var cursor = cm.getCursor();
	var opt = positionChar(cm); // from EC.js
	var flagC=false;
	var flagA=opt['flagA'];
	var flagB=opt['flagB'];
	var fromChar=opt['fromChar'];
	var toChar=opt['toChar'];
	var typed=opt['typed'];
	var st=opt['start'];
	var cursorCh=opt['cursor.ch'];
	var cursorLine=opt['cursor.line'];

				 if(options['what']=='ctrl') 		{ var hints = CodeMirror.sparHintsCTRL[' ']; }
			else if(options['what']=='twochar')		{ var hints = CodeMirror.sparHints[' ']; }
			else if(options['what']=='var') 		{ var hints = CodeMirror.sparHintsQuestionMark[' '];}

	// flagC is controlling hints list
	if(options['what']=='arrow')
	{
		if(cursor.ch==0) { return false; }
		else
		{
			//////////////// z = pos end of the string ||||| st = start of string ////////////////
			//////////////////////////////////////////////////////////////////////////////////////
			for(var t=cursor.ch; cursor.ch>0 && t<100; t++){
				x= cm.getRange(CodeMirror.Pos(cursor.line, t), CodeMirror.Pos(cursor.line, (t+1)));
				if(x==' ' || x == '\n')
				{ var z=t; break;}
			}
			if(st>0) { st=st+1;} 
			if(flagA) { var hints = CodeMirror.sparHintsQuestionMark[' ']; flagC=true; }
			else if(flagB) { var hints = CodeMirror.sparHintsCTRL[' ']; flagC=false; }
			else { var hints = CodeMirror.sparHints[' ']; }
			fromChar=st; toChar=z;
		}
	}       
	
	if(typeof hints === 'undefined')
        hints = [''];
	else {
		hints = hints.slice(0);
		for (var i = hints.length - 1; i >= 0; i--) {
				if( hints[i].toLowerCase().indexOf(typed.toLowerCase()) == -1  && (!flagC))
				{ hints.splice(i, 1); }
			}
    }
	if(hints == "") return false;

		return {
			list: hints,
            from: CodeMirror.Pos(cursor.line, fromChar),
			to: CodeMirror.Pos(cursor.line, toChar),
			nrChar:typed.length
        };
    };
})();