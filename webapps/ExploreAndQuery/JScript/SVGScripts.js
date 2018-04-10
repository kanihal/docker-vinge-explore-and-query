var start=null;
var startobj=null;
var end=null;

var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

function startPath(evt)
{
   if(startobj != null)
	startobj.setAttribute("fill", "white");

   startobj=evt.target;
	
   evt.target.setAttribute("fill", "lightgreen");
   var ref = evt.target.parentNode.getAttribute("xlink:href");
   var temp = ref.split("?uri=");
   start = temp[1];

   /*
   currentX = evt.clientX;
   currentY = evt.clientY;
   currentMatrix = startobj.getAttributeNS(null, "transform").slice(7,-1).split(' ');
    
   for(var i=0; i<currentMatrix.length; i++) {
		currentMatrix[i] = parseFloat(currentMatrix[i]);
   }
   */

    //startobj.setAttributeNS(null, "onmousemove", "moveElement(evt)");
	//startobj.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
	//startobj.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
	
   return false;
}

function findPath(evt)
{
    if(startobj != null && startobj != evt.target) {	
		var ref = evt.target.parentNode.getAttribute("xlink:href");
		var temp = ref.split("?uri=");
		end = temp[1];
		var nexturl = location.hash + "/SemDW/select/navpathgen?start=" + start + "&target=" + end;
		//window.alert(nexturl);
		start = null;
		//startobj=null;
		window.location = nexturl; 		
		return false;
   }
   return false;
}	

function moveElement(evt){

  dx = evt.clientX - currentX;
  dy = evt.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;
  newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
            
  startobj.setAttributeNS(null, "transform", newMatrix);
  currentX = evt.clientX;
  currentY = evt.clientY;
}

function deselectElement(evt) {
	if(startobj != 0){
		//window.alert("des");
		startobj = 0;
		startobj.removeAttributeNS(null, "onmousemove");
		//startobj.removeAttributeNS(null, "onmouseout");
		startobj.removeAttributeNS(null, "onmouseup");
		
	}
}
