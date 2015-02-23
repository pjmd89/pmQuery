$(function(){
	$.widget("pm.jtab",{
		"options":{
			"selectedClass":"selected",
			"deselectedClass":"deselected"
		},
		"_init":function(){
			
		},
		"_create":function(){
			
			var that = this;
			
			$("> div:nth-child(1) > ul > li",this.element).click(function(){
				
				$("> div > ul > li",that.element).addClass(that.options.deselectedClass);
				
				$("> div > ul > li",that.element).removeClass(that.options.selectedClass);
				
				$(this).removeClass(that.options.deselectedClass);
				
				$(this).addClass(that.options.selectedClass);
				
				$("> div:nth-child(2) > div",that.element).hide();
				
				$("> div:nth-child(2) > div[data-id='"+$(this).data("id")+"']",that.element).show();
			});
		}
	});
});