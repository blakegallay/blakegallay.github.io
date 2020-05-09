/**
*Performs likelihood analysis on neutrino events given a set of known gamma-ray sources.
*<p> The display is made up of svg objects, on the same layer as the canvas objects making up the skymap. All likelihood-related objects are located below the skymap.
*<p> Two graphs are displayed to visually convey the results of the analysis. The following are in-depth explanations of how these graphs are generated, and how to interpret them.
*<p> <b> Likelihood Graph: </b> 
*<p> This graph displays the TS (test statistic), which is a quantification of the likelihood that ns neutrino events originated from the selected source,  for ns values between 0 and 10. In calculating the TS, spacial clustering of events, as well as their proximty to the source and their associated angular errors are taken into account. Generally, TS ≥ 25 is considered significant.
*<p> The following equations are used to compute TS: 
*<p> 
*<p> where ns = 0 is the null hypothesis that ns neutrino events correlate with the selected gamma-ray source, and is bounded between zero and N. S accounts for the event angular distribution. B is the background distribution which is assumed to be isotropic (1/4pi).N = # of neutrino events; M = # of sources in target catalog
*<p> The output to this equation is the calculated probability that exactly ns neutrino events are associated with the target source. 
*<p> The angular distribution of events takes the form of a 2-dimensional Kent distribution. This is the standard probability distribution for these events -- centered around the given coordinates, the true location of the source may lie anywhere in the surrounding region. This is why gamma-ray sources even in moderate proximity to neutrino events are of significance. 
*<p>
*<p> where L is our likelihood definition. Though our definition of TS is somewhat arbitrary, it serves to construct a scale where TS>25 can be considered statistically significant.
*<p>
*<p> <b> Proximity Visualization: </b>
*<p> This graphic displays a 20° Right Ascension x 20° Declination region surrounding the selected gamma-ray source. Neutrino events and their error regions are also displayed. The opacity of error regions at any given point in the graph relays the probability that the true location of an event lies on that point. In this way, the viewer can visualize how the angular distribution of nearby events actually relates to the location of the sources they select. 
*<p> As in our calculation of TS, the error regions of neutrino events follow a 2D Kent Distribution.
@function likelihood_analysis
*@memberof Analysis
*/
 
