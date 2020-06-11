// @TODO: YOUR CODE HERE!
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
  var svgWidth = parseInt(d3.select("#scatter").style("width"));
  var svgHeight = svgWidth - svgWidth/4;


  var margin = { top: 50, right: 50, bottom: 50, left: 50 };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("data/data.csv").then(function (healthData) {

    healthData.forEach(function (data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
    });

  var xmin = d3.min(healthData, d => {
    return parseFloat(d.income) * 0.9;});

  var xmax = d3.max(healthData, d => {
      return parseFloat(d.income) * 1.1;});

  var ymin = d3.min(healthData, d => {
          return parseFloat(d.obesity) * 0.9;});

  var ymax = d3.max(healthData, d => {
      return parseFloat(d.obesity) * 1.1;});

    var xLinearScale = d3.scaleLinear()
      .domain([xmin, xmax])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([ymin, ymax])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter();

      circlesGroup
      .append("circle")
      .attr("cx", d => xLinearScale(d.income))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "15")
      .attr("class", "stateCircle")
      .on("click", function (data) { toolTip.show(data, this); })
      //.on("mouseover", function(data) {toolTip.show(data, this);})
      // onmouseout event
      .on("mouseout", function (data, index) { toolTip.hide(data); });


      circlesGroup
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d.income))
      .attr("dy", d => yLinearScale(d.obesity) + 15 / 2.5)
      .attr("class", "stateText")
      .on("click", function (data) { toolTip.show(data, this); })
      //.on("mouseover", function(data) {toolTip.show(data, this);})
      // onmouseout event
      .on("mouseout", function (data, index) { toolTip.hide(data); });

    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function (d) {
        return (`<br>State: ${d.state}<br>Income: $${d.income}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create axes labels
    chartGroup.append("text")
      // NOTE: Rotated Y axis label
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height - margin.top + 80})`)
      .attr("y", 0)
      .attr("class", "axisText")
      .text("($)Income");
  }).catch(function (error) {
    console.log(error);

  });
}
makeResponsive();
