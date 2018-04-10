// This varibale holds current set of markers and needs to be updated each time change happens to any markers
var anns;
var g;
var xmlhttp;
var markerWidth = 30;

// 
function setCurrentGraph(graph_var){
	g = graph_var;
}

function pointClickCallbackHandler(event, p) { 
	
	if( !ann_check.checked ){
		alert("Turn 'Show markers' on in order to add new ones");
		return;
	}
	if (p.annotation) {
	    var isUpdate = show_confirm("Update this marker?");
	    if( isUpdate == true){
	        xmlhttp=new XMLHttpRequest(); 
	        xmlhttp.open("GET", "UpdateMarker?x=" + p.xval + "&value=" + marker_code.value + "&comment=" + marker_comment.value + "&uri=" + marker_ind.value ,true);
	        xmlhttp.onreadystatechange = MarkerCallbackFunction;	
	        xmlhttp.send(null);
	        anns = g.annotations();
	        var index = getAnnotationIndex(anns, p.xval);
	        var tile = anns.splice(index);
	        tile = tile.splice(1);
	        g.setAnnotations(anns.concat(tile));
	        anns = g.annotations();

	        var ann = { series: p.name, xval: p.xval, shortText: marker_code.value, text: marker_comment.value, width: markerWidth}; 
	    	anns.push(ann);
	    	g.setAnnotations(anns);	        
	        return;
	    } 
	    else 
	    	return;
	}
	if(marker_code.value == ""){
		alert("Marker code empty");
		return;
	}
	var ann = { series: p.name, xval: p.xval, shortText: marker_code.value, text: marker_comment.value, width: markerWidth }; 
	anns = g.annotations(); 
	anns.push(ann);
	g.setAnnotations(anns); 
	xmlhttp=new XMLHttpRequest();	
	xmlhttp.open("GET", "AddMarker?x=" + p.xval + "&value=" + marker_code.value + "&comment=" + marker_comment.value + "&uri=" + marker_ind.value ,true);
	xmlhttp.onreadystatechange = MarkerCallbackFunction;	
	xmlhttp.send(null);
}

function annotationMouseOverHandler(ann, point, dg, event) { 
	//document.getElementById("marker_code").value = ann.shortText;
	//document.getElementById("marker_comment").value = ann.text;
}

function annotationClickHandler(ann, point, dg, event) { 
	document.getElementById("marker_code").value = ann.shortText;
	document.getElementById("marker_comment").value = ann.text;
}

function annotationDblClickHandler(ann, point, dg, event) {
	var isDelete = show_confirm("Delete this marker?");
	if( isDelete == true){
	    xmlhttp=new XMLHttpRequest(); 
	    xmlhttp.open("GET", "DeleteMarker?x=" + ann.xval + "&uri=" + marker_ind.value ,true); 
	    xmlhttp.onreadystatechange = MarkerCallbackFunction;	
	    xmlhttp.send(null); 
	    anns = g.annotations();
	    var index = getAnnotationIndex(anns, ann.xval);
	    var tile = anns.splice(index);
	    tile = tile.splice(1);
	    g.setAnnotations(anns.concat(tile));
	    anns = g.annotations();
	}
}

function show_confirm(text) 
{ 
	return confirm(text); 
}

function getAnnotationIndex(anns, xval) { 

	for (i=0; i<anns.length; i++) {
    if(anns[i].x == xval)
        return i;
	}
	
	return -1; 
}

function toggleAnnotations(graph_var, el) {
	g=graph_var;	
	if (el.checked) {
        g.setAnnotations(anns);
    } else {
        anns = g.annotations();
        g.setAnnotations([]);
    }
}

function toggleSerie(graph_var, el) {
	g=graph_var;
    g.setVisibility(parseInt(el.id), el.checked);
}

function xValueFormatterSample(x) { 
	return (x + " sec "); 
}

function MarkerCallbackFunction(){
	var result = xmlhttp.responseText;
	if(result != "")
		alert(result);
}