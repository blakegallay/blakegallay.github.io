/**
*Toggles the visibility of various HTML elements
 * <ul style="list-style: none;">
 *  <li> time filtering ("times", "set_margin")
 *  <li> flux filtering ("flux_form")
 *  <li> spectral index filtering ("spec_form")
 * </ul>
*@function hideshow
*@memberof Interface
*/

function hideshow(){ //showUIParts
	if (document.getElementById("timebox").checked){
		document.getElementById("times").style.display = "initial"; 
		document.getElementById("set_margin").style.display = "initial";
	}else{
	document.getElementById("times").style.display = "none";
		document.getElementById("set_margin").style.display = "none";
	}
	if(document.getElementById("spec_index").checked){
		document.getElementById("spec_form").style.display = 'initial';
	}else{
		document.getElementById("spec_form").style.display = 'none';
	}
	if(document.getElementById("flux").checked){
		document.getElementById("flux_form").style.display = 'initial';
	}else{
		document.getElementById("flux_form").style.display = 'none';
	}

	
}

//set the sliders max and min energy params according to the files selected
function updateEnergyRange(name){ //
	var a = 0;
	var min = -1;
	var max = -1;
		$('#'+name+'select option').each(function(){
		if (this.selected){
			for (a = 0; a < rangeList.length; a++){
				if (rangeList[a][0].split('/')[rangeList[a][0].split('/').length-1] == this.value.split('/')[this.value.split('/').length-1] ){
					var index = (document.getElementById('spec_index').checked && name == 'source') ? 2:1;
					if ((min == -1 || rangeList[a][index][0] < min) && rangeList[a][index][0] != "null" && rangeList[a][index][0] != null) { min = rangeList[a][index][0]; }
					if ((max == -1 || rangeList[a][index][1] > max) && rangeList[a][index][1] != "null" && rangeList[a][index][1] != null) { max = rangeList[a][index][1]; }
				}
			}
		}
		});
		sliders(name+"slider").set(parseFloat(min),parseFloat(max),null);
		if (name == 'source'){ //go and switch the displayed text
		//hideshow is called here because changeEnergyParams() could be being called because of the user changing the flux/spectral index checkboxes. When they change, not only does the energy values shown on the slider need to change, but the text over the slider needs to change as well, and that is done in hideshow.
			hideshow();
		}
}


function addFile (filepath, placement){ //addFileName
if (placement == 'hawc'  || placement == 'fermi'){
	placement = 'source';
}
if (!(placement == 'source' || placement == 'neutrino' || placement == 'gamma_ray')){
	placement = 'other';
}
	var pathArray = filepath.split('/');
	var fileName = pathArray[pathArray.length-1];
	var drop = document.createElement('option');
	drop.value = fileName;
	drop.text = getDropDownText(fileName);
	var canUse = true;
	for (var i = 0; i < document.getElementById(placement.toLowerCase()+'select').length; i++){
		if (document.getElementById(placement+i) != null){
			if (document.getElementById(placement+i).value == fileName){ //if the name is already in that dropdown
				canUse = false;
			}
		}
	}
	if (canUse){ //if the name isn't in the dropdown.
		drop.id = (placement+document.getElementById(placement+'select').length);
		document.getElementById(placement+'select').add(drop);
		}
}