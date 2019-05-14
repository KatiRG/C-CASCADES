var units = "Tg C yr <sup>-1</sup>";
var formatNumber = d3.format(".2f");
var format = function(d) {
  return formatNumber(d);
};

// Read data
var jsonFile1 = "data/LOAC_budget_TgCyr181113_sankey1.json";
var jsonFile2 = "data/LOAC_budget_TgCyr181113_sankey2.json";

makeSankey("#chart1", jsonFile1, 1);
makeSankey("#chart2", jsonFile2, 2);

makeStackedBar("#stackedbar_SA", "data/LOAC_budget_TgCyr181113_stackedbar_SAmer.csv", 225, 220);
makeStackedBar("#stackedbar_Africa", "data/LOAC_budget_TgCyr181113_stackedbar_Africa.csv", 135, 140);
makeStackedBar("#stackedbar_Asia", "data/LOAC_budget_TgCyr181113_stackedbar_Asia.csv", 245, 190);
makeStackedBar("#stackedbar_NAmer", "data/LOAC_budget_TgCyr181113_stackedbar_NAmer.csv", 180, 130);
makeStackedBar("#stackedbar_Oceania", "data/LOAC_budget_TgCyr181113_stackedbar_Oceania.csv", 35, 130);
makeStackedBar("#stackedbar_Europe", "data/LOAC_budget_TgCyr181113_stackedbar_Europe.csv", 70, 180);

function makeStackedBar(chartId, fname, h, w) {
  // tooltip div
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var yshiftTooltip = 90; // amount to raise tooltip in y-dirn

  var topDict = {
    "#stackedbar_SA": 25,
    "#stackedbar_Africa": 10,
    "#stackedbar_Asia": 15,
    "#stackedbar_NAmer": 5,
    "#stackedbar_Oceania": 2,
    "#stackedbar_Europe": 5
  };
  var margin = {top: topDict[chartId], right: 20, bottom: 17, left: 40};
  var width = w - margin.left - margin.right;
  var height = h - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#A9C1D9", "#607890", "#ABBE71"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var numTicks = (chartId === "#stackedbar_Oceania") ? 1 : 3;
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"))
      .ticks(numTicks);

  var svg = d3.select(chartId).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(fname, function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "country";
    }));

    data.forEach(function(d) {
      var country = d.country;
      var y0 = 0;
      d.flux = color.domain().map(function(name) {
        return {country: country, loac: name, y0: y0, y1: y0 += +d[name]};
      });
      d.total = d.flux[d.flux.length - 1].y1;
    });

    data.sort(function(a, b) {
      return b.total - a.total;
    });

    x.domain(data.map(function(d) {
      return d.country;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.total;
    })]);

    if (chartId === "#stackedbar_SA") {
      svg.append("g")
          .attr("class", "tick")
          .append("text", "text")
          .attr("x", -40)
          .attr("y", -8)
          .html("Tg C yr")
          .style("font-size", "11px")
          .append("tspan")
          .text("-1")
          .style("font-size", "11px")
          .attr("dx", ".01em")
          .attr("dy", "-.2em");
    }

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var country = svg.selectAll(".country")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function() {
          return "translate(" + "0" + ",0)";
        });

    country.selectAll("rect")
        .data(function(d) {
          return d.flux;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
          return y(d.y1);
        })
        .attr("x", function(d) {
          return x(d.country);
        })
        .attr("height", function(d) {
          return y(d.y0) - y(d.y1);
        })
        .style("fill", function(d) {
          return color(d.loac);
        });

    country.selectAll("rect")
        .on("mouseover", function(d) {
          var delta = d.y1 - d.y0;
          // Tooltip
          div.transition()
              .style("opacity", .9);
          div.html(
              "<b>" + d.loac + "</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + format(delta) + "</td>" +
                  "<td>" + " " + units + "</td>" +
                "</tr>" +
              "</table>"
          )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - yshiftTooltip) + "px");
        })
        .on("mouseout", function() {
          div.transition()
              .style("opacity", 0);
        });
  });
} // .makeStackedBar

