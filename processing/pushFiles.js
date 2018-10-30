/**
*Handles files already in the program
*@function pushFiles
*@memberof Processing
*@param {} userData - user uploaded data, parsed and filtered by customReader.js/filter.js
*/
function pushFiles(userData){ //readprogramfiles
	//handles files already in the program
	/**
	*Reads a raw text file(s)
	*@function readTextFile
	*@memberof Processing.pushFiles
	*@param {} files
	*@param {} ready
	*/
	function readTextFile(files, ready){
		var q;
		var output = [];
		for (q = 0; q < files.length; q++){
		   var rawFile = new XMLHttpRequest();
			rawFile.open("GET", files[q]);
			rawFile.overrideMimeType("text/plain; charset=x-user-defined");
			rawFile.onreadystatechange =  function(rawFile,q){ return function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{	
						var textid = (rawFile.responseText.split("\n")[2].split(" ")[4].toLowerCase() == 'hawc') ? 'source' :rawFile.responseText.split("\n")[2].trim().split(/\s+/)[4].toLowerCase(); console.log(textid);
            			if (isSelected(textid, files[q])){
							output.push([files[q], filter(rawFile.responseText)]);
						}
						else {
							output.push([files[q], []]);
						}
						addFile(files[q], rawFile.responseText.split("\n")[1].split(" ")[4].toLowerCase());
						findRangeEnergy(files[q], rawFile.responseText, textid);
						if (output.length >= files.length){
							ready(output);
						}
					}
				}
			}; }(rawFile,q);
			rawFile.addEventListener("progress", function(){console.log("progress");});
			rawFile.addEventListener("load", function(){console.log("load");});
			rawFile.addEventListener("error", function(evt){
				console.log("error");
				console.log(evt);
			});
			rawFile.addEventListener("abort", function(){console.log("abort");});
			rawFile.send();
			}//here
}


readTextFile(files, function (filelist){

	//adds user inputted files to filelist:
	for (var h = 0; h  < userData.length; h++){
		filelist.push(userData[h]);
	}
//call skymap, draws the data and map, and handles zooming
console.log(filelist[0]);
skymap(filelist);
});
}
