# Readme - Let's Play 162

### Overview

For this project, Nick Sundberg, Simon Sun, Eli Shieber and Ibby Syed worked together to come together and tell a story about baseball. As fans of the Chicago Cubs, we focused our data on the 2016 season, one that the Cubs won after 108 years of drought. The website, found [here](statueofibberty.github.io/letsplay162) includes three visualizations: 
 
 - Map selector: choose any team in the MLB and get a dynamic overview with radar charts of each player's stats. There's also a dynamic descriptor on the right that talks about where the team plays and how long they've been in the MLB.
 - Win/Loss: When you select a team on the top, take a look at the different wins and losses throughout the season, and also the ratio
 - Player Stats: For all the wins, take a look at how each individual player contributed
 
### File overlay
In the root directory, all of the included data:

- index.html: webpage
- simondata.py: where the data for the third visualization was scraped from (written by us)
- us-states.json: not our data, this is the JSON file to draw the US states

In the /js directory, all of the included data:

- d3, popper, and jquery are not libraries included by us. 
- main.js: this is the first visualization
- main2.js: this is the second visualization
- player.js: this is the third visualization
- table.js: this is not created by us
- radar-chart.js: library to create the radarchart in the first visualization

### Data overlay

In the /data directory, all of the included data:

- all of the included datasets were scraped by us, either off of the [MLB Data API](https://appac.github.io/mlb-data-api-docs/#team-data-list-teams-get), [Baseball Reference](baseballreference.com), or the [Sportsradar Dataset](https://www.kaggle.com/sportradar/baseball).

### Links: 

-Site: statueofibberty.github.io/letsplay162
-Screencast: https://youtu.be/7jwmXb204wQ






