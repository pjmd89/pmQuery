$(function(){
	$.widget("pm.jalert",{
		"options":{
			"msg":""
		},
		"_init":function(){
			
		},
		"_create":function(){
			
			var that = this;
			
			$(this.element).html(function(){
				
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
				
				$(this).append(that.options.msg);
				
				$(this).append(bc);
			});
			
			$(this.element).dialog();
		}
	});
});