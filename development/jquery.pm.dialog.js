$(function(){
	
	$.widget("pm.dialog",{
		
		options:{
			"modal":true,
			"buttons":{},
			"close":{}
		},
		"_modalId":"",
		_create:function(){
			
			this._modalId = "_modalId_"+(Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000);
			
			this._modal = $("<div />",{
				"id":this._modalId,
				"class":"sct-modal",
				"style":"opacity:0;filter:alpha=0;"
			});
			
			this._modal.attr("tabindex","0");
			
			this._dialog = $("<div />",{
				"class":"sct-dialog"
			});
			
			if(this.options.modal == true ){
				
				var modalBackground = $("<div />",{
					"class":"sct-modal-background"
				});
			
				this._modal.append(modalBackground);
			}
			this._modal.append(this._dialog);
			
			this._dialog.append(this.element);
			
			$(document.body).append(this._modal);
			
			this.setSize(this._dialog);
			
			$("#"+this._modalId).bind("keyup",{"that":this},this.closeOnEscape);

			$(window).bind("resize",{"that":this},this.windowResize);
			
			var that = this;
			
			setTimeout(function(){
				
				that._modal.removeAttr("style");
			},300);
			
		},
		"closeOnEscape":function(k){
			
			if( k.keyCode == 27 ){
				
				k.data.that.close();
			}
		},
		_setOptions:function(){
			
			//console.log( arguments );
		},
		_setOption:function( key , value ){
			
			//console.log( arguments );
		},
		"close":function(){
			
			$("#"+this._modalId).attr("style","opacity:0;filter:alpha=0;");
			
			var me = this;
			
			setTimeout(function(){

				if(typeof me.options.close == "function"){
					
					me.options.close();
				}
				
				$("#"+me._modalId).remove();
				
			},300);
		},
		"windowResize":function( event ){
			
			event.data.that.setSize(event.data.that._dialog);
		},
		"setSize":function(me){
			
			var width			= me.width(),
				height			= me.height(),
				windowWidth		= $(window).width(),
				windowHeight	= $(window).height(),
				left			= (windowWidth / 2) - (width / 2),
				top 			= (windowHeight / 2 ) - (height / 2) - 70;
			
			me.css("left",left+"px");
			me.css("top",top+"px");
			
		}
	});
});