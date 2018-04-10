<!-- For Editor Controller -->

//window.Local=true; // needed for local server

/////////////////////////// v9 /////////////////////////////////////////
//// CSS CONTROL the EC wrapper and scroll bars of the wrapper //////////
$(document).ready(function (){
	$('.CodeMirror').css({
	  "border": "solid 1px #eee",
	  "background":"#FFFFFE",
	  "max-width":"80em",
	  "cursor":"default"
	});
	$('.CodeMirror-scroll').css({
	  "overflow-y": "auto", // or hidden
	  "overflow-x":"auto"
	});
	// To set height we need to work with attrib to pass !important. Is important to override previous height
	// In codemirros.css is defined height 1000px to keep the gutter with style
	$('.CodeMirror').attr('style', $('.CodeMirror').attr('style') + '; ' + 'height: 500px !important');
});
////////////////////////////////////////////////////////////////////////
// Preloaded Query
//var preloadQuery = "#Get raw concepts in this DW and named graphs they are defined \nSELECT DISTINCT ?Concept ?g \nWHERE \n{\n GRAPH ?g\n{\n ?Concept a owl:Class .\n} \n}\nORDER BY ?Concept";
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// Tokens list, loaded at init, used only for highlighting 
// or general completion
////////////////////////////////////////////////////////////////////////
function staticSuggestions() {
	var xmlhttp; var k= Math.random(); var url=location.pathname;

	url=url + "/../sparql/tokens?"+k;
	if(window.Local) url="http://127.0.0.1/EC/7/tokens?a="+k;
	if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();} else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
	xmlhttp.open("GET",url,false); xmlhttp.send();
	var resp=xmlhttp.responseText; 
	//Needed for highlight toekens in sparql_colors line 11
	window.standardTokens=resp;
}
	staticSuggestions();
	CodeMirror.sparHints[' '] = window.standardTokens.split("|").sort();
//////////////////////////////////////////////////////////////////////////
// init codemirror obj
//////////////////////////////////////////////////////////////////////////
	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		mode: "application/x-sparql-query",
		tabMode: "indent",
		extraKeys: {
			"Ctrl-Space": "autocomplete",
			// replaces TAB with spaces
			Tab: function(cm) {
				var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
				cm.replaceSelection(spaces, "end", "+input");
				}
			////////////////////////////
			},
			onKeyEvent:passAndHintAllKeys,			
			// false is scroll
			lineWrapping: false,
			// to keep the EC width while resizing window
			viewportMargin: Infinity,
			//The tab index to assign to the editor. If not given, no tab index will be assigned.
			//tabindex: integer,
			lineNumbers: true
		}
	);
//////////////////////////////////////////////////////////////////////////
//editor.setValue(preloadQuery);
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// Prepare the drop down list for suggestions
// Lines are separated by "\n".
//////////////////////////////////////////////////////////////////////////
// Dynamic suggestion list when pressing CTRL-Space
//////////////////////////////////////////////////////////////////////////
function dynamicSuggestionsCTRLSpace(cm, url) {
	var xmlhttp; var args=prepareUrl(cm);
	var url=url + "/../getSuggestionList?trigger=ctrl"+args;
	if(window.Local) url="http://127.0.0.1/EC/7/tokens_?trigger=ctrl"+args;

	if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();} else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
	xmlhttp.open("GET",url,false);  xmlhttp.send();
	var resp=xmlhttp.responseText;
	CodeMirror.sparHintsCTRL[' '] = resp.split('"|"').sort();
}
//////////////////////////////////////////////////////////////////////////
// Dynamic suggestion list after ? mark
//////////////////////////////////////////////////////////////////////////
function dynamicSuggestionsQuestionMark(cm, url) {
	var xmlhttp; var args=prepareUrl(cm);
	var k= Math.random();
	var url=url + "/../getSuggestionList?trigger=question"+args+'&'+k;
	if(window.Local) url="http://127.0.0.1/EC/7/tokens2?trigger=question"+args+'&'+k;

	if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();} else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
	xmlhttp.open("GET",url,false); xmlhttp.send();
	var resp=xmlhttp.responseText;
	CodeMirror.sparHintsQuestionMark[' '] = resp.split('"|"').sort();
}

