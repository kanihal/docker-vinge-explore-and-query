///////////////////////////////v7/////////////////////////////////
CodeMirror.defineMode("sparql", function(config, parserConfig) {

var startSymbol="#";
var acceptEmpty=true;
var keywords=/^(GROUP_CONCAT|DATATYPE|BASE|PREFIX|SELECT|CONSTRUCT|DESCRIBE|ASK|FROM|NAMED|ORDER|BY|LIMIT|ASC|DESC|OFFSET|DISTINCT|REDUCED|WHERE|GRAPH|OPTIONAL|UNION|FILTER|GROUP|HAVING|AS|VALUES|LOAD|CLEAR|DROP|CREATE|MOVE|COPY|SILENT|INSERT|DELETE|DATA|WITH|TO|USING|NAMED|MINUS|BIND|LANGMATCHES|LANG|BOUND|SAMETERM|ISIRI|ISURI|ISBLANK|ISLITERAL|REGEX|TRUE|FALSE|UNDEF|ADD|DEFAULT|ALL|SERVICE|INTO|IN|NOT|IRI|URI|BNODE|RAND|ABS|CEIL|FLOOR|ROUND|CONCAT|STRLEN|UCASE|LCASE|ENCODE_FOR_URI|CONTAINS|STRSTARTS|STRENDS|STRBEFORE|STRAFTER|YEAR|MONTH|DAY|HOURS|MINUTES|SECONDS|TIMEZONE|TZ|NOW|UUID|STRUUID|MD5|SHA1|SHA256|SHA384|SHA512|COALESCE|IF|STRLANG|STRDT|ISNUMERIC|SUBSTR|REPLACE|EXISTS|COUNT|SUM|MIN|MAX|AVG|SAMPLE|SEPARATOR|STR)/i ;

	String.prototype.replaceAll = function( token, newToken ) { var _token; var str = this + "";var i = -1; if ( typeof token === "string" ) { return this.split( token ).join( newToken );} return str;};
	// ( \ ? * : .
	var wT; wT = window.standardTokens.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('?', '\\?').replaceAll('*', '\\*').replaceAll(':', '\\:').replaceAll('.', '\\.');
	var ECtokens = new RegExp("^(" + wT+ ")","i");

	function getTerminals()
	{
		var WS    =        '[\\x20\\x09\\x0D\\x0A]';
		var IRI_REF = '<[^<>\"\'\|\{\}\^\\\x00-\x20]*>';
		var COMMENT = '#([^\\n\\r]*[\\n\\r]|[^\\n\\r]*$)';
		// UTF-8 encoding table http://www.utf8-chartable.de/unicode-utf8-table.pl
		var PN_CHARS_BASE =
			'[A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD]';
		// underline
		var PN_CHARS_U = PN_CHARS_BASE+'|_';
		// with numbers
		var PN_CHARS= '('+PN_CHARS_U+'|-|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])';
		// namespace
		var PN_PREFIX= '('+PN_CHARS_BASE+')((('+PN_CHARS+')|\\.)*('+PN_CHARS+'))?';
		var PNAME_NS = '('+PN_PREFIX+')?:';

			var HEX= '[0-9A-Fa-f]';
			var PERCENT='(%'+HEX+HEX+')';
			var PN_LOCAL_ESC='(\\\\[_~\\.\\-!\\$&\'\\(\\)\\*\\+,;=/\\?#@%])';
			var PLX= '('+PERCENT+'|'+PN_LOCAL_ESC+')';
		var PN_LOCAL= '('+PN_CHARS_U+'|:|[0-9]|'+PLX+')(('+PN_CHARS+'|\\.|:|'+PLX+')*('+PN_CHARS+'|:|'+PLX+'))?';
		var PNAME_LN = PNAME_NS+PN_LOCAL;
		var BLANK_NODE_LABEL = '_:('+PN_CHARS_U+'|[0-9])(('+PN_CHARS+'|\\.)*'+PN_CHARS+')?';

		var PN_PREFIX= '('+PN_CHARS_BASE+')((('+PN_CHARS+')|\\.)*('+PN_CHARS+'))?';
		var VARNAME = '('+PN_CHARS_U+'|[0-9])'+
			'('+PN_CHARS_U+'|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])*';
		var VAR1 = '\\?'+VARNAME;

		var ECHAR = '\\\\[tbnrf\\\\"\']';
		var STRING_LITERAL1 = "'(([^\\x27\\x5C\\x0A\\x0D])|"+ECHAR+")*'";
		var STRING_LITERAL2 = '"(([^\\x22\\x5C\\x0A\\x0D])|'+ECHAR+')*"';
		var ERROR_STRING_LITERAL1 = '"(([^\\x22\\x5C\\x0A\\x0D])|'+ECHAR+')*';
		var ERROR_STRING_LITERAL2 = '"(([^\\x22\\x5C\\x0A\\x0D])|'+ECHAR+')* "';

		var LANGTAG = '@[a-zA-Z]+(-[a-zA-Z0-9]+)*';
		var terminals=
			{
				terminal: [
					{ name: "WS",
						regex:new RegExp("^"+WS+"+"),
						style:"ws" },
					{ name: "COMMENT",
						regex:new RegExp("^"+COMMENT),
						style:"comment" },
					{ name: "IRI_REF",
						regex:new RegExp("^"+IRI_REF),
						style:"url" },
					{ name: "VAR1",
						regex:new RegExp("^"+VAR1),
						style:"variable"},
					// type aaa:bbb
					{ name: "PNAME_LN",
						regex:new RegExp("^"+PNAME_LN),
						style:"atom" },
					// type (aaa:bbb
					{ name: "PNAME_LN",
						regex:new RegExp("^\\("+PNAME_LN),
						style:"atom" },
					// type aaa:
					{ name: "PNAME_NS",
						regex:new RegExp("^"+PNAME_NS),
						style:"meta" },
					{ name: "LANGTAG",
						regex:new RegExp("^"+LANGTAG),
						style:"lang"},
					//we may need this; now remain with atom style
					{ name: "BLANK_NODE_LABEL",
						regex:new RegExp("^"+BLANK_NODE_LABEL),
						style:"atom" },
					// Error - literals with whitespaces before closing " double quote
					// must processed BEFORE the string literal
					{ name: "ERROR_STRING_LITERAL2",
						regex:new RegExp("^"+ERROR_STRING_LITERAL2),
						style:"invalid" },
					// string with ' '
					{ name: "STRING_LITERAL1",
						regex:new RegExp("^"+STRING_LITERAL1),
						style:"variable-2" },
					// string with " "
					{ name: "STRING_LITERAL2",
						regex:new RegExp("^"+STRING_LITERAL2),
						style:"variable-3" },
					// Error - literals with not closed " double quote
					{ name: "ERROR_STRING_LITERAL1",
						regex:new RegExp("^"+ERROR_STRING_LITERAL1),
						style:"invalid" },
				],
			}
		return terminals;
	}
	// END getTerminals()

	function getPossibles(symbol)
	{ var possibles=[];possibles.push(symbol);return possibles;}

	var tms= getTerminals();
	var terminal=tms.terminal;

	function tokenBase(stream, state) {
		function nextToken() {
			var consumed=null;
			// Keywords
			consumed= stream.match(keywords,true,false);
			if (consumed)
				return { cat: stream.current(),
								 style: "keyword",
								 text: consumed[0],
							 };
			// Tokens defined by individual regular expressions
			consumed= stream.match(ECtokens,true,false);
			if (consumed)
				return { cat: stream.current(),
								 style: "tokens",
								 text: consumed[0]
							 };
			for (var i=0; i<terminal.length; ++i) {
				consumed= stream.match(terminal[i].regex,true,false);
				if (consumed)
					return { cat: terminal[i].name,
									 style: terminal[i].style,
									 text: consumed[0]
								 };
			}			
			// to be implemented if a def is not ok. Are we allowed for & or %  -???
			consumed= stream.match(/^.[A-Za-z0-9]*/,true,false);
			return { cat:"invalid",
							 //style: "invalid",
							 style: "",
							 text: consumed[0]
						 };
		}
		// END nextToken()

		// CodeMirror works with one line at a time, but newline should behave like whitespace
		var tokenOb= nextToken();

		if (tokenOb.cat=="invalid") {
			// set error state, and
			if (state.OK==true) {state.OK=false;}
			state.complete=false;// alert("Invalid:"+tokenOb.text);
			return tokenOb.style;
		}
		if (tokenOb.cat == "WS" || tokenOb.cat == "COMMENT") {
			state.possibleCurrent= state.possibleNext;
			return(tokenOb.style)
		}
		// run the parser until the token is digested or failure
		var finished= false;
		var topSymbol;
		var token= tokenOb.cat;

		while(state.stack.length>0 && token && state.OK && !finished ) {
			topSymbol= state.stack.pop();
				// Top symbol is a terminal
				if (topSymbol==token) {
					// Matching terminals
					// - consume token from input stream
					finished=true;
					var allNillable=true;
					for(var cm=state.stack.length;cm>0;--cm) {
							allNillable=false;
					}
					state.complete= allNillable;

				} else {
					state.OK=false;
					state.complete=false;
				}
		}
		//END while
		
		if (!finished && state.OK) { 
			state.OK=false; state.complete=false; 
		}	
		state.possibleCurrent= state.possibleNext;
		state.possibleNext= getPossibles(state.stack[state.stack.length-1]);
		//alert(token+"="+tokenOb.style+'\n'+state.stack);
		return tokenOb.style;
	}
	// END tokenBase()

	return {
		token: tokenBase,
		startState: function(base) {
			return {
				tokenize: tokenBase,
				OK: true,
				complete: true,
				stack: [startSymbol] }; }
	};
});
CodeMirror.defineMIME("application/x-sparql-query", "sparql");