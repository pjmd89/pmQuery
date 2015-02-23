$(function(){
	
	$.widget("pm.getStates",{
		
		options:{
			"stateSelect":""
		},
		_create:function(){
			
			var stateSelect = this.options.stateSelect;
			
			$(this.element).change(function(){
			
				if($(this).val()){
					
					$.ajax({
						"url":"?controller=get_states&country="+$(this).val(),
						"dataType":"json",
						"success":function( data ){
							
							var options = "<option>Seleccione un estado</option>";
							
							for( row in data){
								
								options+="<option value='"+data[row].value+"'>"+data[row].label+"</option>";
							}
							
							$(stateSelect).html(options);
						}
					});
				}
				else{
					
					var options = "<option>Seleccione un país</option>";
					
					$(stateSelect).html(options);
				}
				
			});
		}
	});
});