function makeSankey(chartDiv, jsonFile, chartNum) {
  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  var width = 460 - margin.left - margin.right;
  var height = 900 - margin.top - margin.bottom;

  // append the svg canvas to the page
  var svg = d3.select(chartDiv).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"
      );

  // set the sankey diagram properties
  var sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(20)
      .size([width, height]);

  var path = sankey.link();
  var yshiftTooltip = 90; // amount to raise tooltip in y-dirn

  var nameDict = {
    // latitude bands
    "Tropics": "Tropics (> 50 degrees)",
    "High lat": "High latitudes (< -50 degrees)",
    "Mid lat": "Mid latitudes (30–50 degrees)"
  };

  // load the data
  d3.json(jsonFile, function(error, graph) {
    make(graph);
  });

  function make(graph) {
    var nodeMap = {};
    graph.nodes.forEach(function(x) {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function(x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    graph.nodes.sort(function(a, b) {
      return d3.descending(a.value, b.value);
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // tooltip div
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", function(d) {
          var fromName = "from" + d.source.name.replace(/\s+/g, "") + chartNum;
          var toName = "to" + d.target.name.replace(/\s+/g, "") + chartNum;
          return "link" + " " + fromName + " " + toName;
        })
        .attr("d", path)
        .attr("id", function(d, i) {
          d.id = i;
          return "chart" + chartNum + "_link-" + i;
        })
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        });

    // add link tooltip
    link.on("mouseover", function(d) {
      // Reduce opacity of all but link that is moused over and connected rects
      d3.selectAll(".link:not(#" + this.id + ")").style("opacity", 0.5);

      // Remove inactive class to selected links and make them active
      rectHighlightFromLink(d, this);

      // Tooltip
      var sourceName = (d.source.name === "Tropics" || d.source.name === "Mid lat" || d.source.name === "High lat") ?
                      nameDict[d.source.name] : d.source.name;
      div.transition()
          .style("opacity", .9);
      div.html(
          "<b>" + sourceName + "</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" +
                "<td>" + d.target.name + " flux: </td>" +
                "<td><b>" + format(d.value) + "</td>" +
                "<td>" + " " + units + "</td>" +
            "</tr>" +
        "</table>"
      )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - yshiftTooltip) + "px");
    })
        .on("mouseout", function() {
          // Restore opacity
          d3.selectAll(".link:not(#chart" + chartNum + "_" + this.id + ")").style("opacity", 1);

          // Remove active and inactive classes added on mouseover
          d3.selectAll("rect").classed("rectInactive", false);

          div.transition()
              .style("opacity", 0);
        });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", function() {
          return "node regions";
        })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .style("cursor", function() {
          return "crosshair";
        })
        .call(d3.behavior.drag() // moves nodes with mouse drag
            .origin(function(d) {
              return d;
            })
            .on("drag", dragmove)
        );

    // apend rects to the nodes
    node.append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .attr("class", function(d) {
          return d.name.replace(/\s/g, "");
        });

    // apend text to nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
          if (d.name === "Tropics" || d.name === "Mid lat" || d.name === "High lat") return nameDict[d.name];
          else return d.name;
        })
        .style("font-weight", "bold")
        .filter(function(d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // add node tooltip
    node.on("mouseover", function(d) {
      highlightFromNode(d);

      // tooltip
      var sourceName = (d.name === "Tropics" || d.name === "Mid lat" || d.name === "High lat") ?
      nameDict[d.name] : d.name;
      div.transition()
          .style("opacity", .9);
      div.html(
          "<b>" + sourceName + "</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" +
              "<td> Total flux: </td>" +
              "<td><b>" + format(d.value) + "</td>" +
              "<td>" + " " + units + "</td>" +
            "</tr>" +
          "</table>"
      )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - yshiftTooltip) + "px");
    })
        .on("mouseout", function() {
          // Remove active and inactive classes added on mouseover
          d3.selectAll(".inactive").classed("inactive", false);
          d3.selectAll(".active").classed("active", false);
          d3.selectAll("rect").classed("rectInactive", false);

          div.transition()
              .style("opacity", 0);
        });

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + (
            d.x = d.x
          ) + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
          ) + ")");

      // move the attached links
      sankey.relayout();
      link.attr("d", path);
    }

    // selective rect highlight
    function highlightFromNode(d) {
      // first deactivate all rects and links
      d3.select("#chart" + chartNum).selectAll("rect:not(." + d.name.replace(/\s+/g, "") + ")").classed("rectInactive", true);
      d3.selectAll(".link").classed("inactive", true);

      // selectively turn on child rects
      var childName;
      var thisLink;

      if (d.sourceLinks.length > 0) {
        d.sourceLinks.map(function(n) {
          // highlight child rects
          childName = n.target.name.replace(/\s+/g, "");
          d3.select("#chart" + chartNum).select("rect." + childName).classed("rectInactive", false);
        });

        // store connecting links
        thisLink = d3.selectAll(".from" + d.name.replace(/\s+/g, "") + chartNum);

      } else if (d.targetLinks.length > 0) {
        d.targetLinks.map(function(n) {        
          childName = n.source.name.replace(/\s+/g, "");
          d3.select("#chart" + chartNum).select("rect." + childName).classed("rectInactive", false);
        });

        // store connecting links
        thisLink = d3.selectAll(".to" + d.name.replace(/\s+/g, "") + chartNum);
      }

      // highlight connecting links
      thisLink.classed("inactive", !thisLink.classed("inactive"));
      thisLink.classed("active", true);
    }
    function rectHighlightFromLink(d, thisLink) {
      // turn off all rects
      d3.selectAll("rect").classed("rectInactive", true);
      // name of source rect
      var thisName = d.source.sourceLinks.length > 0 ? d.source.name : d.target.name;

      // turn on only source and its target rect
      var targetRect = d3.select("#" + thisLink.id)
          .attr("class").split(" ")
          .filter(function(s) {
            return s.includes("to"); // ES6: s.filter(s => s.includes('to'));
          })[0]
          .split("to")[1].slice(0, -1);

      d3.select("#chart" + chartNum).select("rect." + thisName).classed("rectInactive", false);
      d3.select("#chart" + chartNum).select("rect." + targetRect).classed("rectInactive", false);
    }
  } // end make()
} // end makeSankey()
