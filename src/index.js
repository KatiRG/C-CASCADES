const units = "Tg C yr <sup>-1</sup>";
const formatNumber = d3.format(".2f");
const format = function(d) {
  return formatNumber(d);
};

// Read data
const jsonFile1 = "data/LOAC_budget_TgCyr181113_sankey1.json";
const jsonFile2 = "data/LOAC_budget_TgCyr181113_sankey2.json";

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
  const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  const yshiftTooltip = 90; // amount to raise tooltip in y-dirn

  const topDict = {
    "#stackedbar_SA": 25,
    "#stackedbar_Africa": 10,
    "#stackedbar_Asia": 15,
    "#stackedbar_NAmer": 5,
    "#stackedbar_Oceania": 2,
    "#stackedbar_Europe": 5
  };
  const margin = {top: topDict[chartId], right: 20, bottom: 17, left: 40};
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  const x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  const y = d3.scale.linear()
      .rangeRound([height, 0]);

  const color = d3.scale.ordinal()
      .range(["#A9C1D9", "#607890", "#ABBE71"]);

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  const numTicks = (chartId === "#stackedbar_Oceania") ? 1 : 3;
  const yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"))
      .ticks(numTicks);

  const svg = d3.select(chartId).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(fname, function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter((key) => {
      return key !== "country";
    }));

    data.forEach((d) => {
      const country = d.country;
      let y0 = 0;
      d.flux = color.domain().map((name) => {
        return {country: country, loac: name, y0: y0, y1: y0 += +d[name]};
      });
      d.total = d.flux[d.flux.length - 1].y1;
    });

    data.sort((a, b) => {
      return b.total - a.total;
    });

    x.domain(data.map((d) => {
      return d.country;
    }));
    y.domain([0, d3.max(data, (d) => {
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

    const country = svg.selectAll(".country")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", () => {
          return "translate(" + "0" + ",0)";
        });

    country.selectAll("rect")
        .data((d) => {
          return d.flux;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", (d) => {
          return y(d.y1);
        })
        .attr("x", (d) => {
          return x(d.country);
        })
        .attr("height", (d) => {
          return y(d.y0) - y(d.y1);
        })
        .style("fill", (d) => {
          return color(d.loac);
        });

    country.selectAll("rect")
        .on("mousemove", (d) => {
          const delta = d.y1 - d.y0;
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
        .on("mouseout", () => {
          div.transition()
              .style("opacity", 0);
        });
  });
} // .makeStackedBar

function makeSankey(chartDiv, jsonFile, chartNum) {
  const margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  const width = 460 - margin.left - margin.right;
  const height = 900 - margin.top - margin.bottom;

  // append the svg canvas to the page
  const svg = d3.select(chartDiv).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"
      );

  // set the sankey diagram properties
  const sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(20)
      .size([width, height]);

  const path = sankey.link();
  const yshiftTooltip = 90; // amount to raise tooltip in y-dirn

  const nameDict = {
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
    const nodeMap = {};
    graph.nodes.forEach((x) => {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map((x) => {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    graph.nodes.sort((a, b) => {
      return d3.descending(a.value, b.value);
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // tooltip div
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", (d) => {
          const fromName = "from" + d.source.name.replace(/\s+/g, "") + chartNum;
          const toName = "to" + d.target.name.replace(/\s+/g, "") + chartNum;
          return "link" + " " + fromName + " " + toName;
        })
        .attr("d", path)
        .attr("id", (d, i) => {
          d.id = i;
          return "chart" + chartNum + "_link-" + i;
        })
        .style("stroke-width", (d) => {
          return Math.max(1, d.dy);
        })
        .sort((a, b) => {
          return b.dy - a.dy;
        });

    // add link tooltip
    link.on("mousemove", function(d) {
      // Reduce opacity of all but link that is moused over and connected rects
      d3.selectAll(".link:not(#" + this.id + ")").style("opacity", 0.5);

      // Remove inactive class to selected links and make them active
      highlightFromLink(d, this);

      // Tooltip
      const sourceName = (d.source.name === "Tropics" || d.source.name === "Mid lat" || d.source.name === "High lat") ?
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
    const node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", () => {
          return "node regions";
        })
        .attr("transform", (d) => {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .style("cursor", () => {
          return "crosshair";
        });

    // apend rects to the nodes
    node.append("rect")
        .attr("height", (d) => {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .attr("class", (d) => {
          return d.name.replace(/\s/g, "");
        });

    // apend text to nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", (d) => {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text((d) => {
          if (d.name === "Tropics" || d.name === "Mid lat" || d.name === "High lat") return nameDict[d.name];
          else return d.name;
        })
        .style("font-weight", "bold")
        .filter((d) => {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // add node tooltip
    node.on("mousemove", (d) => {
      highlightFromNode(d);

      // tooltip
      const sourceName = (d.name === "Tropics" || d.name === "Mid lat" || d.name === "High lat") ?
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
        .on("mouseout", () => {
          // Remove active and inactive classes added on mouseover
          d3.selectAll(".inactive").classed("inactive", false);
          d3.selectAll(".active").classed("active", false);
          d3.selectAll("rect").classed("rectInactive", false);

          div.transition()
              .style("opacity", 0);
        });

    // selective rect highlight
    function highlightFromNode(d) {
      // first deactivate all rects and links
      d3.select("#chart" + chartNum).selectAll("rect:not(." + d.name.replace(/\s+/g, "") + ")").classed("rectInactive", true);
      d3.selectAll(".link").classed("inactive", true);

      // selectively turn on child rects
      let childName;
      let thisLink;

      if (d.sourceLinks.length > 0) {
        d.sourceLinks.map((n) => {
          // highlight source child rects
          childName = n.target.name.replace(/\s+/g, "");
          d3.select("#chart" + chartNum)
              .select("rect." + childName)
              .classed("rectInactive", false);
        });

        // store connecting links
        thisLink = d3.selectAll(".from" + d.name.replace(/\s+/g, "") + chartNum);
      } else if (d.targetLinks.length > 0) {
        // highlight target child rects
        d.targetLinks.map((n) => {
          childName = n.source.name.replace(/\s+/g, "");
          d3.select(`#chart${chartNum}`)
              .select(`rect.${childName}`)
              .classed("rectInactive", false);
        });

        // store connecting links
        thisLink = d3.selectAll(".to" + d.name.replace(/\s+/g, "") + chartNum);
      }

      // highlight connecting links
      thisLink.classed("inactive", !thisLink.classed("inactive"));
      thisLink.classed("active", true);
    }
    function highlightFromLink(d, thisLink) {
      // turn off all rects
      d3.selectAll("rect").classed("rectInactive", true);
      // name of source rect
      const thisName = d.source.sourceLinks.length > 0 ? d.source.name : d.target.name;

      // turn on only source and its target rect
      const targetRect = d3.select("#" + thisLink.id)
          .attr("class").split(" ")
          .filter((s) => s.includes("to"))[0]
          .split("to")[1].slice(0, -1);

      d3.select("#chart" + chartNum).select("rect." + thisName).classed("rectInactive", false);
      d3.select("#chart" + chartNum).select("rect." + targetRect).classed("rectInactive", false);
    }
  } // end make()
} // end makeSankey()
