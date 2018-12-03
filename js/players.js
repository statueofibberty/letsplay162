
// playerssvg drawing area

var pmargin = {top: 10, right: 10, bottom: 30, left: 10};


var pwidth =  $(document).width() / 2.7;
var pheight = 600;

var playerssvg = d3.select("#players").append("svg")
	.attr("width", pwidth * 2+ pmargin.left + pmargin.right)
	.attr("height", pheight + pmargin.top + pmargin.bottom)
	.append("g")
	.attr("transform", "translate(" + $(document).width() / 8 + "," + pmargin.bottom + ")");

// Initialize data
loadData();
var data;

var val = d3.select("#select-box").property("value");
var colors = ["#57CE36", "#B4E83A", "#EBD12A", "#D42B42"];

px = d3.scaleLinear()
    .range([0, pwidth]);

py = d3.scaleBand()
    .rangeRound([0, pheight-20])
    .paddingInner(0.2);

pxAxis = d3.axisBottom()
    .scale(px);

pyAxis = d3.axisLeft()
    .scale(py);



// Load CSV file
function loadData() {
	d3.csv("data/allplayers.csv", function(error, csv) {

		csv.forEach(function(d){
            d.G = +d.G;
            d.Batting = +d.Batting;
            d.Defense = +d.Defense;
            d.P = +d.P;
            d.WAR = +d.WAR;
            d.Team = +d.Team;
        });

		// Store csv data in global variable
        data = csv;

		// Draw the visualization for the first time
		updatePlayers();
	});
}


// Render visualization
function updatePlayers() {

    val = d3.select("#select-box").property("value");
    team = globalTeamID;

    // Filter players by team
    displayData = data.filter ((d) => {
        return d.Team == team;
    })
    
    // Sort filtered data by value
    if (val == "games") {
        displayData.sort((a, b) => {
            return b.G - a.G;
        });
    } else if (val == "bat") {
        displayData.sort((a, b) => {
            return b.Batting - a.Batting;
        });
    } else if (val == "def") {
        displayData.sort((a, b) => {
            return b.Defense - a.Defense;
        });
    } else if (val == "pitch") {
        displayData.sort((a, b) => {
            return b.P - a.P;
        });
    } else {
        displayData.sort((a, b) => {
            return b.WAR - a.WAR;
        });
    }

	px.domain([0, d3.max(displayData, (d) => { 
		if (val == "games") {
            return d.G;
        } else if (val == "bat") {
            return d.Batting;
        } else if (val == "def") {
            return d.Defense;
        } else if (val == "pitch") {
            return d.P;
        } else {
            return d.WAR;
        };
    })]);
    
    py.domain(d3.range(0,displayData.length));

    // Bars
	var bars = playerssvg.selectAll(".bar")
        .data(displayData);

    bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .attr("width", function(d){
            if (val == "games") {
                return px(d.G);
            } else if (val == "bat") {
                return px(d.Batting);
            } else if (val == "def") {
                return px(d.Defense);
            } else if (val == "pitch") {
                return px(d.P);
            } else {
                if (d.WAR >= 0) {
                    return px(d.WAR);
                } else {
                    return px(0);
                }
            } 
        })
        .attr("height", py.bandwidth())
        .attr("x", 0)
        .attr("y", function(d, index){
            return py(index);
        })
        .attr("fill", (d) => {
            if (val != "war") {
                let stat;

                if (val == "games") {
                    stat = d.G;
                } else if (val == "bat") {
                    stat = d.Batting
                } else if (val == "def") {
                    stat = d.Defense;
                } else {
                    stat = d.P;
                }

                if (stat > 0.75 * 162) {
                    return colors[0];
                } else if (stat > 0.5 * 162) {
                    return colors[1];
                } else if (stat > 0.25 * 162) {
                    return colors[2];
                } else {
                    return colors[3];
                }
            } else {
                if (d.WAR >= 5) {
                    return colors[0];
                } else if (d.WAR > 2) {
                    return colors[1];
                } else {
                    return colors[2]
                }
            } 
        });

    bars.exit().remove();

    // Labels
    var labels = playerssvg.selectAll(".text")
        .data(displayData);

    labels.enter().append("text")
        .attr("class", "text")
        .merge(labels)
        .transition()
        .text((d) => {
            if (val == "games") {
                return d.G;
            } else if (val == "bat") {
                return d.Batting;
            } else if (val == "def") {
                return d.Defense;
            } else if (val == "pitch") {
                return d.P;
            } else {
                return d.WAR;
            }
        })
        .attr("x", (d) => {
            let pos;

            if (val == "games") {
                pos = px(d.G);
            } else if (val == "bat") {
                pos = px(d.Batting);
            } else if (val == "def") {
                pos = px(d.Defense);
            } else if (val == "pitch") {
                pos = px(d.P);
            } else {
                if (d.WAR >= 0) {
                    pos = px(d.WAR);
                } else {
                    pos = px(0);
                }
            } 

            return pos + 8;
        })
        .attr("y", function(d, index){
            return py(index) + (py.bandwidth() / 2);
        })
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", (d) => {
            if (val == "war" && d.WAR < 0) {
                return colors[3];
            } else {
                return "black";
            }
        });

    labels.exit().remove();
    
    playerssvg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (pheight-20) + ")");

    playerssvg.append("g")
        .attr("class", "y-axis axis");

    // Call axis function with the new domain
    playerssvg.select(".x-axis").call(pxAxis);
    
    // Adjust axis labels
    playerssvg.select(".y-axis").call(pyAxis)
        .selectAll("text")
        .data(displayData)
        .text((d) => {
            return d.Name;
        });

    var newplayerssvg = d3.select("#players").transition();
    
    newplayerssvg.select(".x-axis") // change the x axis
        .duration(800)
        .call(px);
    newplayerssvg.select(".y-axis") // change the y axis
        .duration(750)
        .call(py);

    // Draw Legend
    playerLegend(val);

    // Update labels
    d3.select("#pHead").text(globalTeamFull);
    d3.select("#teamSelected").text(globalTeamFull);
    d3.select("#pDescription").text(() => {
        if (val == "war") {
            return "WAR represents the number of wins the player added to the team above what a replacement player would add."
        } else {
            return "Out of 162 games of the regular season."
        }
    });
}