//////////////////////////////////////////////////////////////////////////////
///////////////////// Activate CTRL-Space ////////////////////////////////////
CodeMirror.commands.autocomplete = function(cm) {
	var url=location.pathname; var options=[]; 	var pos = positionChar(cm);
	window.ctrlSPace='1';
	dynamicSuggestionsCTRLSpace(cm,url);
	options['what']='ctrl';
	options['fromChar'] = pos['fromChar'];
	options['toChar'] = pos['toChar'];
	options['typed']=pos['typed'];
	CodeMirror.showHint(cm, CodeMirror.sparHint, options);
}
//////////////////////////////////////////////////////////////////////////////
////////////////////Activate other suggestions////////////////////////////////
function passAndHintAllKeys(cm) {
	//disable this while CTRL-Space active
	if(window.ctrlSPace=='1') return false;
	if(document.getElementsByClassName('CodeMirror-hints').length>0) return false;

	// jQuery > 1.1.3
	var url=location.pathname;
	var options=[];

	$('.CodeMirror').keydown( function(event){ 
	var key =  event.which; 
	event.stopImmediatePropagation();	
	if(key<32) {   event.preventDefault(); return false; }  	// http://www.cambiaresearch.com/articles/15 for key codes
	if(key == 37|| key == 39) 		///////////// left and right arrow event /////////////////
	{ 
	event.stopPropagation();
		var pos = positionChar(cm);
		if(cm.getRange(CodeMirror.Pos(pos['cursorLine'], 0), CodeMirror.Pos(pos['cursorLine'], 1)) == "#" ) return false; // stop this if is a comment line starting with #
		if(pos['first']==' ') return false;
		if(pos['first']=='?') { CodeMirror.showHint(cm, CodeMirror.sparHint, options); }
		options['what']='arrow';
		CodeMirror.showHint(cm, CodeMirror.sparHint, options); 
	}
	else if(key == 187) { //////////////// get suggestion list for var; 187 is ? ////////////////
		event.stopPropagation();
		options['what']='var'; dynamicSuggestionsQuestionMark(cm,url); CodeMirror.showHint(cm, CodeMirror.sparHint, options); return true;
	}
	else  if(key >31 ){
		// the command is available only if user press [A-Za-z0-9äöüÄÖÜßéèáàúùóò=:_-]
		//var keyVal = String.fromCharCode(key);
		//var result = keyVal.match(/[A-Za-zäöüÄÖÜßéèáàúùóò=:_-]/g);
		//if(result) { 
						options['what']='twochar';  var pos = positionChar(cm); 
						if(pos['typed'].length < 1) return true; // wait for a second key
						CodeMirror.showHint(cm, CodeMirror.sparHint, options); //////////////// get static list with tokens ////////////////
						return true;
		//			}
	}
	}); // End on('keyDown')
	return false;
}
/////////////////////// END passAndHintAllKeys ///////////////////////////
//////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////
/////////////////////////// ACCESSORIES ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// Function used to prepare the URL args:
// All comment lines #.....\n will be replaced with \n - to keep
// numbering oflines
// return a string consisting of &line=&ch=&query=
//////////////////////////////////////////////////////////////////////////
function prepareUrl(cm) {
	var cursor = cm.getCursor();
		(cursor.ch==0) ? cursor.ch="zero" : cursor.ch;
		(cursor.line==0) ? cursor.line="zero" : cursor.line;
	var content=cm.getValue();
    //.replace(/#.*\n/gm,"\n");
	var query = "&query="+encodeURIComponent(content);	
	var position = "&line="+cursor.line+"&ch="+cursor.ch;
	return position+query;
}
/////////////////////////////////////////////////////////////
//////////// detecting key pressed //////////////////////////
/////////////////////////////////////////////////////////////
//////// detecting pattern of the actal line ////////////////
function positionChar(cm) {
	var cursor = cm.getCursor();
    var typed = '';
	var st=0; // pos of start actual string
	var flagA, flagB=false;
    var text = cm.getRange(CodeMirror.Pos(cursor.line, 0), cursor);
	var options = [];

    for(var i = text.length - 1; i >= 0; i--) {
		if(text[i] == ' ') { 
			st=i;
			break;
		} else 
		if(text[i] == '\n') { 
			break;
		}
        else 
		{
			{	
			if(text[i] == '"') { flagB=true;}
			if(text[i] == '?') { flagA=true;}
			typed = text[i] + typed;
			}
		}
	}
	text = text.slice(0, text.length - typed.length+1);
	options['fromChar']=cursor.ch - typed.length;
	options['toChar']=cursor.ch;
	options['flagA']=flagA;
	options['flagB']=flagB;
	options['typed']=typed;
	options['start']=st;
	options['first']=cm.getRange(CodeMirror.Pos(cursor.line, (st+1)), CodeMirror.Pos(cursor.line, (st+2)) ); // first character; may be a ? or a "
	options['cursorLine']=cursor.line;
	options['cursorCh']=cursor.ch;
	return options;
}
////////////////////////////////////////////////////////////////////