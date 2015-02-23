(function($){
	$.jGET = function( str ){
		
		var search = (window.location.search).replace(/^\?/, '' ).split("&"),
			object = {},
			i;
		
		for( i in search ){
			
			var searchSplit = (search[i]).split("=");
			
			object[searchSplit[0]] = searchSplit[1];
		}
		
		if( str ){
			
			object = object[str];
		}
		
		return object;
	};
	
}($));