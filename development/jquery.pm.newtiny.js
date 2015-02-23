$(function(){
	$.widget("pm.newTiny",{
		"options":{
			"toolbar1":null,
			"toolbar2":null,
			"height":300
		},
		"_init":function(){
			
		},
		"_create":function(){
			
			$( this.element ).tinymce({
				"language":"es",
				"theme":"modern",
				"height":this.options.height,
				"plugins":"textcolor",
				"menubar":"edit format",
				"toolbar":["bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor"]
			});
		}
	});
});