// creates legend
function playerLegend(val) {

    console.log(val);

    var pLegend = playerssvg.selectAll(".pLegend")
        .data(colors);

    pLegend.enter().append("text")
        .attr("class", "pLegend")
        .attr("x", 3*pwidth/5+10)
        .merge(pLegend)
        .attr("y", function(d, index){
            return 3*pheight/4+5 + (20*index);
        })
        .text(function(d, index) {
            if (val == "war") {
                console.log("yeet");
                if (index == 0) {
                    return "5.0+ (All-Star level)";
                } else if (index == 1) {
                    return "2.1 - 4.9 (Starter level)";
                } else if (index == 2) {
                    return "0.0 - 2.0 (Reserve level)";
                } else {
                    return "Negative WAR (Replacement level)";
                }
            } else {
                if (index == 0) {
                    return "75% of games or more";
                } else if (index == 1) {
                    return "50% - 74% of games";
                } else if (index == 2) {
                    return "25% - 49% of games";
                } else {
                    return "less than 24% of games";
                }
            }
        });

    pLegend.exit().remove();

    var pLegendC = playerssvg.selectAll(".pLegendC")
        .data(colors);

    pLegendC.enter().append("circle")
    .attr("class", "pLegendC")
    .attr("cx", function(d){
        return 3*pwidth/5;
    })
    .attr("r", 5)
    .merge(pLegendC)
    .attr("cy", function(d, index){
        return 3*pheight/4 + (index * 20);
    })
    .attr("fill", function(d){
        return d;
    });

    pLegendC.exit().remove();
	
}