$(function(){
	
	$.widget("pm.countLimit",{
		
		options:{
			"inputLimit":"default",
			"limit":600
		},
		_create:function(){
			
			var tagName 		=	($(this.element).prop("tagName")).toLowerCase(),
				characterCount 	=	0,
				elementType 	=	0,
				characters		=	"",
				me 				= 	this;
			
			if(tagName != "input" && tagName != "textarea" ){
				
				elementType = "text";
			}
			else{
				
				elementType = "val";
			}
			
			$(this.element).keypress(function(k){
				
				var returned = true;
				
				if(k.keyCode != 8 ){					
					
					characterCount = $(this)[elementType]().length;
					
					if(characterCount >= (me.options.limit + 1)){
						
						characters = $(this)[elementType]().substring(0,me.options.limit);
						
						$(this)[elementType](characters);
						
						returned = false;
					}
				}
				return returned;
			});
			
			this.setInputLimit( this.element , this.options.limit , 0 , this.options.inputLimit);
			
			$(this.element).bind("keydown",
				{
					"el":this.element,
					"elementType":elementType,
					"me":me
				},
				this.keypress
			);
			
			$(this.element).bind("keyup",
				{
					"el":this.element,
					"elementType":elementType,
					"me":me
				},
				this.keypress
			);
		},
		"keypress":function(k){
			
			var returned	 	=	true,
				characterCount 	=	0,
				inputLimit		= 	k.data.me.options.inputLimit,
				el				=	k.data.el,
				elementType		=	k.data.elementType,
				limit			=	k.data.me.options.limit,
				setInputLimit	=	k.data.me.setInputLimit,
				characters		=	"";
			
			characterCount = $(el)[elementType]().length;
			
			if(k.keyCode != 8 ){					
				
				if(characterCount >= (limit + 1)){
					
					characters = $(el)[elementType]().substring(0,limit);
					
					$(el)[elementType](characters);
					
					returned = false;
				}
			}
			
			setInputLimit( el , limit , characterCount , inputLimit );
			
			return returned;
		},
		"setInputLimit":function( el , limit , characterCount , inputLimit ){
			
			var input = $("#"+$(el).attr("id")+"_count_limit");
			
			var count = limit - characterCount;
			
			if(inputLimit != "default"){
				
				input = $(inputLimit);
			}
			
			if(input.length > 0 ){
				
				if(count < 0 ){
					
					count = 0;
				}
				input.val( count );
			}
		}
	});
});