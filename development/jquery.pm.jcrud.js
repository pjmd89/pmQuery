$(function(){
	$.widget("pm.jcrud",{
		"options":{
			"urlCreate":"",
			"urlRead":"",
			"urlUpdate":"",
			"urlDelete":"",
			"table":"",
			"dataTable":[],
			"classDeleteButton":"sct-button sct-button-red",
			"classModifyButton":"sct-button sct-button-blue",
			"modifyButtonText":"Modificar",
			"deleteButtonText":"Eliminar",
			"tiny":[],
			"inputs":{},
			"form":"",
			"functions":true,
			"lang":"es",
			"cleanForm":true,
			"disableButtons":false,
			"successMessage":"",
			"errorMessage":"",
			"updateMessage":"",
			"ifDeleteMessage":"",
			"deleteMessage":"",
			//callbacks
			"submitProgress":function(){return true;},
			"submitError":function(){return true;},
			"submitSuccess":function(){return true;},
			"submitBeforeSend":function(){return true;}
		},
		"_init":function(){
			
			var that = this;
			
			this.setModify = false;
			
			$([
			   "submitProgress",
			   "submitError",
			   "submitSuccess",
			   "submitBeforeSend"
			]).each(function(i,a){
				
				
				if( typeof that.options[a] != "function" ){
					
					that.options[a] = function(){return true;};
				}
			});
			
			$(this.options.tiny).each(function(i,a){
				
				that._setTiny(a);
			});
			
			this._setJSubmit();
			
			if(this.options.functions == true){
				
				$("."+this.options.table+"_modify").bind("click",{"jcrud":this},this._clickModidy);
				
				$("."+this.options.table+"_delete").bind("click",{"jcrud":this},this._clickDelete);
			}
			
		},
		"_create":function(){
		
			
			
		},
		"_clearForm":function(){
			
			$("select,textarea",this.options.form).val("");
			
			$("input",this.options.form).each(function(){
				
				var type = $(this).attr("type");
				
				if(type == "radio" || type == "checkbox"){
					
					$(this).removeAttr("checked");
				}
				else{
					
					$(this).val("");
				}
			});
		},
		"_clickModidy":function( e ){
			
			var jcrud = e.data.jcrud,
				id	  = $(this).data("id");
			
			jcrud._setModify( this );
			
			$.ajax({
				"url":jcrud.options.urlRead,
				"data":"&id="+id,
				"type":"POST",
				"success":function( data ){
					
					for( var input in jcrud.options.inputs ){
						
						var el = $("."+input,jcrud.options.form);
						
						if(el.length == 1){
							
							$("."+input,jcrud.options.form).val( data[jcrud.options.inputs[input]] );
						}
						else if(el.length > 1 ){
							
							$(el).attr("checked",false);
							
							el.each(function(){
								
								if( $(this).val() == data[jcrud.options.inputs[input]]){
									
									$(this).trigger("click");
									
								}
							});
						}
						else{
							var o = {};
							
							o[input] = data[jcrud.options.inputs[input]];
							
							jcrud.jsubmitModify.jSubmit("addElement",o);
						}
					}
				}
			});
		},
		"_clickDelete":function( e ){
			
			var jcrud = e.data.jcrud,
				id	  = $(this).data("id"),
				tr = $(this).parent().parent(),
				tbody = tr.parent(); 
			
			$("<div/>",{
				"html":function(){
					
					var that = this;
					
					var buttonContainer = $("<div/>",{
    					"class":"sct-control-button-right"
    				});
    				
    				var noButton = $("<div/>",{
    					"class":"sct-button sct-button-blue",
    					"html":"No",
    					"click":function(){
    						$(that).dialog("close");
    					}
    				});
    				
    				var yesButton = $("<div/>",{
    					"class":"sct-button sct-button-red",
    					"html":"Sí",
    					"click":function(){
    						
    						$.ajax({
    							"url":jcrud.options.urlDelete,
    							"data":"&id="+id,
    							"type":"POST",
    							"success":function( data ){
    								
    								if( data["delete"] ){
    									
    									jcrud._clearForm();
    									
    									if(jcrud.setModify == true){
    										
    										jcrud._unsetModify();
    									}
    									
    									tr.remove();
    									
    									$(that).dialog("close");
    									
    									$("<div/>",{
    										"html":function(){
    											
    											var me = this;
    											var bc = $("<div/>",{
    						    					"class":"sct-control-button-right"
    						    				});
    											
    											var button = $("<div/>",{
    						    					"class":"sct-button sct-button-blue",
    						    					"html":"Cerrar",
    						    					"click":function(){
    						    						$(me).dialog("close");
    						    					}
    						    				});
    											
    											bc.append(button);
    						    				
    											$(this).append(jcrud.options.deleteMessage);
    											
    						    				$(this).append(bc);
    						    				
    						    				if(tbody.children().length == 0){
    						    					
    						    					tbody.append(data.noResults);
    						    				}
    										}
    									}).dialog();
    								}
    							}
    						});
    					}
    				});
    				
    				buttonContainer.append(noButton);
    				
    				buttonContainer.append(yesButton);
    				
    				$(this).append(jcrud.options.ifDeleteMessage);
    				
    				$(this).append(buttonContainer);
				}
			}).dialog();
		},
		"_setDataTable":function( data , replace ){
			
			
			var tbody 		 = $("#"+this.options.table+" tbody"),
				tr			 = $("<tr/>");
			
			for(var row in this.options.showInTable){
				
				tr.append( "<td>"+data[this.options.showInTable[row]]+"</td>" );
			}
			
			if( this.options.functions == true ){
				
				var tdFunc = "<td><div data-id='"+data.id+"' class='"+this.options.table+
					"_modify "+this.options.classModifyButton+"'>Modificar</div>\n"+
					"<div data-id='"+data.id+"' class='"+this.options.table+"_delete "+
					this.options.classDeleteButton+"'>Eliminar</div></td>";
				
				tr.append( tdFunc );
				
				/*
				 * 
				 * decidir por fin como va esto

				 if( replace && replace.length > 0 ){
				
					replace.replaceWith( tr );
				}
				else{
					tbody.append( tr );
				}
				
				*/
				
				$("."+this.options.table+"_modify").unbind("click");
				
				$("."+this.options.table+"_delete").unbind("click");
				
				$("."+this.options.table+"_modify").bind("click",{"jcrud":this},this._clickModidy);
				
				$("."+this.options.table+"_delete").bind("click",{"jcrud":this},this._clickDelete);
			}
			
			// decidir por fin donde va esto
			
			if( replace && replace.length > 0 ){
				
				replace.replaceWith( tr );
			}
			else{
				tbody.append( tr );
			}
			
			if($("#"+this.options.table+"_null").length > 0){
				
				$("#"+this.options.table+"_null").remove();
			}
		},
		"_setModify":function( button ){
			
			var jcrud = this;
			
			if(jcrud.setModify == false){
				
				jcrud.jsubmit.jSubmit("destroy");
				
				jcrud.jsubmit.hide();
			}
			else{
				
				jcrud._unsetModify( true );
			}
			
			jcrud.setModify = true;
			
			jcrud.back = $("<div />",{
				"class":"sct-button",
				"html":"Regresar",
				"click":function(){
					
					jcrud._clearForm();
					
					jcrud._unsetModify();
				}
			});
			jcrud.jsubmitModify = $("<div/>",{
				"html":"Modificar",
				"class":jcrud.options.classModifyButton
			}).jSubmit({
				"form":jcrud.options.form,
				"url":jcrud.options.urlUpdate,
				"success":function( data ){
					
					if(button){
						
						$(button).parent().parent().append();
						
						jcrud._setDataTable(data , $(button).parent().parent());
					}
					
					jcrud._clearForm();
					
					jcrud._unsetModify();
					
					$("<div/>",{
						"html":function(){
							
							var me = this;
							
							var bc = $("<div/>",{
		    					"class":"sct-control-button-right"
		    				});
							
							var button = $("<div/>",{
		    					"class":"sct-button sct-button-blue",
		    					"html":"Cerrar",
		    					"click":function(){
		    						$(me).dialog("close");
		    					}
		    				});
							
							bc.append(button);
		    				
							$(this).append(jcrud.options.updateMessage);
							
		    				$(this).append(bc);
						}
					}).dialog();
				}
			});
			
			var buttonContent = jcrud.jsubmit.parent();
			
			buttonContent.append(jcrud.back);
			buttonContent.append(jcrud.jsubmitModify);
		},
		"_unsetModify":function( noJSubmit ){
			
			var jcrud = this;
			
			jcrud.setModify = false;
			
			$(jcrud.jsubmitModify).jSubmit("destroy");
			
			$(jcrud.jsubmitModify).remove();
			
			if(!jcrud.jsubmit.is(":visible") && !noJSubmit ){
				
				jcrud.jsubmit.show();
				
				jcrud._setJSubmit();
			}
			jcrud.back.unbind("click");
			
			jcrud.back.remove();
			
		},
		"_setJSubmit":function(){
			
			var jcrud = this;
			
			this.jsubmit = $(jcrud.element).jSubmit({
				"form":jcrud.options.form,
				"url":jcrud.options.urlCreate,
				"error":function(){
					
					if(jcrud.options.submitError()){
						
					}
				},
				"beforeSend":function( xhr , opts ){
					
					if(jcrud.options.submitBeforeSend( xhr , opts )){
						
					}
				},
				"success":function( data ){
					
					if(jcrud.options.submitSuccess( data )){
						
						if( jcrud.options.cleanForm ){

							jcrud._clearForm();
						}
						
						jcrud._setDataTable( data );
						
						$("<div/>",{
							"html":function(){
								
								var me = this;
								
								var bc = $("<div/>",{
			    					"class":"sct-control-button-right"
			    				});
								
								var button = $("<div/>",{
			    					"class":"sct-button sct-button-blue",
			    					"html":"Cerrar",
			    					"click":function(){
			    						$(me).dialog("close");
			    					}
			    				});
								
								bc.append(button);
			    				
								$(this).append(jcrud.options.successMessage);
								
			    				$(this).append(bc);
							}
						}).dialog();
					}
				}
			});
		},
		"_setTiny":function( element ){
			
			$( element ).newTiny();
		}
	});
});