// SVG container
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// chart used for text labels
var new_chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data
d3.csv("/data/data.csv", function(error, healthData){
  if (error) throw error;

  // Parse data
  var states = healthData.map(data => data.state);
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthCare = +data.healthcare;
  });

// scale y to chart height
var yScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d.healthCare+1)])
  .range([height, 0]);

// scale x to chart width
var xScale = d3.scaleLinear()
  .domain([d3.min(healthData, d=>d.poverty-1), d3.max(healthData, d=>d.poverty -1)])
  .range([0, width]);

// create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

// Set X to the bottom of the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

// Set Y to the left of the chart
chartGroup.append("g")
  .call(yAxis);

// Append data to chartGroup
chartGroup.selectAll(".chart")
  .data(healthData)
  .enter()
  .append("data")

// X Label
chartGroup.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width-(width*.5))
  .attr("y", height+(height*.10))
  .text("In Poverty (%)")

// Y Label
chartGroup.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("x", width - (width*1.12))
  .attr("y", height - (height*1.1))
  .attr("transform", "rotate(-90)")
  .text("Lacks Healthcare (%)")


// Create circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yScale(d.healthCare))
  .attr("r", "10")
  .attr("fill", "lightblue")
  .attr("opacity", ".9");

// Add labels to each point
var labels = new_chartGroup.selectAll("text")
  .data(healthData)
  .enter()
  .append("text")
  .attr("x", d => xScale(d.poverty-0.1))
  .attr("y", d => yScale(d.healthCare-0.1))
  .attr("font-size", "10px")
  .attr("fill", "white")
  .text(d=>d.abbr);
});