function render_bar_chart(result){

    let content = result.content.slice(1,11);
    let gender = result.gender;

    var width = 0.9*window.innerWidth;
    var height = 0.7*window.innerHeight;
    var transition_duration = 200;

    var margin = {top: 0, right: width/4, bottom: 50, left: width/3, bottom_label_buffer: 70},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var sequentialScale = d3.scaleSequential()
                            .domain([d3.max(content, function(d){ return d.sum_renumeration}), 0])
                            .interpolator(d3.interpolateMagma);

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
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .attr('font-size', '1.0em');

    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(content.map(function(d) { return d.department; }))
        .padding(.1);
        svg.append("g")
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

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(content)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("width", 0)
          .attr("y", function(d) { 
            return y(d.department); 
          })
          .attr("height", y.bandwidth())
          .transition()
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

    // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + margin.bottom_label_buffer) + ")")
      .style("text-anchor", "middle")
      .text("Renumeration (CAD$)")
      .attr('font-size', '1.0em');;
}

