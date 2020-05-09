function findRangeEnergy(filename, text, kind){ // findRangeEnergy
	var setoff = [0,0,0,0,0,0,0,0,0];
	indices = parseFormat(text);
	var d;
	var min; var max; var extramin; var extramax;
	var gotStartR1 = [false, false];
	var gotStartR2 = [false, false];

	if (text[0] == null || Array.isArray(text)) { console.log('returning null null');return [null, null];}
	var index = (['neutrino', 'gamma_ray'].includes(kind.toLowerCase())) ? 5: 7;
	var lines = text.split('\n'); 
	for (d = 1; d < lines.length; d++){
		var word = lines[d].trim().split(/\s+/);
		
		//resets setoff
		for (item in indices){
			setoff[item] = indices[item];
		}
		
		for (entry = 0; entry < word.length; entry++){
			if (word[entry] != null && word[entry] != undefined) {
				if (word[entry].includes('(')){
					for (var h = entry; h < word.length; h++) {
						if (word[h].includes(')')){
							for (item in indices){
								if (indices[item] >= entry){
									setoff[item] += h-entry+1;
								}
							}
						}
					} 
				}
			}
		}

		if (word[setoff[index]] != 'null' && !isNaN(word[setoff[index]])){
			if (parseFloat(word[setoff[index]]) > max || !gotStartR1[0]) {max = word[setoff[index]]; gotStartR1[0] = true;}
			if (parseFloat(word[setoff[index]]) < min || !gotStartR1[1]) {min = parseFloat(word[setoff[index]]); gotStartR1[1] = true;}
			if (index == 7){
				if (parseFloat(word[setoff[index+1]]) > extramax && word[setoff[index+1]] != 'null' || !gotStartR2[0]) {extramax = parseFloat(word[setoff[index+1]]); gotStartR2[0] = true;}
				if (parseFloat(word[setoff[index+1]]) < extramin && word[setoff[index+1]] != 'null' || !gotStartR2[1]) {extramin = parseFloat(word[setoff[index+1]]); gotStartR2[1] = true;}
			}
		}
	}//[[emax, emin], [dfs, sdfs]] or [[fmin, mfax],[smin, smax]]
	
	var rangeOne = (min === max)? [null, null] : [min, max];
	var rangeTwo = (extramin === extramax)? [null, null] : [extramin, extramax];
	
	if (!rangeList.includes([filename, rangeOne, rangeTwo])){
		rangeList.push([filename, rangeOne, rangeTwo]);
	}
}
