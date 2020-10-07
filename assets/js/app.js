// set parameters/spacing
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 40,
  bottom: 100,
  left: 85
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg to the html page
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class","chart");

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import Data
d3.csv("assets/data/data.csv").then(function(data) {

    data.forEach(function(data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.state = +data.state;
    });

    // create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.income)-2000, d3.max(data, d => d.income)+2000])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.obesity)-3, d3.max(data, d => d.obesity)+3])
      .range([height, 0]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axises to chart
    chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chart.append("g")
      .call(leftAxis);

    // create circle/markers/scatterplots
    var circles = chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "8")
    .attr("fill", "red")
    .attr("opacity", ".65");

    // Create axes labels
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity in BMI");

    chart.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Income ($$$)");

    // append tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-8, 0])
      .html(function(data) {
        return (`${data.state}`)});
    
    chart.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

}).catch(function (error) {
      console.log(error);
    });


