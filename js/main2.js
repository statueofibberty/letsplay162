
// {team1: {date1: 1(win), date2: -1(loss), ...}, team2: ...}
var game_data;
// {team1: {date1: ratio1, date2: 2, ...}, team2: ...}
var wl_ratio_data;
// [team1, team2, team3, ...]
var team_names = [];
// [date1, date2, date3, ...]
var dates = [];
// {team1: {wins: n, losses: m, ...}, team2: ...}
var team_wins;
// [{x: date1, y: ratio1}, {x: date2, y: ratio2}, ...]
var display_data = [];
var value;

var parseDate = d3.timeParse("%m/%d/%Y");

var lmargin = {top: 20, right: 40, bottom: 10, left: 40};
var lwidth =  $(document).width()/ 2;
var lheight = 250;


// instantiates the line chart
var lineChartSVG = d3.select("#left").append("svg")
	    .attr("width", lwidth+lmargin.left+lmargin.right)
	    .attr("height", lheight+lmargin.top+lmargin.bottom);

console.log(lwidth)


//relevant scales

var xScale = d3.scaleTime()
	    .range([lmargin.left, lwidth-lmargin.right]);

var yScale = d3.scaleLinear()
	    .range([lmargin.bottom, lheight-lmargin.top]);

var xScaleBar = d3.scaleBand()
	    .rangeRound([lmargin.left, lwidth])
		.paddingInner(.3);

var yScaleBar = d3.scaleLinear()
		.domain([0,75])
	    .range([lheight, 0]);

var xAxis = lineChartSVG.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate("+ 0 +", "+ (lheight-lmargin.top) +")");

var yAxis = lineChartSVG.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", "translate("+ lmargin.left +", "+ 0 +")");

var colorPalette = ["#57CE36","#57CE36","#D42B42","#57CE36","lightgray"]

d3.select(".form-control-lineA").on("change", updateLineChart);
d3.select(".form-control-lineB").on("change", updateLineChart);

// reformat and initialize the data
reformatData();

// fill options in line chart selection box 
function initInteractive(team_names) {
	for(var i = 0; i < team_names.length; i++){

		var selectionBox = document.getElementById("team-name");
		var option = document.createElement("option");
		option.text = team_names[i];
		option.value = team_names[i];
		selectionBox.add(option);

	}
}

// split dates from original dataset for date parsing
function splitDate(date){
	var year_monthday = date.match(/.{1,4}/g);
	var month_day = year_monthday[1].match(/.{1,2}/g);

	var year = year_monthday[0];
	var month = month_day[0];
	var day = month_day[1];

	//console.log(year, month, day);

	return(month + "/" + day + "/" + year)
}

// get the win loss ratio data given the game data
function getwlRatio(gameData){

	wlratioDataOut2 = {};

	for(var team in gameData){

		wl_ratio_data = {};

		winNum = 0.0;
		gameNum = 0.0;

		for(var date in gameData[team]) {


			if(gameData[team][date] == 1){
				winNum += 1
			}

			gameNum += (+gameData[team][date])**2;

			wl_ratio_data[date] = winNum/gameNum;
		}

		wlratioDataOut2[team] = wl_ratio_data;
	}

	return wlratioDataOut2;
}

