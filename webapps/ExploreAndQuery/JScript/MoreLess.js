function replaceAll(find, replace, str) 
 {
      while( str.indexOf(find) > -1)
      {
        str = str.replace(find, replace);
      }
      return str;
}

$(document).ready(function() {
    var showChar = 99;
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";
    $('.more').each(function() {
        var content = $(this).html();
		
        if(content.length > showChar) {
		
			// The string may contain page breaks <br> and those mess up the html if divided between show/hide parts
			if(content.substr(showChar - 4, 4).indexOf('<') > -1)
				showChar += 4;
			
            var c = content.substr(0, showChar -1);
            var h = content.substr(showChar-1, content.length - showChar + 1);
			var regex = new RegExp('<br>', 'g');
            var html = c + '<span>' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
	        $(this).html(html);
        }
 
    });
 
    $(".morelink").click(function(){
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
	
});