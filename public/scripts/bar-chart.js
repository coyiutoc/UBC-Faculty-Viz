function render_bar_chart(result){

    $('#dept-button').on("click", function(){ 
       $(this).attr('class', 'btn btn-dark active toggle-button');
       $('#pos-button').attr('class', 'btn btn-outline-dark toggle-button');
       $('#bar-chart-title').html("Top 10 Most Highly Paid Departments");
       // $('#bar-graph-x-label').html("Sum Renumeration ($CAD)");
       update("department");
    });

    $('#pos-button').on("click", function(){ 
       $(this).attr('class', 'btn btn-dark active toggle-button');
       $('#dept-button').attr('class', 'btn btn-outline-dark toggle-button');
       $('#bar-chart-title').html("Top 10 Most Highly Paid Positions");
       // $('#bar-graph-x-label').html("Average Salary ($CAD)");
       update("position");
    });

    let dept_content = result.by_department;
    let pos_content = result.by_position;
    let gender = result.gender.toUpperCase();

    var width = window.innerWidth;
    var height = 0.65*window.innerHeight;
    var transition_duration = 200;
    var gender_highlight_colors = {male: "#b1e7e5", androgynous: "#d9d9d9", unknown: "#d0e9af", female: "#f6a2a6"};
    var gender_colors = {male: "#8cdcda", androgynous: "#d9d9d9", unknown: "#afd977", female: "#f16970"};

    $("#bar-chart-header").html(`
        <h2><div id='bar-chart-title'>Top 10 Most Highly Paid Departments</div></h2>
        <h3><span style='background-color: ${gender_highlight_colors[gender.toLowerCase()]}'><b>${gender}</b> GENDER FACULTY</span></h3>
    `);

    $('#bar-graph-x-label').html("Sum Renumeration ($CAD)");

    var margin = {top: window.innerHeight*0.05, right: width/4, bottom: window.innerHeight*0.05, left: width/3, bottom_label_buffer: window.innerHeight*0.05},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var graph = d3.select("#bar-graph")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom + margin.bottom_label_buffer)
    var svg   = graph.append("g")
                     .attr("transform",
                           "translate(" + margin.left + "," + margin.top + ")");

    // X axis scale
    var x = d3.scaleLinear()
        // .domain([0, d3.max(content, function(d){ return d.sum_renumeration})])
        .range([ 0, width]);

    // Y axis scale
    var y = d3.scaleBand()
        .range([ 0, height ])
        //.domain(content.map(function(d) { return d.department; }))
        .padding(.1);


    function update(type) {

        let content = type === "department" ? dept_content : pos_content;

        // Set axes' domain
        y.domain(content.map(function(d) { 
            if (type === "department") {
                return d.department;
            }
            return d.position;}))
        x.domain([0, d3.max(content, function(d){ return d.sum_renumeration})])

        // Remove first
        $("#x-axis").remove();
        $("#y-axis").remove();

        // Add x-axis labels
        var x_axis = svg.append("g")
            .attr('id', 'x-axis')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
            x_axis.selectAll("text")
              .attr("transform", "translate(-10,0)rotate(-45)")
              .attr("class", "x-axis-label")
              .style("text-anchor", "end")
              .attr('font-size', '1.0em');

        // Add y-axis labels
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

        // Color scale
        var sequentialScale = d3.scaleLinear()
                        .domain([d3.max(content, function(d){ return d.sum_renumeration}), d3.min(content, function(d){ return d.sum_renumeration})])
                        .interpolate(d3.interpolateHcl)
                        .range([d3.hcl("#000000"), d3.hcl(gender_colors[gender.toLowerCase()])]);

        // Outer g container for bars
        var g_bars = svg.selectAll(".bar")
            .remove()
            .exit()
            .data(content)
            .enter()
            .append("g");

        // Add bars to each g container
        var bars = g_bars.append("rect")
              .attr("class", "bar")
              .attr("width", 0)
              .attr("y", function(d) {
                if (type === "department") {
                    return y(d.department)
                } else {
                    return y(d.position)
                }; 
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
                if (type === "department") {
                    return y(d.department)
                } else {
                    return y(d.position)
                }; 
              })
    }

    update("department");
       
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

