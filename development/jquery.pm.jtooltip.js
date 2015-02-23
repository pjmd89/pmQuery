$(function(){
	$.widget("pm.jtooltip",{
		"options":{
			"html":"",
			//callbacks
			"enter":function(){},
			"leave":function(){},
		},
		"tooltip":"",
		"_init":function(){
			
			var that = this;
			
			$(that.element).bind("mouseenter",{"that":that},that._enter);
			
			$(that.element).bind("mouseleave",{"that":that},that._leave);
			
			$(that.element).bind("enter",that.options.enter);
			
			$(that.element).bind("leave",that.options.leave);
			
			that.tooltip.html(that.options.html);
		},
		"_create":function(){
			
			var that = this;
			
			var callbacks = [
				"enter",
				"leave"
			];
			
			$(callbacks).each(function( i , a ){
				
				if(typeof that.options[this] != "function"){
					
					that.options[this] = function(){};
				}
			});
			
			$(this.element).attr("data-pm-jtooltip","true");
			
			this.tooltip = $("<div/>",{
				"class":"sct-dialog sct-tooltip pm-jtooltip",
				"style":"position:fixed;"
			});
			
			$(this.tooltip).hide();
			
			$("body").append(this.tooltip);
		},
		"html":function(html){
			
			this.tooltip.html(html);
		},
		"_enter":function( e ){
			
			var that = e.data.that;
			
			$(that.element).trigger("enter");
					
			$(that.tooltip)
				.css("left",($(this).offset().left - $(window).scrollLeft())+"px")
				.css("top",($(this).offset().top - $(window).scrollTop() + 20)+"px")
				.show();
		},
		"_leave":function( e ){
			
			var that = e.data.that;
			
			$(that.element).trigger("leave");
			
			$(that.tooltip).hide();
		},
		"_destroy":function(){
			
			$(this.element).removeAttr("data-pm-jtooltip");
			
			$(this.element).unbind("mouseenter");
			
			$(this.element).unbind("mouseleave");
			
			$(this.element).unbind("enter");
			
			$(this.element).unbind("leave");
			
			$(this.tooltip).remove();
		},
		"destroyAll":function(){
			
			var tooltips = $(".pm-jtooltip");
			
			var allElements = $("*[data-pm-jtooltip='true']");
			
			if(tooltips.length > 0 ){
				
				$(tooltips).each(function(){
					
					$(this).remove();
				});
			}
			
			if(allElements.length > 0 ){
				
				$(allElements).each(function(){
					
					$(this).jtooltip("destroy");
				});
			}
		}
	});
});