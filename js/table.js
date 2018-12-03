

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

Table = function(_parentElement, _teamNames, _dates, _gameData, _wlratioData){
	this.parentElement = _parentElement;
	this.gameData = _gameData;
	this.wlratioData = _wlratioData;
	this.teamNames = _teamNames;
	this.dates = _dates;

	this.initVis();
}
/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

Table.prototype.initVis = function(){
	var vis = this;

	vis.lwidth = 700;
	vis.lheight = 300;

	vis.margin = {top: 40, right: 40, bottom: 75, left: 40};

	vis.svg = d3.select("#left").append("svg")
	    .attr("width", vis.width+vis.margin.left+vis.margin.right)
	    .attr("height", vis.lheight+vis.margin.top+vis.margin.bottom).attr("class", "dotGraph");

		// (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

Table.prototype.wrangleData = function(){
	var vis = this;

	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

Table.prototype.updateVis = function(){
	var vis = this;

	var cellPadding = 10;

	var cellHeight = (vis.lheight/vis.teamNames.length)-cellPadding
	var cellWidth = ((vis.width)/vis.dates.length)-cellPadding;
	
	/*
	console.log(vis.gameData);
	console.log(vis.wlratioData);
	console.log(vis.teamNames);
	console.log("DATES: ", vis.dates);
	console.log(cellHeight);
	console.log(cellWidth);
	*/

	//yScale.range([cellHeight, 0]);

	var squareUpdate = vis.svg.selectAll("rect")
		.data(vis.teamNames);

	//console.log(dates.length);
	for(var row = 0; row < vis.teamNames.length; row++){

		//var wlRowData = [];

		for(var column = 0; column < vis.dates.length; column++){

			//wlRowData.push(wlratioData[teamNames[row]][dates[column]]);
			squareUpdate.enter()
				.append("rect")
				.merge(squareUpdate)
				.transition()
				.duration(1000)
				.attr("x", function(d) {
					//console.log("test")
					//return 10;
					return column*cellWidth+cellPadding;
				})
				.attr("y", function(d) {
					//return 10;
					return row*cellHeight+cellPadding;
				})
				.attr("width", cellWidth-10)
				.attr("height", cellHeight-10)
				.attr("fill", function(d) {
					//console.log("_gameData: ", vis.gameData);
					if(vis.gameData[vis.teamNames[row]][vis.dates[column]] == 1){
						return "orange";
					}
					else if(vis.gameData[teamNames[row]][vis.dates[column]] == -1){
						return "teal";
					}
					else{
						return "lightgray";
					}
				});
			
		}
	}
}

