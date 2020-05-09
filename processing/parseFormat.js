/**
*Parses files with non-standard organization.
*<p> Called by filter.js when reading and filtering files
*<p>In order to read custom files, Vetal must determine how the data is organized.
*<p>The general acceptable file format consists of a raw text file organized as a spreadsheet w/ headers located on the first line. 
*<p>This function finds those headers, and communicates back to the file reader how they are organized:
*<p> Vetal format:
 * <ul style="list-style: none;">
 *  <li> 1) declination (degrees)
 *  <li> 2) right ascension (degrees)
 *  <li> 3) error/angular resolution 
 *  <li> 4) topology/event signature
 *  <li> 5) error/angular resolution 
 *  <li> 6) energy
 *  <li> 7) date/time
 *  <li> 8) flux
 *  <li> 9) spectral index
 * </ul>
*@function parseFormat
*@param {String} text - the raw text of a data file
*@returns {Array} indices - an array of integers telling how the columns/headers of the file are arranged in comparison to the standard Vetal format. <p> For example, a file organized as {ra, dec} would return [2, 1, null, null....] - the first index holds right ascension which is the second index in the default format, the second index holds dec (1st default format index), and no other data is contained so the remaining indices are null.
*@memberof Processing
*/

function parseFormat(text){ //getIndices
var words = text.split('\n');
headed = false;
var indices = [0,1,2,3,4,5,6,7,8,9]; //default format
var offset = 0;

if (words[0].trim().toLowerCase().includes('dec')){ //check for headers
	console.log('found header');
		headed = true
		indices = [null,null,null,null,null,null,null,null,null,null]
		var columns = words.shift().trim().split(/\s+/);
		
		var combos = {"DISTRIBUTED":"ENERGY", //pairs of words which act as a single header
					  "ANG":"RESOLUTION",
					  "ANGULAR":"RESOLUTION",
					  "DEPOSITED":"ENERGY",
					  "RIGHT":"ASCENSION"}
		
		for(var h = 0; h < columns.length; h++){
			for(key in combos){
				if(columns[h].toUpperCase() == key){ 
					if(columns[h+1].toUpperCase() == combos[key]){
						var s = (columns.slice(h, h+1).concat(columns.slice(h+1, h+2))).join("_");
						console.log('s ' + s);
						columns.splice(h+1,1);
						columns[h] = s;
					}
				}
			}
		}
		
		for(m = 0; m < columns.length; m++){
			c = columns[m]
			if (c.toUpperCase().charAt(0) == "[" && c.toUpperCase().charAt(c.length-1) == "]") {
				offset++;
			}
			else if (c.toUpperCase().charAt(0) == "(" && c.toUpperCase().charAt(c.length-1) == ")") {
				offset++;
			}
			else if (c == null || c.length < 1) {
				console.log('found null!');
				offset++;
			}
			else if(c.toUpperCase().includes("RA") || c.toUpperCase() == "RIGHT_ASCENSION"){
				indices[1] = m-offset;
			}
			else if (c.toUpperCase().includes("DEC") || c.toUpperCase().includes("DECLINATION")){
				indices[0] = m-offset;
			}
			else if (c.toUpperCase().includes("FLUX") || c.toUpperCase() == "FL"){
				indices[7] = m-offset;
			}
			else if (c.toUpperCase().includes("SPECTRAL INDEX") || c.toUpperCase() == "SPEC"){
				indices[8] = m-offset;
			}
			else if (c.toUpperCase() == "E" || c.toUpperCase().includes("ENERGY") || 
					 c.toUpperCase().includes("MEV") || c.toUpperCase().includes("GEV") || 
					 c.toUpperCase().includes("TEV") || c.toUpperCase().includes("KEV") ){
				indices[5] = m-offset;
			}
			else if (c.toUpperCase() == "TOPOLOGY" || c.toUpperCase().includes("TOP") ||
					 c.toUpperCase() == "SIGNATURE"){
				indices[3] = m-offset;
			}
			else if (c.toUpperCase().includes("ERR") || c.toUpperCase().includes("ANG_RESOLUTION") ||
					 c.toUpperCase().includes("ANGULAR_RESOLUTION")){
				indices[2] = m-offset;
			}
			else if (c.toUpperCase().includes("TIME") || c.toUpperCase().includes("MDJ")){
				indices[6] = m-offset;
			}
		}
		
	}
	
	return indices;
}