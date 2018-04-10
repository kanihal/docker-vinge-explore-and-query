<!--
var _currentSeconds=0;
var _FontSize=10;
var _AnzElm=0;
var _HelpAnz=0;
var _BodyElm=0;
var _timerID=0;
var _starttime=0;
var _pausetime=0;


function init() {
	_AnzElm = document.getElementById('Anzeige');
	_HelpAnz = document.getElementById('helptext');
	_BodyElm = document.getElementsByTagName('body')[0];
}

function SchriftGroesse(str_operator) {
	var newFontSize=0;
	eval("newFontSize = _FontSize" + str_operator + "1");
	_AnzElm.style.fontSize = newFontSize + "em";
	_FontSize = newFontSize;
}

function ResetText() {
	var h_container = document.getElementById("hr");
	var m_container = document.getElementById("min");
	var s_container = document.getElementById("sec");

	_AnzElm.style.color = _BodyElm.style.color;
	_AnzElm.style.textDecoration = 'none';

	if (!isNaN(parseInt(h_container.value))) {
		Sekunden =  parseInt(h_container.value)*3600;
	} else {
		alert("Invalid hours value!");
		return;
	}
	if (!isNaN(parseInt(m_container.value))) {
		Sekunden +=  parseInt(m_container.value)*60;
	} else {
		alert("Invalid minutes value!");
		return;
	}
	if (!isNaN(parseInt(s_container.value))) {
		Sekunden +=  parseInt(s_container.value);
	} else {
		alert("Invalid seconds value!");
		return;
	}
	_starttime = 0;
	_pausetime=0;
	_currentSeconds = Sekunden;
	SetCountdownText(Sekunden);
}

function StartTimer() {
	if (_timerID == 0) {
		ResetText();
		_timerID = window.setInterval("CountDownTick()", 1000);
		_starttime = parseInt(new Date().getTime()/1000);
	}
}

function ResetTimer() {
	if (_timerID != 0) {
		_answer = confirm('Really reset the countdown?');
		if (_answer == false) {return;}
	}
	ResetText();
	_currentSeconds=0;
	StopTimer();
}

function StopTimer() {
	if (_timerID > 0) {
		window.clearInterval(_timerID);
		_timerID = 0;
		_pausetime = parseInt(new Date().getTime() / 1000);
	}
}

function ContinueTimer() {
	if (_timerID == 0) {
		_timerID = window.setInterval("CountDownTick()", 1000);
		if (_currentSeconds == 0) {
			ResetText();
		}
		_starttime = _starttime + parseInt(new Date().getTime()/1000) - _pausetime +1;
	}
}

function CountDownTick() {
	 if (_currentSeconds + _starttime - parseInt(new Date().getTime())/1000 <= 0) {
		StopTimer();
		/*_AnzElm.style.color = 'white';
		_AnzElm.style.textDecoration = 'blink';*/
	}

	SetCountdownText(_currentSeconds + _starttime - parseInt(new Date().getTime()/1000));
}

function SetCountdownText(seconds) {
	var deltaseconds = seconds;
	if (seconds < 0)
	{
		deltaseconds = 0;
	}
	var minutes=parseInt(deltaseconds/60);
	seconds = parseInt (deltaseconds % 60);
	var hours=parseInt(minutes / 60);
	minutes = parseInt(minutes % 60);
	var strText = /*AddNull(hours) + ":" + AddNull(minutes) + ":" +*/ AddNull(seconds);
	_AnzElm.innerHTML = strText;
}

function AddNull(num) {
	return ((num >= 0)&&(num < 10))?"0"+num:num+"";
}

/*
function MM_goToURL() {
	var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
	for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}
*/

function toggleHelp() {
	if (_HelpAnz.style.visibility=='hidden') {
		_HelpAnz.style.visibility='visible';
	} else {
		_HelpAnz.style.visibility='hidden';
	}
}

function toggleColor() {
	if (_BodyElm.style.backgroundColor == "black" ||
		_BodyElm.style.backgroundColor == "#000000" ||
		_BodyElm.style.backgroundColor == "rgb(0, 0, 0)") {
			_BodyElm.style.backgroundColor = "white";
			_BodyElm.style.color = "black";
	} else {
		_BodyElm.style.backgroundColor = "black";
		_BodyElm.style.color = "white";
	}
	_AnzElm.style.color = _BodyElm.style.color;
}
-->
