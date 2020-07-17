var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/assets/data/data.csv").then(function(healthRisk) {
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    
    healthRisk.forEach(d=> {
      d.healthcare = +d.healthcare;
      d.poverty = +d.poverty
    });


    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthRisk, d => d.poverty)])
      .range([0,width]);

    let yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthRisk, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================

    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform",`translate(0,${height})`)
      .call(xAxis);
    
    chartGroup.append("g")
      .call(yAxis)

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
      .data(healthRisk)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "steelblue")
      .attr("stroke-width", "1")
      .attr("stroke", "white");
    
    let labels = chartGroup.selectAll(null)
      .data(healthRisk)
      .enter()
      .append("text")
      .attr("x", function(d) {return xLinearScale(d.poverty)})
      .attr("y", function(d) {return yLinearScale(d.healthcare)})  
      .text(d => d.abbr)
      .attr("font-family", "sans-serif")
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");


    // Step 6: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([8, -6])
      .html(function(d) {
      return (`State: ${d.state} <br> 
              Income: ${d.income} <br>
              Poverty: ${d.poverty} <br> 
              Healthcare: ${d.healthcare} <br>
              Obesity: ${d.obesity} <br>
              Smoke: ${d.smokes} <br>
              `);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover",d=>{
      toolTip.show(d,this)
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate (%)");

  }).catch(function(error) {
    console.log(error);
  });
