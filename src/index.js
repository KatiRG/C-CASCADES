// settings for Sankey
import settingsSankey from "./settingsSankey.js";

// settings for stacked bar charts
import settingsSA from "./settingsSA.js"; // South America
import settingsAF from "./settingsAF.js"; // Africa
import settingsAS from "./settingsAS.js"; // Asia
import settingsNA from "./settingsNA.js"; // North America
import settingsOC from "./settingsOC.js"; // Oceania
import settingsEU from "./settingsEU.js"; // Europe

// Define number format (2 decimal places) from utils.js
const globalSettings = {
  _selfFormatter: i18n.getNumberFormatter(2),
  formatNum: function(...args) {
    return this._selfFormatter.format(args);
  }
};

let sankeydata1 = {};
let sankeydata2 = {};


// -----------------------------------------------------------------------------
// SVGs
// Sankeys
const chartSankey1 = d3.select(".data.sankey1")
    .append("svg")
    .attr("id", "chart1");
const chartSankey2 = d3.select(".data.sankey2")
    .append("svg")
    .attr("id", "chart2");


// -----------------------------------------------------------------------------
// FNS
/* -- page texts -- */
function pageText() {
  d3.select("#titletag").html(i18next.t("titletag", {ns: "pageText"}));
  d3.select("#pageTitle").html(i18next.t("title", {ns: "pageText"}));
  d3.select("#infotext").html(i18next.t("infotext", {ns: "pageText"}));
  d3.select("#subtitle").html(i18next.t("subtitle", {ns: "pageText"}));
}

/* -- display areaChart -- */
function showSankey(svg, settings, graph) {
  const outerWidth = settings.width;
  const outerHeight = Math.ceil(outerWidth / settings.aspectRatio);
  const innerHeight = outerHeight - settings.margin.top - settings.margin.bottom;
  const innerWidth = outerWidth - settings.margin.left - settings.margin.right;
  let chartInner = svg.select("g.margin-offset");
  let dataLayer = chartInner.select(".data");

  svg
      .attr("viewBox", `${settings.viewBox.x} ${settings.viewBox.y} ${outerWidth} ${outerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img");

  const chartNum = d3.select(svg._groups[0][0]).attr("id").split("chart")[1];
  console.log("chartNum: ", chartNum)

  if (chartInner.empty()) {
    chartInner = svg.append("g")
        .attr("class", "margin-offset")
        .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
  }
  d3.stcExt.addIEShim(svg, outerHeight, outerWidth);

  // set the sankey diagram properties
  const sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(20)
      .size([innerWidth, innerHeight]);

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

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g")
          .attr("class", "data");
    }

    const link = dataLayer.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", (d) => {
          const fromName = `from${d.source.name.replace(/\s+/g, "")}${chartNum}`;
          const toName = `to${d.target.name.replace(/\s+/g, "")}${chartNum}`;
          return `link ${fromName} ${toName}`;
        })
        .attr("d", path)
        .attr("id", (d, i) => {
          d.id = i;
          return `chart${chartNum}_link-${i}`;
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
      d3.selectAll(`.link:not(#${this.id})`).style("opacity", 0.5);

      // Remove inactive class to selected links and make them active
      highlightFromLink(d, this);

      // Tooltip
      const sourceName = i18next.t(d.source.name, {ns: "labels"});
      div.transition()
          .style("opacity", .9);
      div.html(
          `<b>${sourceName}</b><br><br>
          <table>
              <tr>
                <td>${d.target.name} flux: </td>
                <td><b>${globalSettings.formatNum(d.value)}</td>
                <td> ${i18next.t("units", {ns: "constants"})} </td>
            </tr>
          </table>`
      )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - yshiftTooltip) + "px");
    })
        .on("mouseout", function() {
          // Restore opacity
          d3.selectAll(`.link:not(#chart${chartNum}_${this.id})`).style("opacity", 1);

          // Remove active and inactive classes added on mouseover
          d3.selectAll("rect").classed("rectInactive", false);

          div.transition()
              .style("opacity", 0);
        });

    // add in the nodes
    const node = dataLayer.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", () => {
          return "node regions";
        })
        .attr("transform", (d) => {
          return `translate(${d.x},${d.y})`;
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
        .filter((d) => {
          return d.x < innerWidth / 2;
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
          `<b>${sourceName}</b><br><br>
          <table>
            <tr>
              <td> Total flux: </td>
              <td><b>${globalSettings.formatNum(d.value)}</td>
              <td> ${i18next.t("units", {ns: "constants"})} </td>
            </tr>
          </table>`
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
      d3.select("#chart" + chartNum)
          .selectAll(`rect:not(.${d.name.replace(/\s+/g, "")})`)
          .classed("rectInactive", true);
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
        thisLink = d3.selectAll(`.from${d.name.replace(/\s+/g, "")}${chartNum}`);
      } else if (d.targetLinks.length > 0) {
        childArray = d.targetLinks;
        thisParent = "source";

        // store connecting links
        thisLink = d3.selectAll(`.to${d.name.replace(/\s+/g, "")}${chartNum}`);
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

      d3.select(`#chart${chartNum}`).select(`rect.${thisName}`).classed("rectInactive", false);
      d3.select(`#chart${chartNum}`).select(`rect.${targetRect}`).classed("rectInactive", false);
    }
  } // end make()
} // end makeSankey()

// ----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], () => {
  d3.queue()
      .defer(d3.json, "data/LOAC_budget_TgCyr181113_sankey1.json")
      .defer(d3.json, "data/LOAC_budget_TgCyr181113_sankey2.json")
      .await(function(error, sankeyfile1, sankeyfile2) {
        sankeydata1 = sankeyfile1;
        sankeydata2 = sankeyfile2;

        // Page text
        pageText();

        // Draw graphs
        showSankey(chartSankey1, settingsSankey, sankeydata1);
        showSankey(chartSankey2, settingsSankey, sankeydata2);
      });
});

