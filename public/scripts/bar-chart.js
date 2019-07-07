function render_bar_chart(result){

    let content = result.by_department;
    let gender = result.gender.toUpperCase();

    var width = window.innerWidth;
    var height = 0.65*window.innerHeight;
    var transition_duration = 200;
    var gender_highlight_colors = {male: "#b1e7e5", androgynous: "#d9d9d9", unknown: "#d0e9af", female: "#f6a2a6"};
    var gender_colors = {male: "#8cdcda", androgynous: "#d9d9d9", unknown: "#afd977", female: "#f16970"};

    $("#bar-chart-header").html(`
        <h2>Top 10 Most Highly Paid Departments</h2>
        <h3><span style='background-color: ${gender_highlight_colors[gender.toLowerCase()]}'><b>${gender}</b> GENDER FACULTY</span></h3>
    `);

    var margin = {top: window.innerHeight*0.05, right: width/4, bottom: window.innerHeight*0.05, left: width/3, bottom_label_buffer: window.innerHeight*0.05},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var sequentialScale = d3.scaleLinear()
                            .domain([d3.max(content, function(d){ return d.sum_renumeration}), d3.min(content, function(d){ return d.sum_renumeration})])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.hcl("#000000"), d3.hcl(gender_colors[gender.toLowerCase()])]);


    var graph = d3.select("#bar-graph")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom + margin.bottom_label_buffer)
    var svg   = graph.append("g")
                     .attr("transform",
                           "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(content, function(d){ return d.sum_renumeration})])
        .range([ 0, width]);
    
    // Format x-axis labels
    var x_axis = svg.append("g")
        .attr('id', 'x-axis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        x_axis.selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .attr("class", "x-axis-label")
          .style("text-anchor", "end")
          .attr('font-size', '1.0em');

    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(content.map(function(d) { return d.department; }))
        .padding(.1);

    // Add y-axis
    var y_axis = svg.append("g")
        .attr('id', 'y-axis')
        .call(d3.axisLeft(y))
        .selectAll(".tick")
            .each(function(d){
            d3.select(this)
              .attr("opacity", 0)
              .select("text")
               .attr('font-size', '1.5em')
            });

    // Transition effect on y-axis ticks
    d3.selectAll('#y-axis .tick').each(function (d, i) {
        d3.select(this)
          .transition()
          .duration(transition_duration)
          .delay(function (d){
            return i * transition_duration;
          })
          .attr("opacity", 1)
    });

    // Remove y-axis paths
    $("#y-axis .domain").remove();
    //$("#x-axis").remove();

    // Outer g container for bars
    var g_bars = svg.selectAll(".bar")
        .data(content)
        .enter()
        .append("g");

    // Add bars to each g container
    var bars = g_bars.append("rect")
          .attr("class", "bar")
          .attr("width", 0)
          .attr("y", function(d) { 
            return y(d.department); 
          })
          .attr("height", y.bandwidth())

    // Add transition on bars
    bars.transition()
            .duration(transition_duration)
            .delay(function (d, i) {
                return i * transition_duration;
            })
          .attr("width", function(d) {
            return x(d.sum_renumeration); 
          })
          .attr("fill", function(d) {
            return sequentialScale(d.sum_renumeration)
          })
          .attr("y", function(d) { 
            return y(d.department); 
          })
       
    // Add text on g container 
    // g_bars.append("text")
    //     .attr("class", "y-axis-label")
    //     //y position of the label is halfway down the bar
    //     .attr("y", function (d) {
    //         return y(d.department) + y.bandwidth() / 2 + 4;
    //     })
    //     //x position is 3 pixels to the right of the bar
    //     .attr("x", function (d) {
    //         return x(d.sum_renumeration) + 3;
    //     })
    //     .style("opacity", 0)
    //     .transition()
    //         .duration(transition_duration)
    //         .delay(function (d, i) {
    //             return i * transition_duration;
    //         })
    //         .style("opacity", 1)
    //         .text(function (d) {
    //             return d.sum_renumeration;
    //         });

    // // text label for the x axis
    // svg.append("text") 
    //     .attr('id', 'x-axis-label')           
    //   .attr("transform",
    //         "translate(" + (0) + " ," + 
    //                        (0) + ")")
    //   .style("text-anchor", "middle")
    //   .text("Renumeration (CAD$)")
    //   .attr('font-size', '1.0em'); 

    // var x_axis_label = document.getElementById("x-axis-label").getBoundingClientRect();
    // var x_axis_label_width = x_axis_label.width; 

    // var y_axis_height = document.getElementById("y-axis").getBBox().height;

    // $("#x-axis-label").attr("transform", "translate(" + ((-0.5)*x_axis_label_width-0.03 *window.innerWidth) + ", " + (y_axis_height + 0.075 * window.innerHeight) + ")");
}

