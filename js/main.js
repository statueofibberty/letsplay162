//Width and height of map
var width =  $(document).width();
if(width < 550){
    width = 550;
}
var height = 400;

var lowColor = '#f9f9f9'
var highColor = '#bc2a66'

var globalTeamName = "KCA"
var globalTeamID = 118;
var globalTeamFull = "Kansas City Royals";

// D3 Projection
var projection = d3.geoAlbersUsa()
    .translate([(width/ 2) - (width/4), height / 2]) // translate to center of screen
    .scale([700]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection


main();

//Create SVG element and append map to the SVG
var svg;
var div;
var jsonDataPlayers;
var chartData = [];
var chartName = [];

//when clicked, this creates the roster

function roster(overall) {
    d3.json("http://lookup-service-prod.mlb.com/json/named.roster_team_alltime.bam?start_season='2016'&end_season='2016'&team_id='"+overall.id+"'", function(json){
        json = json.roster_team_alltime.queryResults.row


        d3.select("svg").selectAll("*").remove();
        d3.select("#first-title").selectAll("*").remove();
        d3.select("#textDescription").selectAll("*").remove();

        // appends the text to the svg and the relevant parts
        var text = d3.select("#first-title");
        text.append("h4")
            .style("font-weight", "bold")
            .text("The " + overall.name + "\n:                                                       [Click to Return]")
            .on("click", function(d){
                d3.select("#canvas2").style("border", "2px solid black");
                $("#canvas2").hide();
                $("#canvas3").hide();

                d3.select("#canvas").selectAll("*").remove();
                d3.select("#canvas").html(" <div class=\"col-md-10 col-xs-10\">\n" +
                    "                <div id = \"first-title\">\n" +
                    "                    <h4 style='text-indent: 100px;'>Let's start by looking at all the teams in the 2016 Season: </h4>\n" +
                    "                    <p></p>\n" +
                    "                </div>\n" +
                    "                <div class=\"scaling-svg-container\" id = \"svgrMain\">\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "            <div class=\"col-md-2 col-xs-2\">\n" +
                    "                <div id=\"textDescription\">\n" +
                    "                    <h3> Teams at-a-glance </h3>\n" +
                    "\n" +
                    "                    <p> Baseball is one of America's favorite pastimes. From The San Francisco Giants to the New York Yankees, these teams have diverse players hailing from all around the world -\n" +
                    "                        click on any of the cities to get more information about the teams and their respective 2016 rosters.</p>\n" +
                    "                </div>\n" +
                    "            </div>");

            main()
            });

        //appends the dynamic descriptor text to the svg

        var desctext = d3.select("#textDescription");

        desctext.append("h3")
            .style("font-weight", "bold")
            .text("The " + overall.shortname + "' Franchise:");

        desctext.append("p")
            .style("font-size", "16px")
            .text("The " + overall.shortname +", originally hailing from "+ overall.city +", "+ overall.state+ ", are one of the great franchises of the "+ overall.league +". Having started play in "+ overall.first_year +", they've enjoyed a " +
                "long career playing at "+ overall.venue +". For more information about the "+ overall.shortname +", head over to " + overall.url );

        desctext.append("h4")
            .style("font-weight", "bold")
            .text("Legend:");

        desctext.append('desctext:img')
            .attr("src", "img/legend.png")


        //counter to make the rectangles change rows
        var ycood = 1;
        var counter = 0;
        var chartCounter = 0;

        //append rectangles
        var rectangles = d3.select("#svgrMain").select("svg")
            .data(json.filter(function(d, i){
                if(d.position_desig != "PITCHER"){
                    if(d.length > 1){
                        var chartIn = binaryIndexOf(d[0].player_id);
                    }else {
                        var chartIn = binaryIndexOf(d.player_id);
                    }

                        var dataIn = [[
                                    {axis: "Home Runs", value: chartIn.hr / 47},
                                    {axis: "Bat Avg", value: chartIn.avg},
                                    {axis: "RBI", value: chartIn.rbi / 130},
                                    {axis: "% Games Played", value: chartIn.g / 162},
                                    {axis: "Slugging Avg", value: chartIn.slg}
                        ]];

                    chartData[chartCounter] = dataIn;
                    chartName[chartCounter] = d.name_first_last;
                    chartCounter++;
                }
            }))
        svg.attr("height", 0)
        lineChartSVG.style("opacity", 1)

        finishHim();

            })



}


//create the radarchart!
function finishHim(){
    var chartIn = [];
    div.transition()
        .duration(500)
        .style("opacity", 0);

    d3.select('#svgrMain').select("svg").remove();

    for(m = 0; m < chartData.length; m++){
        d3.select('#svgrMain').append('svg').attr("id", "chart" + m).attr('width', 200)
            .attr('height', 190).attr("class", "radarBox");

        var radarChartOptions = {
            w: 80,
            h: 80,
            margin: 5,
            maxValue: 1,
            levels: 3,
            roundStrokes: false,
            color: "#B4E83A"
        };

        RadarChart("#chart" + m, chartData[m] ,radarChartOptions, chartName[m]);
    }
}

function main() {

    svg = d3.select("#svgrMain")
        .append("svg")
        .attr("width", width/1.8)
        .attr("height", height);

    div = d3.select("#svgrMain")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// Load in my states data!
    d3.csv("mlbteams.csv", function (data) {
        var dataArray = [];
        for (var d = 0; d < data.length; d++) {
            dataArray.push(parseFloat(data[d].value))
        }
        var minVal = d3.min(dataArray)
        var maxVal = d3.max(dataArray)
        var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])



        // Load GeoJSON data and merge with states data
        d3.json("us-states.json", function (json) {

            d3.json("data/data_file.json", function (json) {

                jsonDataPlayers = json.sort(function (a, b) {
                    return +a[0] - +b[0];
                })
            });

            // Bind the data to the SVG and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#000000")
                .style("stroke-width", "1")
                .style("fill", "white");

            // add a legend
            var w = 140, h = 300;


            var y = d3.scaleLinear()
                .range([h, 0])
                .domain([minVal, maxVal]);

            var yAxis = d3.axisRight(y);

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    // console.log(d.long);
                    return projection([d.long, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.long, d.lat])[1];
                })
                .attr("r", function (d) {
                    return 6;
                })
                .style("fill", "#B4E83A")
                .style("opacity", 0.95)
                .style("stroke", "#57CE36")
                .style("stroke-width", 2)
                .on("click", function (d) {
                    $("#canvas2").show();
                    $("#canvas3").show();
                    roster(d);
                    globalTeamName = d.team_two;
                    globalTeamID = d.id;
                    globalTeamFull = d.name;

                    updateLineChart();
                    updatePlayers();
                })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.text("The " + d.name)
                        .style("left", (d3.event.pageX - 400) + "px")
                        .style("top", (d3.event.pageY - 500) + "px");
                })

                // fade out tooltip on mouse out
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });


        });


    });

    $("#canvas2").hide();
    $("#canvas3").hide();
}

//creates binary index
function binaryIndexOf(searchElement){
    'use strict';

    var minIndex = 0;
    var maxIndex = jsonDataPlayers.length-1;
    var currentIndex;
    var currentElement;

    while(minIndex <= maxIndex){
        currentIndex = (minIndex + maxIndex)/2 | 0;
        currentElement = jsonDataPlayers[currentIndex][0];
        var currentOut = jsonDataPlayers[currentIndex][1].row;

        if(currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }else if(currentElement > searchElement){
            maxIndex = currentIndex - 1;
        }else if(currentElement == searchElement){
            if(currentOut.length > 1){
                return currentOut[0]

            }else{
                return currentOut;
            }
        }
    }
    return -1

}