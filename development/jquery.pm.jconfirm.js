$(function(){
	$.widget("pm.jconfirm",{
		"options":{
			"msg":"",
			"yesClick":function(){},
			"noClick":function(){}
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
				
				var yesButton = $("<div/>",{
					"class":"sct-button sct-button-green",
					"html":"Si",
					"click":function(){
						that.options.yesClick();
						$(me).dialog("close");
					}
				});
				
				var noButton = $("<div/>",{
					"class":"sct-button sct-button-blue",
					"html":"No",
					"click":function(){
						that.options.noClick();
						$(me).dialog("close");
					}
				});
				
				bc.append(noButton);
				
				bc.append(yesButton);
				
				$(this).append(that.options.msg);
				
				$(this).append(bc);
			});
			
			$(this.element).dialog();
		}
	});
});