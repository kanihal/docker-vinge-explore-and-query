<!-- For Editor Controller -->

			var xmlhttp;
			// we need to avoid cached results
			var k= Math.random();
			
			// for lazy ppl :P
			if(window.location.href=='http://127.0.0.1/EC/3/') 
				{
					var url="http://127.0.0.1/EC/3/tokens?"+k; 
				} 
			else 
				{
					var url=location.pathname + "/../sparql/tokens?"+k;
				}
		

			//ASYNC false, load tokens before the init object
			if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();} else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
			xmlhttp.open("GET",url,false); xmlhttp.send();
			var resp=xmlhttp.responseText; window.Tokens=resp;

	//////////////////////////////////////////////////////////////////////////
	// Prepare the drop down list
	//////////////////////////////////////////////////////////////////////////

	function passAndHint(cm) {
		setTimeout(function() {cm.execCommand("autocompleteB");}, 100);
		return CodeMirror.Pass;
	}
	CodeMirror.commands.autocompleteB = function(cm) {
		  CodeMirror.showHint(cm, CodeMirror.sparHint, "twochar");
	}
	
	CodeMirror.commands.autocomplete = function(cm) {
		  CodeMirror.showHint(cm, CodeMirror.sparHint, "ctrl");
	}
	//////////////////////////////////////////////////////////////////////////
	// init codemirror obj
	//////////////////////////////////////////////////////////////////////////
	  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		mode: "application/x-sparql-query",
		tabMode: "indent",
		extraKeys: {
			"' '": passAndHint,
			"Ctrl-Space": "autocomplete"
		},
		lineNumbers: true
	  });

	  var input = document.getElementById("select");
	  function selectTheme() {
		var theme = input.options[input.selectedIndex].innerHTML;
		editor.setOption("theme", theme);
	  }
	  var choice = document.location.search &&
				   decodeURIComponent(document.location.search.slice(1));
	  if (choice) {
		input.value = choice;
		editor.setOption("theme", choice);
	  }
