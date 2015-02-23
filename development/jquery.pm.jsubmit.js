$(function(){
	
	var _datasets = {
		"required":"required",
		"pattern":"pattern",
		"equals":"equals",
		"type":"type",
		"regexp":"regexp",
		"spanId":"spanId",
		"errorClass":"errorClass",
		"errorMessage":"errorMessage",
		"errorMessageMaxWidth":"errorMessageMaxWidth",
		"validationArray":"validationArray",
		"showErrorMessage":"showErrorMessage"
	};
	
	var _patterns = {
		"email":/\S+@\S+\.\S+/,
		"number":/^\d+$/,
		"date":/^\d{1,2}\/\d{1,2}\/\d{4}$/
	};
	
	$.widget("pm.jSubmit",{
		options:{
			"url":false,
			"addElemnt":{},
			"onChange":true,
			"showErrorMessage":true,
			"form":"",
			"eventShowErrorMessage":"click",
			"positionType":"offset",
			"spanErrorClass":"sct-control-error-label",
			"elementErrorClass":"sct-control-error",
			"callbackObject":null,
			"messages":{
				"required":"Este campo es requerido",
			},
			"datasets":{},
			"progress":function(){},
			"error":function(){},
			"success":function(){},
			"beforeSend":function(){}
		},
		"_destroy":function(){
			
			var elements = $("*[data-pm-submit='true']",$(this.options.form));
			
			elements.each(function(){
				
				$(this).unbind("click");
				
				$(this).unbind("blur");
				
				$(this).unbind("focus");
				
				$(this).unbind("change");
				
				$(this).unbind("keypress");
				
				$(this).unbind("keyup");
				
				$(this).unbind("keydown");
				
				$(this).unbind("validate");
				
				$(this).removeAttr("data-pm-submit");
			});
			
			$(this.element).unbind("click");
			
			delete elements;
			
			//delete this;
		},
		"_create":function(){
			
			//console.log(this.element);
			
			this._form = new FormData();
			
			this._newElements={};
			
			this._elements = {
				"validate":{
					"group":{
						"input":[]
					},
					"noGroup":{
						"input":[],
						"select":[],
						"textarea":[]
					}
				},
				"noValidate":{
					"group":{
						"input":[]
					},
					"noGroup":{
						"input":[],
						"select":[],
						"textarea":[]
					}
				}
			};
			
			var that = this;
			
			if(typeof this.options.datasets != "object"){
				
				this.options.datasets = {};
			}
			
			this.options.datasets = $.extend(_datasets,this.options.datasets);
			
			var _form = $(this.options.form);
			
			$("input,select,textarea",_form).each(function(){
				
				that._checkValidateElements(this);
			});
			
			$(_form).submit(function( e ){
				
				if (window.event){
					
			        e.cancelBubble = true;
			        
			        e.returnValue = false;
			    }
			    else if (e.stopPropagation){
			    	
			        e.stopPropagation();
			        
			        e.preventDefault();
			    }
				return false;
			});
			
			this._configureElements();
			
			this.addElement(this.options.addElemnt);
			
			$(this.element).bind( "click" , {"that":this} ,this._submit );
		},
		"setErrorMessage":function( control , message ){
			
			var span = $("#"+control, $(this.options.form)).data('spanId');
			
			if( $("#"+control, $(this.options.form)).length  = 1 ){
				
				if( message ){
					
					$('#'+span).html(message);
				}
				else{
					
					$('#'+span).html(this.options.messages.required);
				}
			}
		},
		"_configureElements":function(){
			
			var that = this;
			
			for(var i in that._elements.validate){
				
				switch (i) {
					
				case "group":
					
					for(var o in that._elements.validate.group.input){
						
						var id 			= "span_"+(Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000),
							name		= that._elements.validate.group.input[o],
							element		= $("input[name='"+name+"']");
							
						element = $(element.get(element.length - 1));
						
						that._setElement(id, name, element, that);
					}
					break;
					
				case "noGroup":
					
					for(var o in that._elements.validate.noGroup){
						
						for( var u in that._elements.validate.noGroup[o]){
							
							var id 			= "span_"+(Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000),
								name		= that._elements.validate[i][o][u],
								element		= $(o+"[name='"+name+"']");
							
							that._setElement(id, name, element, that);
						}
					}
					break;
				}
			}
		},
		"_setElement":function(id , name , element , that ){
			
			var elTop 		= element.offset().top,
				elLeft		= element.offset().left,
				whiteSpace	= "normal";
			
			if(that.options.positionType == "position"){
				
				elTop = element.position().top + (element.css("marginTop").replace("px","") * 1) ;
				
				elLeft = element.position().left;
				
				whiteSpace	= "pre";
			}
		
			var messageSpan	= $("<span />",{
				"id":id,
				"class": that.options.spanErrorClass,
				"css":{
					"position":"absolute",
					"opacity":"0",
					"display":"none",
					"z-index":"100",
					"transition":"opacity 0.2s linear",
					"max-width":($(element).data(that.options.datasets.errorMessageMaxWidth) || "auto" ),
					"top":elTop+"px",
					"white-space":whiteSpace,
					"left":( elLeft + element.outerWidth() + 10 )+"px",
				},
				"html": $(element).data(that.options.datasets.errorMessage) || that.options.messages.required
			});
			
			element.bind( "blur" , {"that":this} , this._setEventBlur );
			
			element.bind( "focus" , {"that":this} , this._setEventFocus );
			
			element.bind( "change" , {"that":this} , this._setEventChange );
			
			element.bind( "keyup" , {"that":this} , this._setEventKeyUp );
			
			element.bind( "keydown" , {"that":this} , this._setEventKeyDown );
			
			element.bind( "validate" , {"that":this} , this._validate );
			
			element.data(this.options.datasets.spanId, id );
			
			if( element.data(this.options.datasets.equals) ){
				
				element.bind( "paste" ,function(){
					
					return false;
				});
			}
			element.attr("data-pm-submit","true");
			
			element.parent().append(messageSpan);
		},
		"_setEventKeyDown":function( e ){
			
			var isReturn = true;
			
			if(typeof $(this).data("limit") == "number" && $(this).data("limit") > 0){
				
				if( ( ($(this).val()).length ) == $(this).data("limit") && e.keyCode != 8 ){
					
					isReturn = false;
				}
			}
			
			return isReturn;
		},
		"_setEventBlur":function( e ){
			
			var datasets 	= e.data.that.options.datasets,
				span		= $("#"+$(this).data( datasets.spanId ));
			
			span.css("opacity","0");
			
			setTimeout(function(){
				
				span.css("display","none");
			},200);
		},
		"_setEventFocus":function( e ){
			
			var datasets 	= e.data.that.options.datasets,
				span		= $("#"+$(this).data( datasets.spanId ));
			
			if($(this).trigger("validate").data("jSubmitValidate") == false ){
				
				span.css("display","inline");
				
				setTimeout(function(){
					
					span.css("opacity","1");
				},100);
				
			}
		},
		"_setEventChange":function( e ){
			
			var datasets 	= e.data.that.options.datasets,
				span		= $("#"+$(this).data( datasets.spanId ));
		
			if($(this).trigger("validate").data("jSubmitValidate") == false ){
				
				span.css("opacity","1");
			}
			else{
				span.css("opacity","0");
			}
		},
		"_setEventKeyUp":function( e ){
			
			var datasets 	= e.data.that.options.datasets,
				span		= $("#"+$(this).data( datasets.spanId ));
		
			if($(this).trigger("validate").data("jSubmitValidate") == false ){
				
				span.css("opacity","1");
			}
			else{
				span.css("opacity","0");
			}
			
			if(typeof $(this).data("limit") == "number" && $(this).data("limit") > 0){
				
				
				if(( ($(this).val()).length ) > $(this).data("limit")){
					
					$(this).val( ($(this).val()).substr(0, $(this).data("limit")) );
				}
			}
		},
		"_submit":function( e ){
			
			var that 	= e.data.that,
				success	= that._validateAllElements();
			
			if( that.options.url != false && that.options.url != "" && success == true){
				
				$.ajax({
					"url":that.options.url,
					"dataType":"json",
					"data":that._getAllElements(),
					"processData":false,
					"contentType":false,
					"type":"POST",
					"xhrFields":{
						onprogress:function(progress){
							
							if(progress.lengthComputable){
								
								var percentage = (progress.loaded / progress.total) * 100;
								
								if( that.options.callbackObject  &&
									typeof that.options.callbackObject[that.options.progress] == "function"){
									
									that.options.callbackObject[that.options.progress]( percentage );
									
								}
								else if(typeof that.options.progress == "function"){
									
									that.options.progress(percentage);
								}
							}
						}
					},
					"beforeSend":function( xhr , opts ){
						
						if( that.options.callbackObject && 
							typeof that.options.callbackObject[that.options.beforeSend] == "function" ){
							
							that.options.callbackObject[that.options.beforeSend]( xhr , opts );
						}
						else if(typeof that.options.beforeSend == "function" ){
							
							that.options.beforeSend( xhr , opts );
						}
						
					},
					"success":function( data ){
					
						if( that.options.callbackObject && 
							typeof that.options.callbackObject[that.options.success] == "function" ){
							
							that.options.callbackObject[that.options.success]( data );
						}
						else if(typeof that.options.success == "function" ){
							
							that.options.success( data );
						}
						
					}
				});
			}
			return false;
		},
		"_checkValidateElements":function( element ){
			
			var elementValidate		= "noValidate",
				elementGroup 		= "noGroup",
				elementName			= $(element).attr("name"),
				tagName				= (element.tagName).toLowerCase(),
				that 				= this;
			
			if( 
				tagName == "input" && 
				$(element).attr("type") == "radio" || 
				$(element).attr("type") == "checkbox"
			){
				var realElement = $("input[name='"+$(element).attr("name")+"']");
				
				elementGroup = "group";
				
				realElement.each(function(){
					
					if(
						$(this).data(that.options.datasets.required) == "isVisible" ||
						$(this).data(that.options.datasets.required) == "required" ||
						typeof $(this).data(that.options.datasets.pattern) != "undefined" ||
						typeof $(this).data(that.options.datasets.equals) != "undefined" ||
						typeof $(this).data(that.options.datasets.type) != "undefined" ||
						typeof $(this).data(that.options.datasets.validationArray) != "undefined"
					){
						
						elementValidate = "validate";
					}
				});
			}
			else{
				
				if(
					$(element).data(that.options.datasets.required) == "isVisible" ||
					$(element).data(that.options.datasets.required) == "required" ||
					typeof $(element).data(that.options.datasets.pattern) != "undefined" ||
					typeof $(element).data(that.options.datasets.equals) != "undefined" ||
					typeof $(element).data(that.options.datasets.type) != "undefined" ||
					typeof $(element).data(that.options.datasets.validationArray) != "undefined"
				){
					
					elementValidate = "validate";
				}
			}
			
			if(that._elements[elementValidate][elementGroup][tagName].indexOf(elementName) == -1 ){
				
				that._elements[elementValidate][elementGroup][tagName].push(elementName);
			}
			
		},
		"_validateAllElements":function(){
			
			var sendForm = true,
				elements = $("*[data-pm-submit='true']",$(this.options.form)),
				el 		 = false;
			
			elements.each(function(){
				
				if(!$(this).trigger("validate").data("jSubmitValidate")){
					
					sendForm = false;
					
					if(!el){
						
						el = $(this);
					}
				}
			});
			
			if( sendForm == false ){
				
				var move = $("body").scrollTop() > 0 ? $("body") : $("html");
				
				move.animate({scrollTop:Math.floor(el.offset().top) - 60},"slow");
			}
			
			return sendForm;
		},
		"setRegExp":function( control , regexp ){
			
			if( $("#"+control, $(this.options.form)).length  = 1 ){
				
				$("#"+control, $(this.options.form)).data(this.options.datasets.regexp,regexp);
			}
			
		},
		"_validate":function( e , isArray , arraySuccess ){
			
			var success = true,
				that	= e.data.that;
				me 		= $(this);
			
			if(typeof me.data(that.options.datasets.validationArray) !="undefined"){
				
				var arrayParentElements = (me.data(that.options.datasets.validationArray)).split(",");
				
				for(var e in arrayParentElements){
					
					if(!$("#"+arrayParentElements[e]).data("jSubmitArrayValidation")){
						
						$("#"+arrayParentElements[e]).data("jSubmitArrayValidation",arrayParentElements);
					}
				}
			}
			
			success =  that._validateArrays(me, isArray , success );
			
			if(
				typeof me.data(that.options.datasets.type) != "undefined" && 
				typeof _patterns[me.data(that.options.datasets.type)] != "undefined" && 
				(me.val()).trim() != ""
			){
				success = that._validatePattern( ((me.val()).trim()) , _patterns[me.data(that.options.datasets.type)] );
			}
			
			if(
				typeof me.data(that.options.datasets.regexp) != "undefined"
			){
				success = that._validatePattern( ((me.val()).trim()) , me.data(that.options.datasets.regexp) );
			}
			
			if(
				me.data(that.options.datasets.equals) != "undefined" && 
				$("#"+me.data(that.options.datasets.equals)).length > 0 &&
				(me.val()).trim() != ""
			){
				
				success = that._validateEquals(
					(me.val()).trim(),
					($("#"+me.data(that.options.datasets.equals)).val()).trim()
				);
			}
			
			if(me.data(that.options.datasets.required) == "required" && (me.val()).trim() == "" ){
				
				success = false;
			}
			
			if(me.data(that.options.datasets.required) == "isVisible" && (me.val()).trim() == "" && me.is(":visible")){
				
				success = false;
			}
			
			if( arraySuccess === false ){
				
				success = false;
			}
			
			if(me.data(that.options.datasets.required) == "isVisible" && !me.is(":visible")){
				
				success = true;
			}

			if( success ){
				
				me.removeClass( me.data(that.options.datasets.errorClass) );
				
				me.removeClass( that.options.elementErrorClass );
			}
			else{
			
				me.addClass( me.data(that.options.datasets.errorClass) || that.options.elementErrorClass);
			}
			
			$(this).data("jSubmitValidate",success);
		},
		"_validateArrays":function( me , isArray , arraySuccess ){
			
			var success = true;
			
			if(me.data("jSubmitArrayValidation")){
				
				var av 		= me.data("jSubmitArrayValidation"),
					avTrue	= new Array,
					avFalse	= new Array;
				
				for(var avI in av ){
					
					if( ($("#"+av[avI]).val()).trim() !="" ){
						
						avTrue.push(avI);
					}
					else{
						avFalse.push(avI);
					}
				}
				
				if( avFalse.length != av.length && avTrue.length != av.length){
					
					success = false;
				}
				
				if( typeof isArray == "undefined"){
					
					for(var avI in av ){
						
						$("#"+av[avI]).trigger("validate",[true,success]);
						
						if( success == false ){
						
							$("#"+av[avI]).trigger("validate",[true,success]);
						}
					}
				}
			}
			return success;
		},
		"_validateEquals":function( string1 , string2 ){
			
			var equals = true;
			
			if(string1 != string2 ){
			
				equals = false;
			}
			
			return equals;
		},
		"_validatePattern":function( string , pattern ){
			
			return pattern.test(string);
		},
		"showError":function(){
			
		},
		"_getAllElements":function(){
			
			var data = $(this.options.form).serializeArray();
			
			var form = new FormData();
			
			for(var i in this._newElements){
				
				form.append( i, this._newElements[i] );
			}
			
			for(var i in data ){
				
				form.append( data[i].name,  data[i].value );
			}
			
			return form;
		},
		"addElement":function( element ){
			
			for(i in element ){
				
				this._newElements[i] = (element[i]);
			}
		}
	} );
});
