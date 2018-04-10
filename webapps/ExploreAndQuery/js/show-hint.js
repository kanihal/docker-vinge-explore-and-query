////// v8 ///////////////
CodeMirror.showHint = function(cm, getHints, options) {
  if (!options) options = {};
  var startCh = cm.getCursor().ch, continued = false;

  function startHinting() {
    // We want a single cursor position.
    if (cm.somethingSelected()) return;
    return showHints(getHints(cm, options));
  }

  function getText(completion) {	
    if (typeof completion == "string") return completion;
    else return completion.text;
  }

  function pickCompletion(cm, data, completion) {
    if (completion.hint) completion.hint(cm, data, completion);
    else cm.replaceRange(getText(completion), data.from, data.to);
  }

  function showHints(data) {
    if (!data || !data.list.length) return;
	var completions = data.list;
	if (document.getElementsByClassName('CodeMirror-hints').length)
	{ CodeMirror.signal(data, "close"); return true; } else {	
    // Build the select widget
	var hints = document.createElement("ul"), selectedHint = 0;
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
		if(options['what']=="ctrl") 		hints.className = "CodeMirror-hints ctrl";
		if(options['what']=="arrow") 		hints.className = "CodeMirror-hints arrow";
		if(options['what']=="var")			hints.className = "CodeMirror-hints var";
		if(options['what']=="twochar") hints.className = "CodeMirror-hints twocar";
	////////////////////////////////////////////////////
		for (var i = 0; i < completions.length; ++i) {
      var elt = hints.appendChild(document.createElement("li")), completion = completions[i];
      var className = "CodeMirror-hint" + (i ? "" : " CodeMirror-hint-active");
      if (completion.className != null) className = completion.className + " " + className;
      elt.className = className;
      if (completion.render) completion.render(elt, data, completion);
      else elt.appendChild(document.createTextNode(completion.displayText || getText(completion)));
      elt.hintId = i;
    }
	var pos = cm.cursorCoords(options.alignWithWord !== false ? data.from : null);
    var left = pos.left, top = pos.bottom, below = true;
	//////////////////////////////////////////////////////////////////////////////////////////
    hints.style.left = left + "px";
    hints.style.top = top + "px";
    document.body.appendChild(hints);
    CodeMirror.signal(data, "shown");

    // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
    var winW = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
    var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    var box = hints.getBoundingClientRect();
    var overlapX = box.right - winW, overlapY = box.bottom - winH;
    if (overlapX > 0) {
      if (box.right - box.left > winW) {
        hints.style.width = (winW - 5) + "px";
        overlapX -= (box.right - box.left) - winW;
      }
      hints.style.left = (left = pos.left - overlapX) + "px";
    }
    if (overlapY > 0) {
      var height = box.bottom - box.top;
      if (box.top - (pos.bottom - pos.top) - height > 0) {
        overlapY = height + (pos.bottom - pos.top);
        below = false;
      } else if (height > winH) {
        hints.style.height = (winH - 5) + "px";
        overlapY -= height - winH;
      }
      hints.style.top = (top = pos.bottom - overlapY) + "px";
    }

    function changeActive(i) {
      i = Math.max(0, Math.min(i, completions.length - 1));
      if (selectedHint == i) return;
      var node = hints.childNodes[selectedHint];
      node.className = node.className.replace(" CodeMirror-hint-active", "");
      node = hints.childNodes[selectedHint = i];
      node.className += " CodeMirror-hint-active";
      if (node.offsetTop < hints.scrollTop)
        hints.scrollTop = node.offsetTop - 3;
      else if (node.offsetTop + node.offsetHeight > hints.scrollTop + hints.clientHeight)
        hints.scrollTop = node.offsetTop + node.offsetHeight - hints.clientHeight + 3;
      CodeMirror.signal(data, "select", completions[selectedHint], node);
    }

    function screenAmount() {
      return Math.floor(hints.clientHeight / hints.firstChild.offsetHeight) || 1;
    }

    var ourMap, baseMap = {
      Up: function() {changeActive(selectedHint - 1);},
      Down: function() {changeActive(selectedHint + 1);},
      PageUp: function() {changeActive(selectedHint - screenAmount());},
      PageDown: function() {changeActive(selectedHint + screenAmount());},
      Home: function() {changeActive(0);},
      End: function() {changeActive(completions.length - 1);},
      Enter: function() { pick(options);},
      Tab: function() {changeActive(selectedHint + 1);},
      Esc: close
    };
    if (options.customKeys) {
      ourMap = {};
      for (var key in options.customKeys) if (options.customKeys.hasOwnProperty(key)) {
        var val = options.customKeys[key];
        if (baseMap.hasOwnProperty(val)) val = baseMap[val];
        ourMap[key] = val;
      }
    } else ourMap = baseMap;

    cm.addKeyMap(ourMap);
    cm.on("cursorActivity", cursorActivity);
    var closingOnBlur;
    function onBlur(){ closingOnBlur = setTimeout(close, 100); };
    function onFocus(){ clearTimeout(closingOnBlur); };
    cm.on("blur", onBlur);
    cm.on("focus", onFocus);
    var startScroll = cm.getScrollInfo();
    function onScroll() {
      var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
      var newTop = top + startScroll.top - curScroll.top, point = newTop;
      if (!below) point += hints.offsetHeight;
      if (point <= editor.top || point >= editor.bottom) return close();
      hints.style.top = newTop + "px";
      hints.style.left = (left + startScroll.left - curScroll.left) + "px";
    }
    cm.on("scroll", onScroll);
    CodeMirror.on(hints, "dblclick", function(e) {
      var t = e.target || e.srcElement;
      if (t.hintId != null) {selectedHint = t.hintId; pick(options);}
    });
    CodeMirror.on(hints, "click", function(e) {
      var t = e.target || e.srcElement;
      if (t.hintId != null) changeActive(t.hintId);
    });
    CodeMirror.on(hints, "mousedown", function() {
      setTimeout(function(){cm.focus();}, 20);
    });

    var done = false, once;
    function close(willContinue) {
      if (done) return;
      done = true;
      clearTimeout(once);
      hints.parentNode.removeChild(hints);
      cm.removeKeyMap(ourMap);
      cm.off("cursorActivity", cursorActivity);
      cm.off("blur", onBlur);
      cm.off("focus", onFocus);
      cm.off("scroll", onScroll);
	  if(window.ctrlSPace=='1') window.ctrlSPace='0'; // reset signal for Ctrl-Space
      if (willContinue !== true) CodeMirror.signal(data, "close");
    }
    function pick(options) {
		// and add a space after completion
		var more=" ";
      pickCompletion(cm, data, completions[selectedHint]+more);
	  close();
    }
    var once, lastPos = cm.getCursor(), lastLen = cm.getLine(lastPos.line).length;
    function cursorActivity() {
      clearTimeout(once);

      var pos = cm.getCursor(), line = cm.getLine(pos.line);
		if (pos.line != lastPos.line || line.length - pos.ch != lastLen - lastPos.ch || pos.ch < startCh || cm.somethingSelected() )
        close();
      else
        once = setTimeout(function(){close(true); continued = true; startHinting();}, 70);
    }
    CodeMirror.signal(data, "select", completions[0], hints.firstChild);
    return true;
	// END cond document.getElementsByClassName('CodeMirror-hints').length
	}
  //END showHints(data)
  }
  return startHinting();
};
