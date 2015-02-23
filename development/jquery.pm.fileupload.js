$(function(){
	
	$.widget("pm.fileUpload",{
		
		options:{
			"name":"file",
			"accept":"",
			"urlCheckFiles":"?controller=settings&json=true&check_files=true",
			"urlUploadFiles":"?controller=settings&json=true&upload_files=true",
			"fullUpload":false,
			"byteInterval":2048,
			"width":400,
			
			//callbacks
			"completed":function(){}
		},
		_create:function(){
			
			var that = this;
			
			this._isInit == false;
			
			this._files = new Array;
			
			this._uploadElement = [];
			
			this._uploadProgressText = [];
			
			this._uploadProgressBar = [];
			
			this._setDialog();
			
			$(["completed"]).each(function(){
			
				if(typeof that.options[this] != "function"){
					
					that.options[this] = function(){};
				}
			});
		},
		"_addFiles":function( e ){
			
			var that = e.data.that;
			
			that._inputFile.trigger("click");
		},
		"_cancel":function( e ){
			
			var that = e.data.that;
			
			that.dialog.dialog("close");
			
			that.destroy();
		},
		"_close":function( e ){
			
			var that = e.data.that;
			
			that._isInit = false;
			
			that._cancelButton.trigger("click");
			
			that.dialog.dialog("close");
			
			that.destroy();
		},
		"_setDialog":function(){
			
			var that = this;
			
			this._isInit = true;
			
			this._blobContent = [];
			
			this._inputFile = $("<input />",{
				"type":"file",
				"multiple":"multiple",
				"name":that.options.name,
				"css":{
					"display":"none"
				}
			}).bind("change",{"that":that},that._fileChange);
			
			this._fileContent = $("<div />",{
				"class":"sct-file-upload-content"
			});
			
			var _buttonContent = $("<div />",{
				"class":"sct-control-button-right"
			});
			
			this._closeButton = $("<div />",{
				"class":"sct-button sct-button-blue",
				"html":"Cerrar"
			});
			
			this._cancelButton = $("<div />",{
				"class":"sct-button sct-button-red",
				"html":"Cancelar"
			});
			
			this._addFilesButton = $("<div />",{
				"class":"sct-button sct-button-orange",
				"html":"Agregar archivos"
			});
			
			this._uploadButton = $("<div />",{
				"class":"sct-button sct-button-green",
				"html":"Subir archivos"
			});
			
			this.dialog = $("<div/>",{
				"css":{
					"width":that.options.width+"px",
				}
			});
			
			this._uploadButton.bind("click", {"that":this} , this._upload );
			
			this._closeButton.bind("click", {"that":this} , this._close );
			
			this._cancelButton.bind("click", {"that":this} , this._cancel );
			
			this._addFilesButton.bind("click", {"that":this} , this._addFiles );
			
			_buttonContent.append(
				this._closeButton,
				this._cancelButton,
				this._addFilesButton,
				this._uploadButton
			);
			
			this.dialog.append(
				this._fileContent,
				_buttonContent
			);
		},
		"_upload":function( e ){
			
			var that = e.data.that;
			
			if( that._files.length > 0 ){
				
				for(var i in that._files ){
					
					var name = that._files[i].name,
						type = that._files[i].type,
						size = that._files[i].size;
					/*
					that._uploadProgressBar[name].append(
						"<div class='sct-file-upload-progressbar-inner-label'>"+
						"Subiendo archivo...</div>"
					);
					*/
					that._prepareFile( that._files[i] , name , type , size );
				}
			}
			else{
				
				alert("Seleccione un archivo");
			}
		},
		"_prepareFile":function(file, name , type , size){
			
			var that = this;
			
			var fd = new FormData(),
				slice = new Array,
				blob  = "",
				stop = 0,
				length = that._uploadElement[name].data( "length");
		
			if(length > 0 ){
				
				stop = length  + ( that.options.byteInterval * 1 );
				
				if(stop > size){
					
					stop = size;
				}
				slice = [length,  stop];
			}
			else{
				
				stop = ( that.options.byteInterval * 1 );
				
				if(stop > size){
					
					stop = size;
				}
				slice = [ 0 , stop ];
			}
			
			blob =  file.slice( slice[0] , slice[1] );
			
			fd.append(that.options.name+"[name]",name);
			
			fd.append(that.options.name+"[type]",type);
			
			fd.append(that.options.name+"[size]",size);
			
			fd.append("interval", blob );
			
			that._ajaxUpload( fd , file, name , type , size );
			
		},
		"_ajaxUpload":function( fd , file, name , type , size ){
			
			var that = this;
			
			$.ajax({
				"url":this.options.urlUploadFiles,
				"dataType":"json",
				"data":fd,
				"processData":false,
				"contentType":false,
				"type":"POST",
				"xhrFields":{
					"onprogress":function(progress){
						
					}
				},
				"success":function( data ){
				
					that._setFileValues(data);
					
					if( data.uploadedSize < data.size ){
						
						that._prepareFile( file, name , type , size );
					}
					else{
						
						that.options.completed( data );
					}
				}
			});
		},
		"_fileChange":function(e){
			
			var that = e.data.that;
			
			var filesInput = e.target.files;
			
			that._files = null;
			
			that._files = new Array;
			
			that._fileContent.empty();
			
			for(var i in filesInput){
				
				if(filesInput[i].type){
					
					that._files[i] = filesInput[i];
					
					that._uploadProgressBar[filesInput[i].name] = $("<div/>",{
						"class":"sct-file-upload-progressbar"
					}).progressbar({"value":0});
					
					that._uploadProgressText[filesInput[i].name] = $("<span/>",{
						"class":"sct-file-upload-progress-text",
						"html":"0%"
					});
					
					that._uploadElement[filesInput[i].name] = $("<div/>",{
						"class":'sct-file-upload-item',
						"html":function(){
							
							$(this).append("<span class='name'>"+filesInput[i].name+"</span>");
						}
					});
					
					that._uploadElement[filesInput[i].name].append(
						that._uploadProgressText[filesInput[i].name],
						that._uploadProgressBar[filesInput[i].name]
					);
					
					that._fileContent.append(that._uploadElement[filesInput[i].name]);
				}
				
			}
			
			if(that._files.length > 0 ){
				
				
				that._checkFilesExists(that._createFormData());
				
			}
		},
		"_createFormData":function(){
			
			var fd = new FormData();
			
			var that = this;
			
			for(var i in that._files){
				
				fd.append("files["+that._files[i].name+"][name]",that._files[i].name);
				
				fd.append("files["+that._files[i].name+"][size]",that._files[i].size);
				
			}
			
			return fd;
		},
		"_checkFilesExists":function(filesArray){
			
			var that = this;
			
			$.ajax({
				"url":this.options.urlCheckFiles,
				"dataType":"json",
				"data":filesArray,
				"processData":false,
				"contentType":false,
				"type":"POST",
				"xhrFields":{
					"onprogress":function(progress){
						
					}
				},
				"beforeSend":function(){
					
				},
				"success":function( data ){
					
					for(var i in data ){
						
						that._setFileValues(data[i]);
					}
				}
			});
		},
		"_setFileValues":function( data ){
			
			if(data.name){
				
				var uploaded = ((data.uploadedSize  * 100) / data.size).toFixed(3);
				
				this._uploadElement[data.name].data( "length" , data.uploadedSize );
				
				this._uploadProgressBar[data.name].progressbar("option",{
					"value":Math.floor(uploaded)
				});
				
				this._uploadProgressText[data.name].html(uploaded+"%");
			}
		},
		_init:function(){
			
			var that = this;
			
			$(this.element).click(function(){
				
				if( !that._isInit ){
					
					that._setDialog();
				}
				
				that.dialog.dialog();
				
				that._inputFile.trigger("click");
			});
		},
		"_destroy":function(){
			
			this._inputFile.remove();
			
			$(this.element).unbind("CPFUCISuccess");
		}
	});
});