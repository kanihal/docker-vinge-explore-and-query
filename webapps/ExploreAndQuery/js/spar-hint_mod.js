///////////////////////////////v3d/////////////////////////////////
(function() {
    CodeMirror.newHints = [];
    CodeMirror.sparHint = function(cm) {
/////////////////////////////////////////////////////////
////////////// GET tokens list //////////////////////////
	var xmlhttp;
	var k= Math.random();
	
	var cursor = cm.getCursor();		
	var text = cm.getRange(CodeMirror.Pos(0, 0), cursor);
	   for(var i = text.length - 1; i >= 0; i--) {
			if(text[i] == ' ') { 
				simbol = text[i];
				break;
			}
			else {
				typed = text[i] + typed;
			}
		}
			
	// for lazy ppl :P
	if(window.location.href=='http://127.0.0.1/EC/3/') 
		{
			var url="http://127.0.0.1/EC/3/tokens?"+k; 
		} 
	else 
		{
			var url;
			// if the ctrl-space is pressed ate the beginning of the word or after ? mark denoting the varibale, get a different suggestion list
			if(options=="ctrl" && (typed =="" || typed == "?"){
				var cursorPosition = getCaret(SPARQL.code);
				url=location.pathname + "/../getSuggestionList?query=" + escape(text) + "&index=" + cursorPosition;
			}	
			else			
				url=location.pathname + "/../sparql/tokens?"+k;
			//var url="http://localhost:8080/SemDW/sparql/tokens?"+k;
			//alert(url);
		}	
	//if(window.location.href=='http://127.0.0.1/EC/3/d/') {var url="http://127.0.0.1/EC/3/tokens?"+k; } else {var url="http://107.20.241.80:8080/SemDW/sparql/tokens?"+k;}

	//ASYNC false, load tokens before the init object
	if (window.XMLHttpRequest) 
		{xmlhttp=new XMLHttpRequest(); 
	else 
		{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET",url,false); xmlhttp.send();
	var resp=xmlhttp.responseText;

	CodeMirror.newHints[' '] = resp.split("|").sort();
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
        var typed = '';
        var simbol = ' ';	
		var path = getActiveElement(text) + simbol;
		var hints = CodeMirror.newHints[path];
        
        if (cursor.ch > 0) {
			
            text = text.slice(0, text.length - typed.length);

            path = getActiveElement(text) + simbol;
            hints = CodeMirror.newHints[path];

            if(typeof hints === 'undefined')
                hints = [''];
            else {
                hints = hints.slice(0);
                for (var i = hints.length - 1; i >= 0; i--) {
					if(hints[i].toLowerCase().indexOf(typed.toLowerCase() ) == -1)
						hints.splice(i, 1);
                }
            }
		}
		return {
			list: hints,
			from: CodeMirror.Pos(cursor.line, cursor.ch - typed.length),
			to: cursor,
			nrChar:typed.length
		};
        
    };

    var getActiveElement = function(text) {
        var element = '';
        if(text.length >= 0) {
        }
        return element;
    };
})();
