$(function(){
	$.widget("pm.jdtable",{
		"options":{
			"url":"",
			"data":[],
			"trDataId":null,
			"startOnInit":false,
			"searchInputId":"pm-search",
			"nextControlId":"pm-next",
			"prevControlId":"pm-prev",
			"limitControlId":"pm-limit",
			"fieldControlId":"pm-field",
			"labelId":"pm-label",
			"callbackObject":null,
			"limit":10,
			"nullMessage":"No se han encontrado registros.",
			"fields":[],
			"notReadyAlertMessage":"Por favor, espere mientras se cargan los datos.",
			"sort":null,
			"functions":false,
			"functionsBTN":{
				"dataIdField":"",
				"modifyClass":"sct-button sct-button-blue",
				"modifyText":"Modificar",
				"modifyClick":function(){},
				"deleteClass":"sct-button sct-button-red",
				"deleteText":"Eliminar",
				"deleteClick":function(){}
			},
			"defaultAlert":true,
			//callbacks
			"filter":function(){},
			"refillStart":function(){},
			"refillEnd":function(){},
			"alert":function(){}
		},
		"label":null,
		"input":null,
		"next":null,
		"prev":null,
		"aQ":null,
		"aQA":null,
		"aQC":null,
		"limitSelect":null,
		"fieldSelect":null,
		"tbody":null,
		"ready":false,
		"currentSort":null,
		"sliceStart":0,
		"sliceEnd":0,
		"slicePage":0,
		"_create":function(){
			
			var that = this;

			$(["filter","refillStart","refillEnd","alert"]).each(function(){
				
				if(typeof that.options[this] !== "function"){
					
					that.options[this] = function(){};
				}
			});
			
			if(typeof this.options.fields != "object"){
				
				this.options.fields = [];
			}
			
			this.label = $("#"+this.options.labelId,this.element);
			
			this.input = $("#"+this.options.searchInputId,this.element);
			
			this.next = $("#"+this.options.nextControlId,this.element);
			
			this.prev = $("#"+this.options.prevControlId,this.element);
			
			this.limitSelect = $("#"+this.options.limitControlId,this.element);
			
			this.fieldSelect = $("#"+this.options.fieldControlId,this.element);
			
			this.tbody = ($("tbody",this.element).length > 0 ? $("tbody",this.element) : $(this.element));
			
			this.thead = $("thead",this.element);
			
			this.currentSort = this.options.sort;
			
			this.sliceEnd = this.options.limit;
			
		},
		"_init":function(){
			
			this.input.bind( "keyup" , { "that":this } , this._search );
			
			this.next.bind("click" , { "that":this } , this._nextClick );
			
			this.prev.bind("click" , { "that":this } , this._prevClick );
			
			this.limitSelect.bind("change" , { "that":this } , this._limit );
			
			this.fieldSelect.bind("change" , { "that":this } , this._fieldChange );
			
			this._ajax();
		},
		"_fieldChange":function( e ){
			
			var that = e.data.that;
			
			that.input.trigger("keyup");
		},
		"_prevClick":function( e ){
			
			var that = e.data.that;
			
			if( that.ready ){
				
				if(that.sliceStart > 0){
					
					that._tableRefill( that.aQC , -1 );
				}
			}
			else{
				
				that.alert(that.options.notReadyAlertMessage);
			}
			
		},
		"_nextClick":function( e ){
			
			var that = e.data.that;
			
			if( that.ready ){
				
				if(that.sliceEnd < that.aQC.length){
					
					that._tableRefill( that.aQC , 1 );
				}
			}
			else{
				
				that.alert(that.options.notReadyAlertMessage);
			}
		},
		"_search":function( e ){
			
			var that = e.data.that;
			
			var aF = null;
			
			if( that.ready ){
				
				if( ($(this).val()).trim() != ""  ){
					
					if( that.fieldSelect.length > 0 && that.fieldSelect.val() !="" ){
						
						aF = that.aQ.find( that.fieldSelect.val() , $(this).val() );
					}
					else{
						
						aF = that.aQ.findArray( $(this).val() );
					}
					
					
					that._tableRefill( aF , 0 );
					
				}
				else{
					
					that._tableRefill( that.aQ , 0 );
				}
			}
			else{
				
				that.alert(that.options.notReadyAlertMessage);
			}
		},
		"_calculeSlice":function( ){
			
			this.sliceStart = 0;
			
			this.sliceEnd = 0;
			
			if( this.aQC.length > 0 ){
				
				this.sliceStart = (this.options.limit * this.slicePage );
				
				if(this.sliceStart  > this.aQC.length){
					
					this.sliceStart = 0;
				}

				this.sliceEnd = ( ( this.sliceStart ) *1 ) + ( ( this.options.limit ) * 1 );
				
				if(this.sliceEnd > this.aQC.length){
					
					this.sliceEnd = this.aQC.length;
				}
			}
		},
		"_tableRefill":function( data , page  ){
			
			var that = this;
			
			that.options.refillStart();
			
			that.aQC = data;
			
			that.slicePage += page;
			
			that._calculeSlice();
			
			that.tbody.html("");
			
			if(that.currentSort){
				
				data = data.sort( that.currentSort );
			}
			
			data = data.slice( that.sliceEnd , that.sliceStart );
			
			if( data.length > 0 ){
				
				if(that.options.customRefill && typeof that.options.customRefill == "function"){
					
					$( data.get() ).each(function(){
						
						var tr = "<tr>";
						
						tr += that.options.customRefill(this);
						
						tr +="</tr>";

						that.tbody.append(tr);
						
					});
				}
				else{
					$( data.get() ).each(function(){
						
						var tr = $("<tr />");
						
						for(var i in that.options.fields){
							
							tr.append("<td>"+this[that.options.fields[i]]+"</td>");
						}
						
						if( that.options.functions === true ){
							
							var modifyButton = $("<div />",{
								"data-id":( that.options.functionsBTN.dataIdField != "" ? this[that.options.functionsBTN.dataIdField]: ""),
								"class":"jdtable-modify "+that.options.functionsBTN.modifyClass,
								"html":that.options.functionsBTN.modifyText
							});
							
							modifyButton.data("field",this);
							
							var deleteButton = $("<div />",{
								"data-id":( that.options.functionsBTN.dataIdField != "" ? this[that.options.functionsBTN.dataIdField]: ""),
								"class":"jdtable-delete "+that.options.functionsBTN.deleteClass,
								"html":that.options.functionsBTN.deleteText
							});
							
							deleteButton.data("field",this);
							
							tr.append(modifyButton);
							
							tr.append(deleteButton);
						}
						
						that.tbody.append(tr);
					});
				}
			}
			else{
				
				var colspanLength = (that.options.fields).length;
				
				if( that.options.functions ){
					
					++colspanLength;
				}
				if( !(that.options.fields).length ){
					
					colspanLength = $("th",that.thead).length; 
				}
				
				that.tbody.html("<tr><td colspan='"+colspanLength+"'>"+that.options.nullMessage+"</td></tr>");
			}
			
			var start = ( that.aQC.length == 0 ? 0 : ( that.sliceStart + 1 ) );
			
			that.label.html("Mostrando desde "+(start)+" hasta "+that.sliceEnd+" de "+that.aQC.length+" registros");
			
			
			that.setFunctions();
			
			that.options.refillEnd();
		},
		"setFunctions":function(){
			
			var modify  = $(".jdtable-modify",this.element),
				del		= $(".jdtable-delete",this.element);
			
			if( modify.length > 0 ){
				
				modify.bind("click",{"that":this},this.modifyButtonClick);
			}
			
			if( del.length > 0 ){
				
				del.bind("click",{"that":this},this.deleteButtonClick);
			}
			
		},
		"modifyButtonClick":function( e ){
			
			var that = e.data.that;
			
			if(that.options.callbackObject && 
				typeof that.options.callbackObject[that.options.functionsBTN.modifyClick] == "function" ){
				
				that.options.callbackObject[that.options.functionsBTN.modifyClick]( $(this).data( "field" ) );
			}
			else if(typeof that.options.functionsBTN.modifyClick == "function"){
				
				that.options.functionsBTN.modifyClick( $(this).data( "field" ) );
			}
		},
		"deleteButtonClick":function( e ){
			
			var that = e.data.that;
			
			if(that.options.callbackObject && 
					typeof that.options.callbackObject[that.options.functionsBTN.deleteClick] == "function" ){
					
					that.options.callbackObject[that.options.functionsBTN.deleteClick]( $(this).data( "field" ) );
				}
				else if(typeof that.options.functionsBTN.deleteClick == "function"){
					
					that.options.functionsBTN.deleteClick( $(this).data( "field" ) );
				}
		},
		"reload":function( func ){
			
			var ready = false;
			
			if( this.ready ){
				
				if(typeof func == "function"){
					
					this.aQ = func( this.aQA );
					
					if( !this.aQ ){
						
						this.aQ = this.aQA;
					}
				}
				
				this.input.val("");
				
				this.input.trigger("keyup");
				
				ready = true;
			}
			else{
				
				this.alert(this.options.notReadyAlertMessage);
			}
			
			return ready;
		},
		"_limit":function( e ){
			
			var that = e.data.that;
			
			that.options.limit = $(this).val();
			
			that.input.trigger("keyup");
		},
		"refresh":function(){
			
			this.input.val("");
			
			this.options.startOnInit = true;
			
			this.ready = false;
			
			this._ajax();
		},
		"alert":function(message){
			
			if(this.options.defaultAlert){
				
				$("<div/>",{
					"html":message
				}).jalert();
			}
			else{
				
				this.options.alert( message );
			}
			
		},
		"_ajax":function(){
			
			var that = this;
			
			if(that.options.url != ""){
				$.ajax({
					"url":that.options.url,
					"success":function( data ){
						
						that._setArray( data );
					}
				});
			}
			else{
				
				that._setArray( that.options.data );
			}
		},
		"_setArray":function( data ){
			
			var that = this;
			
			that.aQA = new arrayQuery(data);
			
			that.aQ = that.options.filter( that.aQA );
			
			if( !that.aQ ){
				
				that.aQ = that.aQA;
			}
			that.aQC = that.aQ;
			
			that.ready = true;
			
			if( that.options.startOnInit ){
				
				that.input.trigger("keyup");
			}
		}
	});
});