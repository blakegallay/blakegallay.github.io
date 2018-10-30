/**

*@function filter
*@memberof Processing
*/
function filter(text, kind){ //readFile
	
	var lines = text.split('\n');
	var type = 'null';
	var events = [];
	var search = 1; 
	var stop = 0;
	var h; var entry;
	var setoff = [0,0,0,0,0,0,0,0,0];
	
	if(document.getElementById("timeselect").value == "s"){
	var margin = parseFloat(document.getElementById("margin").value);
}else if(document.getElementById("timeselect").value == "m"){
	var margin = parseFloat(document.getElementById("margin").value) * 60;
}else if(document.getElementById("timeselect").value == "h"){
	var margin = parseFloat(document.getElementById("margin").value) * 3600;
}else if(document.getElementById("timeselect").value == "d"){
	var margin = parseFloat(document.getElementById("margin").value) * 86400;
}else if(document.getElementById("timeselect").value == "m"){
	var margin = parseFloat(document.getElementById("margin").value) * 2592000;
}else if(document.getElementById("timeselect").value == "y"){
	var margin = parseFloat(document.getElementById("margin").value) * 31104000;
}
	//param has some of the parameters for the data the user wants. the rest of the parameters are directly from html input elements and from typeList and rangeList
	var param = {'kind': ['null'], 
				 'timeMin': (Date.parse(document.getElementById("day").value + " " + document.getElementById("month").value + " "
				  + document.getElementById("year").value + " " + document.getElementById("hour").value + ":" 
				  + document.getElementById("minute").value + ":" + document.getElementById("second").value)/1000 - margin), 
				  'timeMax': (Date.parse(document.getElementById("day").value + "-" + document.getElementById("month").value 
				  + "-" + document.getElementById("year").value + " " + document.getElementById("hour").value + ":" 
				  + document.getElementById("minute").value + ":" + document.getElementById("second").value)/1000 + margin)};

		param["kind"].splice(-1, 0, 'gamma_ray', 'Gamma_Ray', 'Gamma_ray'); //fermi

		param["kind"].splice(-1, 0, 'neutrino', 'Neutrino');//icecube
	
		param["kind"].splice(-1, 0, 'hawc', 'HAWC', 'Source', 'source');//hawc
	
		param["kind"].splice(-1, 0, 'other');//other
		
	format = parseFormat(text);
	
	//search must be greater than lines.length
	//stop is if you want a certain amount of data points from the current set
	while (search < 100000 && stop < 22500 && search < lines.length) {
		
		//resets setoff
		for (item in format){
			setoff[item] = format[item];
		}
		
		var words = lines[search].trim().split(/\s+/);
		
		if (lines == null ){
			break;
		}
		if(words[1] == null || lines.length < 2){
			search++;
			continue;
		}
		
		//check for items in parenthesis, which will be excluded.
		/*
		This is checked for every word instead of for just one entry in the list lines
		because one line could contain :
			( -21.6  +25.9)
		and be broken up into [ (, -21.6, +25.9) ], while another line could contain :
			(-144.4 +131.6)
		could be broken up into [ (-144.4, +131.6) ] meaning the number to offset the 
		index by in one line is not always the same as in another line.
		*///info
		for (entry = 0; entry < words.length; entry++){
			if (words[entry] != null && words[entry] != undefined) {
				if (words[entry].includes('(')){
					for (var h = entry; h < words.length; h++) {
						if (words[h].includes(')')){
							for (item in format){
								if (format[item] >= entry){
									setoff[item] += h-entry+1;
								}
							}
						}
					} 
				}
			}
		}
		
		//if index of a param wasn't found, set the index to point to 'null' MOVE LATER
		words.push('null');
		for(var index = 0; index < setoff.length; index++){
			if(setoff[index] == null){
				setoff[index] = parseInt(words.length);	
			}
		}
		
		//for user uploaded files, the kind is inputted by the user. 
		eventKind = (kind != 'nope' && kind != null)? kind : words[4]; 
		eventType = (words[setoff[3]] == null)? 'null' : words[setoff[3]];
		eventType = (eventType.toLowerCase() == 'cascade')? 'shower' : eventType;
		
		if (param["kind"].includes(eventKind.split('userupload')[0].toLowerCase())){ 
			 if (selectedSourceTypes().includes(eventType.toLowerCase()) || eventKind.includes('userupload')){
					if (document.getElementById("timebox").checked == false || param['timeMin'] < parseFloat(words[setoff[6]]) && param['timeMax'] > parseFloat(words[setoff[6]])){
						if (withinRange(words, setoff, eventKind)){ //compares flux/spec/energy of event to the slider ranges - only passes if within
							astrojs.ready(function(e){
								if (Galactic){
									var c = astrojs.coordinates.eq2gal(parseFloat(words[setoff[1]]), parseFloat(words[setoff[0]]), 2000);
									words[setoff[0]] = c.b;
									words[setoff[1]] = c.l;
									//lat = b or dec, long = l or ra
								} }); 
								events.push({dec: parseFloat(words[setoff[0]]), ra: parseFloat(words[setoff[1]]),
								err: parseFloat(words[setoff[2]]), type: eventType,
								kind: eventKind, energy: parseFloat(words[setoff[5]]), flux: parseFloat(words[setoff[7]]), spec: parseFloat(words[setoff[8]])}) ;
								stop ++;
						}
				   }     	    	    
			 }
		}
		search++;
	}	
	return events;
}//end of filterLine

function selectedSourceTypes(){ //updateTypeList
	var k;
	var typelist = [];
	//this for loops goes through the source types and adds the selected ones to typeList
	for (k = 1; k < 21; k++){
		if (document.getElementById(String(k)).checked){
			typelist.unshift(document.getElementById(String(k)).name.toLowerCase());
		}
	}
	if (document.getElementById('track').checked) {typelist.unshift('track');} //************
	if (document.getElementById('shower').checked) {typelist.unshift('shower');}
	//************
	typelist.unshift('null');
	return typelist;
}

function withinRange(word, indices, kind ){ //changeEnergyParams
	var range = []; 
	var refinedKind =(kind.toLowerCase().includes('hawc'))? 'source': kind.split('userupload')[0].toLowerCase();
	/*
	The following gets the min and max values of the slider from the text input box above it. 
	range[0] = min
	range[1] = max
	*/
	range = [sliders(refinedKind+"slider").get(0),sliders(refinedKind+"slider").get(1)];

	if (document.getElementById('spec_index').checked == true && ['hawc', 'source'].includes(kind.split('userupload')[0].toLowerCase())){
		if ( parseFloat(word[indices[8]]) >= range[0] && parseFloat(word[indices[8]]) <= range[1]  ||
		(kind.includes('userupload') && (word[indices[8]] == 'null' || word[indices[8]] == null))){
			return true;
		}
			return false;
	}
	if (document.getElementById('flux').checked == true && ['hawc', 'source'].includes(kind.split('userupload')[0].toLowerCase())){
		if (parseFloat(word[indices[7]]) >= range[0] && parseFloat(word[indices[7]]) <= range[1] ||
		(kind.includes('userupload') && (word[indices[7]] == 'null' || word[indices[8]] == null))){
			return true;
		}
		return false;
	}
	if(['gamma_ray', 'neutrino'].includes(kind.split('userupload')[0].toLowerCase())){
		if (range[0] <= parseInt(word[indices[5]]) && range[1] >= parseInt(word[indices[5]]) ||
		(kind.includes('userupload') && (word[indices[5]] == 'null' || word[indices[5]] == null))){
			return true;
		}
		return false;
	}
return true;
}
