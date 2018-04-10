// This is various shared functions lib
window.onbeforeunload = confirmExit;
function confirmExit()
{
	var sparql = editor.getValue();	
	if( SPARQL.query.value != sparql)
		return "The query is edited after last action. If you leave the page the changes get lost. You can save it to local file (Save Query button), or temporarily in a session cache by running or visualizing the query. Are you sure you want to leave this page?";
}


function getCaret(el) {
  if (el.selectionStart) {
	return el.selectionStart;
  } else if (document.selection) {
	el.focus();

	var r = document.selection.createRange();
	if (r == null) {
	  return 0;
	}

	var re = el.createTextRange(),
		rc = re.duplicate();
	re.moveToBookmark(r.getBookmark());
	rc.setEndPoint('EndToStart', re);

	return rc.text.length;
  } 
  return 0;
}

function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

function getSuggestionsList(target)
{
	var sparql = SPARQL.query.value;	
	var cursorPosition = getCaret(SPARQL.query);
	var nexturl = location.pathname + "/../getSuggestionList?query=" + encodeURIComponent(sparql) + "&index=" + cursorPosition + "&target=" + target;	
	
	window.location = nexturl; 		
	//goNewWin(nexturl);
	return false;
}				

function keyPressHandler(oEvent, target){
	var sparql = SPARQL.query.value;
	var cursorPosition = getCaret(SPARQL.query);
	if(oEvent.ctrlKey && oEvent.keyCode == 32){
		getSuggestionsList(target);
	}
	return false;
}

function moveCursorToEnd(el) {
   el.enabled;
   el.scrollTop = el.scrollHeight;  
   el.disabled;
}

function toggle(toggleid, displayid, showtext, hidetext ) {
	var ele = document.getElementById(displayid);
	var text = document.getElementById(toggleid);
	/*
	if(ele.style.visibility == "visible") {
		ele.style.visibility = "hidden";
		text.innerHTML = showtext;
  	}
	else {
		ele.style.visibility = "visible";
		text.innerHTML = hidetext;
	}
	*/
	
	if(ele.style.display == "block") {
    		ele.style.display = "none";
		text.innerHTML = showtext;
  	}
	else {
		ele.style.display = "block";
		text.innerHTML = hidetext;
	}

	return false;
} 

function changeVisibility(displayid, visible)
{			
	var ele = document.getElementById(displayid);
	if(visible == false) 
		ele.style.display = "none";
	else
		ele.style.display = "block";				
}	
			
function goNewWin(url) {

	// Set height and width
	var NewWinHeight=200;
	var NewWinWidth=200;

	// Place the window
	var NewWinPutX=10;
	var NewWinPutY=10;

	//Get what is below onto one line

	TheNewWin =window.open(url,'TheNewpop','fullscreen=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no'); 

	//Get what is above onto one line

	//TheNewWin.resizeTo(NewWinHeight,NewWinWidth);
	//TheNewWin.moveTo(NewWinPutX,NewWinPutY);
}

function loadQuery(id){
	var eSelect = document.getElementById(id);
	if(eSelect.selectedIndex == 0)
		return false;
		
	var query = eSelect.options[eSelect.selectedIndex].value;	
	
	editor.setValue(query);	
	SPARQL.query.value = query;	
	return false;
}

// Functions from button bar 

function ltrim(text) {    return escape(text);}

function showProgress()
{	
	var nexturl = location.pathname + "/ProgressInfo";	
	window.open = nexturl; 		
	return false;
}

function generateSPARQL(){
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;			
	var nexturl = location.pathname + "/../GenerateSPARQL";
	window.location = nexturl; 	
	return false;
}

function goSimpleSearchPage(){
	var nexturl = location.pathname + "/../SimpleSearchPage";
	window.location = nexturl; 	
	return false;
}

function SaveQuery()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;
	var nexturl = location.pathname + "/../save?query=" + encodeURIComponent(sparql);	
	window.location = nexturl; 		
	return false;
}		

function visualize(origin, withtablecheck)
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;
	
	var withtable="no";
	if(withtablecheck != '')
		withtable = document.getElementById(withtablecheck).checked;
	var nexturl = location.pathname + "/../visualize?query=" + encodeURIComponent(sparql) + "&origin=" + origin + "&withtable=" + withtable;	
	window.location = nexturl; 		
	return false;
}		

function getResultSetList()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;
	
	var nexturl = location.pathname + "/../getResultSetList?query=" + encodeURIComponent(sparql);	
	window.location = nexturl; 		
	return false;
}		

function visualizeQueryResultSet(id, joinsonly)
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;
	var resset = document.getElementById(id).value;
	
	var nexturl = location.pathname + "/../visualize/QueryAndResultSet?query=" + encodeURIComponent(sparql) + "&resultset=" + resset + "&joinsonly=" + joinsonly;	
	window.location = nexturl; 		
	return false;
}		

function visualizeNav()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;			
	var nexturl = location.pathname + "/../visualize/navigationGraph?query=" + encodeURIComponent(sparql);	
	window.location = nexturl; 		
	return false;
}		

function resetNav()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;			
	var nexturl = location.pathname + "/../visualize/reset";	
	window.location = nexturl; 		
	return false;
}		

function resetNavFromBrowser()
{
	var nexturl = location.pathname + "/../visualize/reset";	
	window.location = nexturl; 		
	return false;
}	

function saveNav()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;			
	var nexturl = location.pathname + "/../visualize/savenavmap";	
	window.location = nexturl; 		
	return false;
}	

function convertToRule()
{
	var sparql = editor.getValue();	
	SPARQL.query.value = sparql;			
	var nexturl = location.pathname + "/../ConvertToRule?query=" + encodeURIComponent(sparql) + "&format=text%2Fhtml&origin=explorequery";	
	window.location = nexturl; 		
	return false;
}	

function syncValue(input1, input2) {
	var x = document.getElementById(input2);
	var y = document.getElementById(input1);
	x.value = y.value;
}

function setNavMapSize(id){	
	var browser = BrowserDetect.browser;
	if( browser == 'Safari'){
		var obj = document.getElementById(id);
		obj.height="400";
		obj.width="1800";
	}
}

function checkBrowser(id){	
	var browser = BrowserDetect.browser;
	if( browser != 'Safari' && browser != 'Chrome'){
		var obj = document.getElementById(id);
		obj.innerHTML="Your browser is " + browser + ". Some visualization and interaction features are not working properly";
	}
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();	