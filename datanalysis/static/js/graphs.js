queue()
    .defer(d3.json, "/datanalysis/projects")
    .await(makeGraphs);

function makeGraphs(error, data){

    //Clean projectsJson data
    var datanalysisProjects = data;
    var dateFormat = d3.time.format("%d/%m/%Y");
    datanalysisProjects.forEach(function(d) {
        d["Date"] = dateFormat.parse(d["Date"]);
        d["Date"].setDate(1);
    });
    
    //Create Crossfilter instance
    var ndx = crossfilter(datanalysisProjects);

    //Defining Dimensions
    var dateDim  = ndx.dimension(function(d) {
      return d["Date"];
    });
    var valueDim  = ndx.dimension(function(d) {
      return d["Value"];
    });
    

    //Calculating Metrics
    var numProjectsByDate = dateDim.group();
    var numProjectsByValue = valueDim.group()
      .reduceCount(function(d) { return d["Value"]; });
    
    
    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["Date"];
    var maxDate = dateDim.top(1)[0]["Date"];

    

    //Charts
    var valueChart = dc.barChart("#time-chart");
   
    valueChart
        .width(750)
        .height(250)
        .margins({top: 90, right: 50, bottom: 30, left: 250})
        .dimension(dateDim)
        .group(numProjectsByDate)
        .transitionDuration(500)
        .centerBar(true)
        .gap(500)
        .filter([3, 4])
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .xAxis().ticks(4);
    
    dc.renderAll();
    
};