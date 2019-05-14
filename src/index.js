const units = "Tg C yr <sup>-1</sup>";
const formatNumber = d3.format(".2f");
const format = function(d) {
  return formatNumber(d);
};

let sankeydata1 = {};
let sankeydata2 = {};

/* -- display areaChart -- */
function showSankey(chartDiv, graph) {
  const chartNum =  chartDiv.split("chart")[1];
  console.log(i18next.t("units", {ns: "constants"}))

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

  make(graph);

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
      const sourceName = i18next.t(d.source.name, {ns: "labels"});
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
          return i18next.t(d.name, {ns: "labels"});
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
      const sourceName = i18next.t(d.name, {ns: "labels"});
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
      let childArray;
      let thisParent;

      if (d.sourceLinks.length > 0) {
        childArray = d.sourceLinks;
        thisParent = "target";

        // store connecting links
        thisLink = d3.selectAll(".from" + d.name.replace(/\s+/g, "") + chartNum);
      } else if (d.targetLinks.length > 0) {
        childArray = d.targetLinks;
        thisParent = "source";

        // store connecting links
        thisLink = d3.selectAll(".to" + d.name.replace(/\s+/g, "") + chartNum);
      }

      // highlight connecting links
      thisLink.classed("inactive", !thisLink.classed("inactive"));
      thisLink.classed("active", true);

      // highlight target child rects
      childArray.map((n) => {
        childName = n[thisParent].name.replace(/\s+/g, "");
        d3.select(`#chart${chartNum}`)
            .select(`rect.${childName}`)
            .classed("rectInactive", false);
      });
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


// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], () => {
  // d3.queue()
  queue()
      .defer(d3.json, "data/LOAC_budget_TgCyr181113_sankey1.json")
      .defer(d3.json, "data/LOAC_budget_TgCyr181113_sankey2.json")
      .await(function(error, sankeyfile1, sankeyfile2) {
        sankeydata1 = sankeyfile1;
        sankeydata2 = sankeyfile2;

        showSankey("#chart1", sankeydata1);
        showSankey("#chart2", sankeydata2);
      });
});

