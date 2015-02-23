$(function(){
	$.widget("pm.jmenu",{
		"options":{
			"activeClass":"sct-navbar-vertical-active",
			"tab":true,
			"tabClass":".sct-navbar-tab",
			"dataTarget":"data-target",
			"getTarget":"target",
			//callbacks
			"beforeChange":function(){},
			"afterChange":function(){}
		},
		"liAll":"",
		"response":false,
		"_create":function(){
			
			var that = this;
			
			$(["beforeChange","afterChange"]).each(function(){
				
				if(typeof that.options[this] != "function"){
					
					that.options[this] = function(){};
				}
			});
			
			this.liAll = $("ul li", this.element);
			
			this.liAll.bind("click",{"that":this},this.liClick);
			
			this.liAll.bind("beforeChange",{"that":this},this.options.beforeChange);
			
			this.liAll.bind("afterChange",{"that":this},this.options.afterChange);
		},
		"_init":function(){
			
			var target = $.jGET(this.options.getTarget),
			
				li = $("ul li["+this.options.dataTarget+"='"+target+"']",this.element);
			
			if( target && li.length > 0 ){
				
				li.trigger("click");
			}
		},
		"liClick":function( e ){
			
			var that = e.data.that;
			
			response = {
				"change":true	
			};
			
			$(this).trigger( "beforeChange" , response );
			
			if( response.change ){
				
				that.liAll.removeClass(that.options.activeClass);
				
				$(this).addClass(that.options.activeClass);
				
				if(that.options.tab == true){
					
					$(that.options.tabClass).hide();
					
					$("#"+$(this).attr(that.options.dataTarget)).show();
				}
			}
			
			$(this).trigger( "afterChange" , response.change );
		}
	});
});