function likelihood_analysis(neutrinos_drawn, mydraw, dataContainer){
if(selected_source[0] != null && neutrinos_drawn){ //performs likelihood analysis if a gamma-ray source is selected and neutrinos are being drawn

mydraw.circle({
						coords: [selected_source[0], selected_source[1]],
						radius: 7,
						wrap: true,
						raw: true, 
						fill: false,
						stroke: true,
						lineWidth: 2,
						strokeStyle: 'green'
					});

d3.selectAll("svg").remove(); //removes all svg elements that persist from earlier runs

	  var margin = {top: 50, right: 30, bottom: 50, left: 50}, //general dimensions for visualization graphs
	  	width = 250 - 50,
      	height = 250 - 40;
		
	  var x = d3.scaleLinear().range([0,width])     //scaling axes to the width/height of graphs given the bounds
	  var y = d3.scaleLinear().range([height,0])
	  
	var svg = d3.select("body").append("svg")                                   //proximity visualization element
    		.attr("width", width + 150 + margin.right)
    		.attr("height", height + margin.top + margin.bottom + 50)
  		.append("g")
   	 		.attr("transform", "translate(" + 150 + "," + margin.top + ")");
	$("svg").css({top:1100,left:125,position:'absolute'});
	
	var ts_ns_svg = d3.select("body").append("svg")                             //likelihood graph element
    		.attr("width", width + 450 + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 450 + "," + margin.top + ")");
	$("svg").css({top:1100,left:300,position:'absolute'});
	
	var ts_ns_svg2 = d3.select("body").append("svg")                            //analysis summary element
    		.attr("width", width + 900 + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 750 + "," + margin.top + ")");
	$("svg").css({top:1100,left:750,position:'absolute'});
	
	var analysis_summary =                                                        //text for analysis summary
['These graphs visually represent the likelihood that the selected', 
 'gamma-ray source can be considered a source of neutrino events ',
 'in the selected dataset.                        ',
 '',
 'The proximity graph shows surrounding neutrino events within a',
 '20° x 20° square of the selected source.',
 'The angular error of the neutrino events is represented by a    ',
 '2D Gaussian gradient.',
 '',
 'The likelihood graph displays TS (test statistic), which is a quantification',
 'of the likelihood that ns neutrino events originated from the source,',
 'for ns values between 0 and 10. In calculating TS, spatial clustering of',
 'events, as well as their proximity to the source and the angular errors',
 'are taken into account. Generally, a TS ≥ 25 is considered significant.'
 ];
 
	ts_ns_svg2.append("text") //writes summary header text 
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(15,-5)")
	  	.text("Analysis Summary")	
		.attr('font-size','20')
		.attr('font-weight', 'bold')
		
	for(var n = 0; n < analysis_summary.length; n++){ //writes summary body text
	ts_ns_svg2.append("text")
	  	.attr("text-anchor", "start")
	  	.attr("transform", "translate(-65,".concat(String((n + 1) * 12)).concat(")"))
	  	.text(analysis_summary[n])	
		.attr('font-size','12')
		}
	
	ts_ns_svg2.append("svg:image")
.attr('x', 0)
.attr('y', 140)
.attr('width', 200)
.attr('height', 100)
.attr("xlink:href", "https://i.imgur.com/UKcHX3z.png")

	ts_ns_svg2.append("svg:image")
.attr('x', -5)
.attr('y', 177)
.attr('width', 200)
.attr('height', 100)
.attr("xlink:href", "https://i.imgur.com/7TUEasI.png")
	
	var svg_container_text = d3.select("body").append("svg") //Section header ('Source Analysis')
    		.attr("width", 40)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 25 + "," + margin.top + ")");
	$("svg").css({top:1100,left:0,position:'absolute'});
	
	
	
	var ras = {'min': selected_source[0] - 10, 'max': selected_source[0] + 10} //sets bounds for proximity graph, 20 degrees x 20 degrees
	var decs = {'min': selected_source[1] - 10, 'max': selected_source[1] + 10} //centered around the selected source
	
	x.domain([ras['min'], ras['max']]);
	y.domain([decs['min'], decs['max']]);
	
	
	
	
	// *****LIKELIHOOD ANALYSIS*****
	
	function sph_dot(th1, th2, phi1, phi2){
		
		return Math.sin(th1)*Math.sin(th2)*Math.cos(phi1-phi2) + Math.cos(th1)*Math.cos(th2);
		
	}	
	
	function event_angular_distribution(event){ //implementation of kent distribution
	
		var kappa = 1.0/(event.attr('err') * Math.PI/180)**2;
		
		var log_dist = Math.log(kappa) - Math.log(2*Math.PI) - kappa + kappa*sph_dot(Math.PI/2-parseFloat(event.attr('dec') * Math.PI/180), Math.PI/2 - (parseFloat(selected_source[1]) * Math.PI/180), parseFloat(event.attr('ra') * Math.PI/180), parseFloat(selected_source[0] * Math.PI/180));
		
		return Math.E ** log_dist;	
	
	}
	
	h_sum = 0.0;
	function H(ns){
	
		h_sum = 0.0;
		var N = 40
		
		var elements = dataContainer.selectAll("custom.point");
		
		elements.each(function(d) {
			
			if(d3.select(this).attr('type') == 'shower'){
			h_sum += Math.log((ns/N)*event_angular_distribution(d3.select(this))+(1-(ns/N))/(4*Math.PI))
			}
		})
		
		return 2 * h_sum;

	}
	
	function TS(ns){
	
		return H(ns) - H(0);
	
	}
	
	var x_arr = [];
	var y_arr = [];
	var ts_best = 0.0;
	var ns_best = 0.0;
	for(var ns = 0; ns < 10; ns += 0.01){
	
		var ts = TS(ns);
		
		x_arr.push(ns);
		y_arr.push(ts);
	
		if(ts > ts_best){
			ts_best = ts;
			ns_best = ns;
		}
		
	}
	
	var xdomain = d3.scaleLinear().range([0,width]).domain([0,10]);
	var ydomain = d3.scaleLinear().range([height,0]).domain([0,10]);
	
	for(var i = 0; i < y_arr.length; i++){
		
		if(y_arr[i] > 0){
			ts_ns_svg.append('circle')
						.attr('r', 1)
						.attr('cx', xdomain(x_arr[i]))
						.attr('cy', ydomain(y_arr[i]));
		}
	}
	
	ts_ns_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xdomain).ticks(10))
      
	   ts_ns_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(xdomain).ticks(10))
      
	  ts_ns_svg.append("g")
      	.call(d3.axisLeft(ydomain));
	  
	  ts_ns_svg.append("g")
	  	.attr("transform","translate(200,0)")
      	.call(d3.axisRight(ydomain));
	  
	  ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(-25,100)rotate(-90)")
	  	.text("TS")
	  	
	  ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,240)")
	  	.text("ns")	
		
		ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-35)")
	  	.text("Likelihood Graph")
		.attr('font-size', '15')
		.attr('font-weight', 'bold')
		
	 ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-25)")
	  	.text(("Most Likely Answer: ts = ").concat(Math.round(ts_best * 100) / 100).concat(" ns = ").concat(Math.round(ns_best * 100) / 100))	
		.attr('font-size', '10')
	
	var elements = dataContainer.selectAll("custom.point");
		elements.each(function(d) {
			
			var node = d3.select(this);
			
			if(node.attr('kind') == 'neutrino' && node.attr('ra') > ras['min'] && node.attr('ra') < ras['max'] && node.attr('dec') > decs['min'] && node.attr('dec') < decs['max']){
				var cont = true;
				var ang_err = node.attr('err');
				console.log(ang_err);
				for(var c = 1; c < 50; c++){

					if(cont){
						
						var opacity = String(Math.E ** ((-1 * ((c/1) ** 2)) / (2 * ang_err ** 2)) / (2 * Math.PI * (ang_err ** 2)))
						console.log(opacity);
						
						if(opacity > 0.00001){
					
							svg.append('circle')
								.attr('r', function(d) { if(node.attr('type') == 'shower'){ return c * 10; }else{return 0;}	})
								.attr('cx', x(node.attr('ra')))
								.attr('cy', y(node.attr('dec')))
								.attr('stroke', 'black')                                   
								.style('fill', 'none')
								.attr('opacity', String(opacity * 200))
								.attr('stroke-width', 10.05);
						
					}else{
						cont = false;
					}
					}
				}
			
				svg.append('circle')
					.attr('r', 5)
					.attr('cx', x(node.attr('ra')))
					.attr('cy', y(node.attr('dec')));
			
			}
			})
	
	svg.append('circle')
					.attr('r', 2)
					.attr('cx', x(selected_source[0]))
					.attr('cy', y(selected_source[1]))
					.attr('fill', 'red');
					
	  svg.append("rect")
		.attr('x', -200)
		.attr('y', 0)
		.attr('width', 200)
		.attr('height', 500)
		.attr('fill', 'white');
	  
	  svg.append("rect")
		.attr('x', 0)
		.attr('y', 210)
		.attr('width', 500)
		.attr('height', 100)
		.attr('fill', 'white');
		
	  svg.append("rect")
		.attr('x', 200)
		.attr('y', 0)
		.attr('width', 100)
		.attr('height', 500)
		.attr('fill', 'white');
		
      svg.append("rect")
		.attr('x', -200)
		.attr('y', -50)
		.attr('width', 500)
		.attr('height', 50)
		.attr('fill', 'white');
	  
	 svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      
	   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x).ticks(10))
      
	  svg.append("g")
      	.call(d3.axisLeft(y));
	  
	  svg.append("g")
	  	.attr("transform","translate(200,0)")
      	.call(d3.axisRight(y));
	  
	  svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(-25,100)rotate(-90)")
	  	.text("Declination (deg)")
		
	  svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,240)")
	  	.text("Right Ascension (deg)")	
	
	svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-35)")
	  	.text("Proximity Visualization")
		.attr('font-size', '15')
		.attr('font-weight', 'bold')
		
	 svg_container_text.append("rect")
		.attr('x', -100)
		.attr('y', -100)
		.attr('width', 300)
		.attr('height', 500)
		.attr('fill', 'white');	
		
	 svg_container_text.append("rect")
		.attr('x', -100)
		.attr('y', -100)
		.attr('width', 350)
		.attr('height', 350)
		.attr('fill', 'rgb(135,206,250)');

	svg_container_text.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(5,100)rotate(-90)')
		.text('Source Analysis')
		.attr('font-size','30')
		
	for(var h = 0; h < 50; h++){
	
		svg.append("rect")
			.attr('x', h * (200 / 50))
			.attr('y', 250)
			.attr('width', (200 / 50))
			.attr('height', 20)
			.attr('fill', 'black')
			.attr('opacity', 1 - (h / 50));
	}	
		
	svg.append("rect")
					.attr('x', 0)
					.attr('y', 250)
					.attr('width', 200)
					.attr('height', 20)
					.attr('fill', 'none')
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(-10,260)')
		.text('f(r)')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(0,280)')
		.text('≥5e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(50,280)')
		.text('3.75e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(100,280)')
		.text('2.5e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(150,280)')
		.text('1.25e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(200,280)')
		.text('0')
		.attr('font-size','10');	
	svg.append("svg:image")
.attr('x', 42)
.attr('y', 270)
.attr('width', 50)
.attr('height', 50)
.attr("xlink:href", "https://i.imgur.com/O7y5cpw.png")

svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(137,300)')
		.text('σ = angular error')
		.attr('font-size','10');

}
}
