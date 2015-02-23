$(function(){
	
	$.widget("pm.imageToBlob",{
		
		options:{
			"label":null,
			"accept":"image/jpeg, image/jpg, image/png",
			"name":"picture",
			"imageMessage":"Sombree la imagen para seleccionar el fragmento de ésta que será mostrado en tu perfil.",
			"close":"",
			"save":"",
			"labelText":"No ha seleccionado ninguna imagen",
			"defaultImage":"usr/themes/cpf/img/cpf-user.png",
			"success":"",
			"destImage":"",
			"draggable":false,
			"closeButtonClass":"sct-button sct-button-blue cpf-image-edit-button",
			"saveButtonClass":"sct-button sct-button-green cpf-image-edit-button",
			"closeButtonLabel":"Cerrar",
			"saveButtonLabel":"Guardar",
			"width":110,
			"height":146,
			"maxHeight":300
		},
		"positionImage":{
			"position":{
				"left":0,
				"top":0,
				"width":0,
				"height":0
			}
		},
		_create:function(){
			
			this._file = $("<input />",{
				"type":"file",
				"style":"display:none;",
				"name":"tmp_"+this.options.name,
				"accept":this.options.accept
			});
			
			$(this.element).parent().append(this._file);
			
			this.positionImage.position.width = this.options.width;
			
			this.positionImage.position.height = this.options.height;
			$(this._file).bind(
				"change",
				{
					that:this
				},
				this.loadImage
			);
		},
		_init:function(){
			
			var that = this;
			
			$(this.element).click(function(){
				
				that.openDialog();
			});
		},
		loadImage:function( event ){
			
			var image = new FileReader();
			
			event.data.that._fileName = event.target.files[0].name;
			
			image.onload = (event.data.that.openImage)(event.target.files[0],event.data.that);
			
			image.readAsDataURL(event.target.files[0]);
		},
		openDialog:function(){
						
			$(this._file).click();
			
		},
		openImage:function(file,that){
			
			return function(e){
				
				that._img = $("<img />",{
					"src":e.target.result,
					"id":"cpfUploadCustomerImage"
				});
				
				var imageContent = $("<div />",{
					"class":"cpf-image-edit-image-content",
				});
				
				var imageMessage = $("<div />",{
					"class":"pepito",
					"html":that.options.imageMessage
				});
				
				var imageContentCrop = $("<div />",{
					"class":"cpf-image-edit-image-content-crop",
				});
				
				that.imageEdit = $("<div />",{
					"class":"cpf-image-edit",
				}); 
				
				var buttonContent = $("<div />",{
					"class":"cpf-image-edit-button-content",
				});
				
				var buttonContentLeft = $("<div />",{
					"class":"cpf-image-edit-button-content-left",
				});
				
				var buttonContentRight = $("<div />",{
					"class":"cpf-image-edit-button-content-right",
				});
				
				var closeButton = $("<div />",{
					"class":that.options.closeButtonClass,
					"html":that.options.closeButtonLabel
				}).bind("click",{"that":that},that.close);
				
				var saveButton = $("<div />",{
					"class":that.options.saveButtonClass,
					"html":that.options.saveButtonLabel
				}).bind("click",{"that":that},that.save);
				
				imageContent.append(imageContentCrop);
				
				buttonContentLeft.append(closeButton);
				
				buttonContentRight.append(saveButton);
				
				that.imageEdit.append(imageContent);
				
				that.imageEdit.append(imageMessage);
				
				buttonContent.append(buttonContentLeft);
				
				buttonContent.append(buttonContentRight);
				
				that.imageEdit.append(buttonContent);
			
				imageContentCrop.append(that._img);
				
				that._img.load(function(){
					
					if(that.options.draggable == true){
						
						that._img.draggable();
						
						that._img.bind("drag",{"that":that},that.imageDrag);
						
						that._img.bind("dragstop",{"that":that},that.imageDragStop);
						
						imageContent
							.css("width",that.options.width+"px")
							.css("height",that.options.height+"px");
						
						imageContentCrop
							.css("width",that.options.width+"px")
							.css("height",that.options.height+"px");
					}
					else{
						var percentage = (that.options.maxHeight * 100) / that._img[0].height;
						var finalWidth = (that._img[0].width * percentage ) / 100;
						
						that._img.Jcrop({
							aspectRatio: 55/73,
							setDimensions:true,
							imageWidth:finalWidth,
							imageHeight:that.options.maxHeight,
							onSelect:that.jCropSelect,
							imageInfo:{
								percentage:percentage,
								realWidth:that._img[0].width,
								realHeight:that._img[0].height,
								finalWidth:finalWidth,
								finalHeight:that.options.maxHeight,
								that:that
							}
						});
					}
					
					that.imageEdit.dialog({
						
						"close":function(){
							
							that._file.val("");
						}
					});
				});
				
			};
		},
		"jCropSelect":function( positions ){
			
			var x 			= positions.x,
				y 			= positions.y,
				w			= positions.w,
				h			= positions.h,
				imageInfo 	= this.getOptions().imageInfo;
			
			var left 	= (x * 100) / imageInfo.percentage,
				top	 	= (y * 100) / imageInfo.percentage,
				width 	= (w * 100) / imageInfo.percentage;
				height 	= (h * 100) / imageInfo.percentage;
			
			imageInfo.that.positionImage.position.top = top;
			
			imageInfo.that.positionImage.position.left = left;
			
			imageInfo.that.positionImage.position.width = width;
			
			imageInfo.that.positionImage.position.height = height;
		},
		"close":function( event ){
			
			event.data.that.imageEdit.dialog("close");
		},
		'reset':function(){
			
			var label = $(this.options.label);
			
			if(label.length > 0 ){
				
				label.text(this.options.labelText);
			}
			
			var destImg = $(this.options.destImage);
			
			if(destImg.length > 0 ){
				
				destImg.attr("src", this.options.defaultImage);
			}
		},
		"save":function( event ){
			
			var canvas = document.createElement("canvas");
			
			canvas.width = 110;
			
			canvas.height = 146;
			
			var context = canvas.getContext("2d");
			
			context.drawImage(
				event.data.that._img.get(0),
				Math.abs(event.data.that.positionImage.position.left),
				Math.abs(event.data.that.positionImage.position.top),
				event.data.that.positionImage.position.width,
				event.data.that.positionImage.position.height,
				0,
				0,
				event.data.that.options.width,
				event.data.that.options.height
			);
			
			var destImg = $(event.data.that.options.destImage);
			
			if(destImg.length > 0 ){
				
				destImg.attr("src", canvas.toDataURL("image/jpeg") );
			}
			
			var label = $(event.data.that.options.label);
			
			if(label.length > 0 ){
				
				label.text(event.data.that._fileName);
			}
			
			event.data.that.imageEdit.dialog("close");
			
			if( typeof event.data.that.options.success == "function" ){
				
				event.data.that.element.unbind("CPFUCISuccess");
				event.data.that.element.bind(
					"CPFUCISuccess",
					event.data.that.options.success
				);
				
				var imageData = canvas.toDataURL("image/jpeg");
				
				var binary = atob(imageData.split(",")[1]);
				
				var array = [];
				
				  for(var i = 0; i < binary.length; i++) {
				      array.push(binary.charCodeAt(i));
				  }
				
				
				event.data.that.element.trigger(
					"CPFUCISuccess",
					new Blob([new Uint8Array(array)],{type:"image/jpeg"})
				);
			}
		},
		"imageDrag":function( event , ui ){
			
			var contentWidth	 = $(this).parent().width(),
				contentHeight	 = $(this).parent().height(),
				width			 = $(this).width(),
				height			 = $(this).height(),
				returned		 = true;
			
			if(ui.position.left <= contentWidth - width){
				
				returned = false;
			}
			
			if(ui.position.top <= contentHeight - height){
				
				returned = false;
			}
			if(ui.position.top > 0 || ui.position.left > 0){
				
				returned = false;
			}
			
			return returned;
		},
		"imageDragStop":function( event , ui ){
			
			event.data.that.positionImage.position.left = ui.position.left;
			event.data.that.positionImage.position.top = ui.position.top;
		},
		"_destroy":function(){
			
			this._file.remove();
			
			$(this.element).unbind("CPFUCISuccess");
		}
	});
});