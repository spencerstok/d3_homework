//Set image width and height
var svgWidth = 960;
var svgHeight = 500;
//Set Margins
var margin = {
  top: 30,
  right: 30,
  bottom: 70,
  left: 100
};

//Set width and height variables
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Read Csv data in
d3.csv("assets/data/data.csv").then(function(Data){

// Get specific datapoints from csv
  Data.forEach(function(data) {
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;
});

// Scale for adjusting size up and down
var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(Data, d => d.poverty))
  .range([0, width]);
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(Data, d => d.smokes)])
  .range([height, 0]);

// Set axis to scale
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Add the axis stuff to the chart
chart.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chart.append("g")
  .call(leftAxis);

// Create circles
var circlesGroup = chart.selectAll("Circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "15")
  .attr("fill", "gray")
  .attr("opacity", "0.4");

var circleLabels = chart.selectAll(null).data(Data).enter().append("text");

//Add labels within Circles
circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.poverty);
  })
  .attr("y", function(d) {
    return yLinearScale(d.smokes);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-size", "9px")
  .attr("text-anchor", "middle")
  .attr("fill", "black");

// Create axes labels
chart.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 60)
  .attr("x", 0 - (height / 2))
  .attr("class", "axisText")
  .text("Smoking (%)");

chart.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
  .text("In Poverty (%)");

});