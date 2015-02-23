<?php
 
$files = array(
	"miscellaneous.js",
	"jquery.pm.jget.js",
	"jquery.pm.countlimit.js",
	"jquery.pm.dialog.js",
	"jquery.pm.getstates.js",
	"jquery.pm.imagetoblob.js",
	"jquery.pm.jsubmit.js",
	"jquery.pm.jcrud.js",
	"jquery.pm.jcrud2.js",
	"jquery.pm.jalert.js",
	"jquery.pm.jtooltip.js",
	"jquery.pm.jdtable.js",
	"jquery.pm.jmenu.js",
	"jquery.pm.newtiny.js",
	"jquery.pm.jconfirm.js",
	"jquery.cpf.jusers.js",
	"jquery.cpf.getusers.js",
	"jquery.cpf.standarduser.js",
	"array_query.js",
);

/*
$files = array(
	"jquery.pm.jdtable.js",
	"array_query.js",
);
//*/
$path = "development";

$savePath = ".";
$out = "jquery.pm.min.js";
//$out = "jquery.pm.min.jdtable.js";

minified($files, $path, $out, $savePath );

function minified( $files , $path , $out , $savePath ){
	
	$scan = scandir( $path );
	
	$fileToMini = array();
	
	if( count( $scan ) > 0 ){
		
		$mini = "";
		
		foreach( $scan as $file ){
			
			if( in_array($file , $files ) ){
				
				$openFile = file_get_contents($path."/".$file);
				
				$openFile =preg_replace('/\/\*[^\*]+\*\//', '', $openFile);
				$openFile =preg_replace('/\/\/[^\n]+/', '', $openFile);
				$openFile =preg_replace('/[\n\t]*/', '', $openFile);
				$openFile =preg_replace('/[\s]*=[\s]*/', '=', $openFile);
				$openFile =preg_replace('/[\s]*!=[\s]*/', '!=', $openFile);
				$openFile =preg_replace('/[\s]*\&\&[\s]*/', '&&', $openFile);
				$mini.=$openFile;
			}
		}
		$handle = fopen($savePath."/".$out, "w");
		
		fwrite( $handle , $mini );
		
		fclose( $handle );
	}
}
?>