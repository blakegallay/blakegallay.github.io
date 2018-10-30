/**
*Returns true if file has been selected by the user, false if otherwise
*@function isSelected
*@memberof Utility
*@param {String} kind kind/category of file (accepted kinds: 'neutrino', 'gamma-ray', 'source', 'other')
*@param {String} filename given name of file 
*@returns {boolean}
*/
function isSelected(kind, filename){
	var end = false;
			$('#'+kind+"select option").each(
				function(){
					if (this.selected){ 
						if (filename.split('/')[filename.split('/').length-1] == this.value.split('/')[this.value.split('/').length-1]){
							end = true;
						}
					}
				});//end of 1st function
	return end;
}

/**
*Utility
*@function toDegrees
*@memberof Utility
*@param {float} angle in radians
*@returns {float} angle in degrees
*/
function toDegrees(angle) {
  return angle * (180 / Math.PI);
}
/**
*Utility
*@function toRadians
*@memberof Utility
*@param {float} angle in degrees
*@returns {float} angle in radians
*/
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

/*
The following functions act as cosmetic, but not functional, namespaces in order to provide a hierarchical structure to documentation.
*/
/**
*Handles UI elements 
*@namespace Interface
*/
function interface_doc(){
}
/**
*Handles various misc. utilities
*@namespace Utility
*/
function utility_doc(){
}
/**
*@namespace Processing
*/
function processing_doc(){
}
/**
*@namespace Output
*/
function output_doc(){
}
/**
*@namespace Analysis
*/
function analysis_doc(){
}
/**
*@namespace Main
*/
function main_doc(){
}


