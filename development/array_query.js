function arrayQuery( array ){
	
	this._array = array;
	
	this._position = 0;
	
	this.length =  array.length;
};

arrayQuery.prototype = {
	"_array":null,
	"_field":null,
	"_order":null,
	"length":null,
	"find":function( field , search ){
		
		var arr = [];
		
		var filter = function( value ){
			
			if( typeof value[field] == "string" && ( value[field]).toLowerCase().indexOf( search.toLowerCase() ) >= 0 ){
				
				arr.push(value);
			}
			else if(typeof value[field] == "number" && value[field] == search ){
				
				arr.push(value);
			}
		};
		
		this._array.filter( filter );
		
		return new arrayQuery( arr );
	},
	"_objectExists":function( haystack , needle ){
		
		var send = false;
		
		for( var i in haystack ){
			
			if(haystack[i] == needle){
				
				send = true;
			}
		}
		
		return send;
	},
	"findArray":function( search ){
		
		var arr = [];
		
		for( var i in this._array ){
			
			for(var o in this._array[i]){
				
				if(typeof this._array[i][o] == "string" && (this._array[i][o]).toLowerCase().indexOf(search.toLowerCase()) >=0 ){
					
					if( !this._objectExists( arr, this._array[i] ) ){
						
						arr.push(this._array[i]);
					}
				}
				else if(typeof this._array[i][o] == "number" && this._array[i][o] == search ){
					
					if( !this._objectExists( arr, this._array[i] ) ){
						
						arr.push(this._array[i]);
					}
				}
			}
		}
		
		return new arrayQuery( arr );
	},
	"get":function(){
		
		return this._array;
	},
	"slice":function( length , start ){
		
		start = (!start ? 0 : start);
		
		return new arrayQuery( this._array.slice( start , length ) );
	},
	"sort":function( field , order ){
		
		order = (!order ? 1 : order);
		
		var sort = {
			"generic":function(a,b){
				
				switch(order){
					case 1:
						
						return ( ( a[field] == b[field] ) ? 0 : ( ( a[field] > b[field] ) ? 1 : -1 ) );
						
						break;
					default:
						return ( ( a[field] == b[field] ) ? 0 : ( ( a[field] < b[field] ) ? 1 : -1 ) );
				}
			},
			"object":function(a,b){
				
			}
		};
		
		if( (this._array).length > 0 ){
			
			switch(typeof this._array[0][field]){
			
				case "string":
					
				case "number":
					
					this._array.sort( sort.generic );
					
					break;
			}
		}
		
		return this;
	}
};