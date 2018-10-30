		   	//files already included in the program. They should be in the Data folder.
/*var files = ["/~eforberger/Data/hawc2.txt","/~eforberger/Data/nhdata.txt", "/~eforberger/Data/output_Observation.txt",
		     "/~eforberger/Data/fermit1.txt", "/~eforberger/Data/fermit2.txt", "/~eforberger/Data/fermit3.txt",
		      "/~eforberger/Data/fermit4.txt", "/~eforberger/Data/pointsources.txt"];
		      */
var files = ["./Data/hawc2.txt","./Data/nhdata.txt", "./Data/output_Observation.txt",
		     "./Data/fermit1.txt", "./Data/fermit2.txt", "./Data/fermit3.txt",
		      "./Data/fermit4.txt", "./Data/pointsources.txt"];//to run locally

/**
* Begins parsing of data and drawing of skymap <p>
* Called on load, as well as on significant changes (making selections, performing analysis, configuring filter parameters)
* @function initialize
* @memberof Main
*/
function initialize(){
	var input = document.getElementById("myFile"); //checks for new uploaded file(s)
	hideshow();
	if (input.files.length <= 0){
		pushFiles([]); //if none, continue and push selected files to skymap to be drawn
	}else{
		customReader(input) //read new file(s) and continue
	}
	
}