//reformat data set
function reformatData(){
	var foo = "foofaa";

	var tempData = {};
	var tempTeamWins = [];

	d3.csv("data/game_logs.csv", function(data, csv){

		csv.forEach(function(d){

			var dateFormatted = splitDate(d.date);

			if(!(dates.includes(dateFormatted))){

				dates.push(dateFormatted);
			}
			if(!(team_names.includes(d.h_name))){

				team_names.push(d.h_name);
			}
			if(!(d.v_name in tempTeamWins)){

				tempTeamWins[d.v_name] = {wins:0, losses:0};
			}
			if(!(d.h_name in tempTeamWins)){
				tempTeamWins[d.h_name] = {wins:0, losses:0};
			}

			if(!(d.h_name in tempData)){

				var newVGame = {}
				var newHGame = {}
				if(d.v_score > d.h_score){
					tempTeamWins[d.v_name]["wins"] += 1;
					tempTeamWins[d.h_name]["losses"] += 1;

					newVGame[dateFormatted] = 1;
					newHGame[dateFormatted] = -1;
				}
				else{

					newVGame[dateFormatted] = -1;
					newHGame[dateFormatted] = 1;
				}

				tempData[d.v_name] = newVGame;
				tempData[d.h_name] = newHGame;
			}
			else {

				if(d.v_score > d.h_score){
					tempTeamWins[d.v_name]["losses"] += 1;
					tempTeamWins[d.h_name]["wins"] += 1;

					tempData[d.v_name][dateFormatted] = 1;
					tempData[d.h_name][dateFormatted] = -1;
				}
				else{
					tempData[d.v_name][dateFormatted] = -1;
					tempData[d.h_name][dateFormatted] = 1;
				}
			}

		});

		team_wins = tempTeamWins;
		game_data = tempData;

		wl_ratio_data = getwlRatio(game_data);



		//initInteractive(team_names);
		updateLineChart();
		drawLegend();

	});


}
function drawLegend() {
	var LegendGroup = lineChartSVG.append("g")
		.attr("class", "drawLegendGroup")

	LegendGroup.append("circle")
		.attr("cx", function(d){
			return 3*lwidth/4;
		})
		.attr("cy", function(d){
			return lheight/4;
		})
		.attr("r", 3)
		.attr("fill", function(d){
			return colorPalette[2];
		});

	LegendGroup.append("circle")
		.attr("cx", function(d){
			return 3*lwidth/4;
		})
		.attr("cy", function(d){
			return lheight/4+20;
		})
		.attr("r", 3)
		.attr("fill", function(d){
			return colorPalette[3];
		});

	/*
	LegendGroup.append("circle")
		.attr("cx", function(d){
			return 3*width/4;
		})
		.attr("cy", function(d){
			return height/4+40;
		})
		.attr("r", 3)
		.attr("fill", function(d){
			return colorPalette[4];
		});
	*/

	LegendGroup.append("text")
		.attr("x", function(d){
			return 3*lwidth/4+10;
		})
		.attr("y", function(d){
			return lheight/4+25;
		})
		.text("Win");

	LegendGroup.append("text")
		.attr("x", function(d){
			return 3*lwidth/4+10;
		})
		.attr("y", function(d){
			return lheight/4+5;
		})
		.text("Loss");

}
// update and draw the line chart
function updateLineChart(d) {

	//var value = d3.select("#team-name").property("value");
	var value = globalTeamName;

	var dataCat = d3.select("#chart-data").property("value");


	var display_data = [];

	for(var i = 0; i < dates.length; i++){
		var currentPoint = {};
		currentPoint['x'] = dates[i];

		currentPoint['y'] = wl_ratio_data[value][dates[i]];
		
		display_data.push(currentPoint);
	}



	dataUpdate = lineChartSVG.selectAll("#datapoint").data(display_data, function(d) { return d.x; });

	xScale.domain([parseDate(dates[0]), parseDate(dates[dates.length-1])]);
	yScale.domain([1,0]);

	function yScaleReturn(d){
		if(dataCat == "wlRatio"){
			if (isNaN(d.y)){
				return yScale(1);
			}
			else
			{
				return yScale(d.y);
			}
		}
		else if(dataCat == "WinLoss"){
			if (game_data[value][d.x] == 1){
				return yScale(1);
			}
			else if (game_data[value][d.x] == -1)
			{
				return yScale(0);
			}
			else{
				return yScale(.5);
			}
		}
	}

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.style('z-index', '99999999999')
        .offset([-10, 0])
        .html(function(d) {
        	var date = d.x
        	var yVal = d.y
    		return "<span>" +
    			"Date: " + d.x + "</br>" +
    			"Win Loss Ratio: " + d.y.toFixed(4) + "</br>" +
    			"</span>";
		});
				
	lineChartSVG.call(tip);	

	dataUpdate.enter()
		.append("circle")
		.merge(dataUpdate)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.transition()
		.duration(800)
		.attr("id", "datapoint")
		.attr("cx",function(d){
			return xScale(parseDate(d.x))
		})
		.attr("cy", function(d){
			var returnVal = yScaleReturn(d);
			return returnVal
		})
		.attr("r", 3)
		.attr("fill", function(d){
			if (game_data[value][d.x] == 1){
				return colorPalette[3];
			}
			else if (game_data[value][d.x] == -1)
			{
				return colorPalette[2];
			}
			else{
				return "white";
			}
		});

	/*
	var line = d3.line()
	    .x(function(d) {
	    	//console.log("d.x", vis.xScale(parseDate(d.x)))
			return xScale(parseDate(d.x));
	    })
	    .y(function(d) {
	    	return yScaleReturn(d);
	    });

	var lineUpdate = lineChartSVG.selectAll(".line")
		.data(display_data)
		.attr("class","line");

	lineUpdate.enter()
		.append("path")
		.merge(lineUpdate)
	    .attr("class","line")
	    .attr("d",line)
	    .attr("stroke","blue")
	    .attr("stroke-width", 2);
	*/


	xAxis = d3.axisBottom().scale(xScale);
	yAxis = d3.axisLeft().scale(yScale);

	lineChartSVG.select(".x-axis").call(xAxis);
	lineChartSVG.select(".y-axis").call(yAxis);

	dataUpdate.exit().remove();
}

