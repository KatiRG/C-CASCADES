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

const init = (urlRoot = "") => {
  let sankeydata1 = {};
  let sankeydata2 = {};

  let stackedSA = {};
  let stackedAfrica = {};
  let stackedAsia = {};
  let stackedNAmer = {};
  let stackedOceania = {};
  let stackedEurope = {};

  // -----------------------------------------------------------------------------
  // SVGs
  // Sankeys
  const chartSankey1 = d3.select(".data.sankey1")
      .append("svg")
      .attr("id", "chart1");
  const chartSankey2 = d3.select(".data.sankey2")
      .append("svg")
      .attr("id", "chart2");

  // Stacked bar charts
  const chartSA = d3.select(".data.SAdata")
      .append("svg")
      .attr("id", "stackedbar_SA");

  const chartAF = d3.select(".data.AFdata")
      .append("svg")
      .attr("id", "stackedbar_Africa");

  const chartAS = d3.select(".data.ASdata")
      .append("svg")
      .attr("id", "stackedbar_Asia");

  const chartNA = d3.select(".data.NAdata")
      .append("svg")
      .attr("id", "stackedbar_NAmer");

  const chartOC = d3.select(".data.OCdata")
      .append("svg")
      .attr("id", "stackedbar_Oceania");

  const chartEU = d3.select(".data.EUdata")
      .append("svg")
      .attr("id", "stackedbar_Europe");

  // ----------------------------------------------------------------
  // Help button
  d3.select("#helpButton")
      .on("click", function() {
        createHelp();
      });

  function createHelp() {
    const parameters = {};
    parameters.parentContainerId = "#thisContainer";
    parameters.helpArray = [
      {
        linkType: "dotOnly",
        divToHelpId: "helpInlandwater",
        text: i18next.t("helpInlandwater", {ns: "helpOverlay"}),
        marginTop: 245,
        marginLeft: 0,
        textLengthByLine: 70,
        myTitle: i18next.t("helpTitle", {ns: "helpOverlay"})
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpLakeRef",
        text: i18next.t("helpLakeRef", {ns: "helpOverlay"}),
        marginTop: 310,
        marginLeft: 0,
        textLengthByLine: 30
      },
      {
        linkType: "middle",
        divToHelpId: "helpHighLat",
        text: i18next.t("helpHighLat", {ns: "helpOverlay"}),
        marginTop: 400,
        marginLeft: 350,
        textLengthByLine: 40
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpEstRef",
        text: i18next.t("helpEstRef", {ns: "helpOverlay"}),
        marginTop: 480,
        marginLeft: 0,
        textLengthByLine: 30
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpLowLat",
        text: i18next.t("helpLowLat", {ns: "helpOverlay"}),
        marginTop: 690,
        marginLeft: 0,
        textLengthByLine: 50
      },
      {
        linkType: "middle",
        divToHelpId: "helpCountry",
        text: i18next.t("helpCountry", {ns: "helpOverlay"}),
        marginTop: 300,
        marginLeft: 850,
        textLengthByLine: 25
      },
      {
        linkType: "middle",
        divToHelpId: "helpRivers",
        text: i18next.t("helpRivers", {ns: "helpOverlay"}),
        marginTop: 235,
        marginLeft: 566,
        textLengthByLine: 30
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpAsia",
        text: i18next.t("helpAsia", {ns: "helpOverlay"}),
        marginTop: 520,
        marginLeft: 666,
        textLengthByLine: 30
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpLakes",
        text: i18next.t("helpLakes", {ns: "helpOverlay"}),
        marginTop: 640,
        marginLeft: 3,
        textLengthByLine: 50
      },
      {
        linkType: "dotOnly",
        divToHelpId: "helpEstuaries",
        text: i18next.t("helpEstuaries", {ns: "helpOverlay"}),
        marginTop: 855,
        marginLeft: 450,
        textLengthByLine: 50
      }
    ];
    new window.Help( parameters );
  }

  // -----------------------------------------------------------------------------
  // FNS
  // page texts
  function pageText() {
    d3.select("#titletag").html(i18next.t("titletag", {ns: "pageText"}));
    d3.select("#pageTitle").html(i18next.t("title", {ns: "pageText"}));
    d3.select("#infotext").html(i18next.t("infotext", {ns: "pageText"}));
    d3.select("#subtitle").html(i18next.t("subtitle", {ns: "pageText"}));
  }

  // display areaChart
  function showSankey(chartNum, svg, settings, graph) {
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
  // STACKED BARS
  function showStackedBar(svg, settings, data) {
    // tooltip div
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    const yshiftTooltip = 90; // amount to raise tooltip in y-dirn

    const outerWidth = settings.width;
    const outerHeight = Math.ceil(outerWidth / settings.aspectRatio);
    const innerHeight = outerHeight - settings.margin.top - settings.margin.bottom;
    const innerWidth = outerWidth - settings.margin.left - settings.margin.right;
    let chartInner = svg.select("g.margin-offset");

    svg
        .attr("viewBox", `${settings.viewBox.x} ${settings.viewBox.y} ${outerWidth} ${outerHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img");

    let xAxisObj = chartInner.select(".x.axis");
    let yAxisObj = chartInner.select(".y.axis");

    if (chartInner.empty()) {
      chartInner = svg.append("g")
          .attr("class", "margin-offset")
          .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
    }

    const x = d3.scaleBand()
        .rangeRound([5, innerWidth], settings.barWidth ? settings.barWidth : 0.1)
        .paddingInner(0.05);


    const y = d3.scaleLinear()
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .range(["#A9C1D9", "#607890", "#ABBE71"]);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y)
        .tickFormat(d3.format(".2s"))
        .ticks(settings.y.ticks);

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

    xAxisObj = chartInner.select(".x.axis");
    if (xAxisObj.empty()) {
      xAxisObj = chartInner.append("g")
          .attr("class", "x axis")
          .attr("aria-hidden", "true")
          .attr("transform", `translate(0, ${innerHeight})`);
    }
    xAxisObj.call(xAxis);

    yAxisObj = chartInner.select(".y.axis");
    if (yAxisObj.empty()) {
      yAxisObj = chartInner.append("g")
          .attr("class", "y axis")
          .attr("aria-hidden", "true");

      // display y-axis units only for first chart
      if (settings.showUnits) {
        yAxisObj
            .append("text")
            .attr("class", "chart-label")
            .attr("x", -50)
            .attr("y", 0)
            .attr("dy", "-0.5em")
            .attr("text-anchor", "start")
            .html(`${i18next.t("units", {ns: "constants"})}`)
            .append("tspan")
            .text("-1")
            .style("font-size", "9px")
            .attr("y", -11)
            .attr("dx", ".01em")
            .attr("dy", "-.2em");
      }
    }
    yAxisObj.call(yAxis);

    const country = svg.selectAll(".country")
        .data(data)
        .enter().append("g")
        .attr("class", "g");

    country.selectAll("rect")
        .data((d) => {
          return d.flux;
        })
        .enter().append("rect")
        .attr("class", function(d) {
          return d.loac;
        })
        .attr("x", (d) => {
          return x(d.country) + settings.margin.left; // NB: NEED TO ADD THE LEFT MARGIN
          // return x(d.country);
        })
        .attr("y", (d) => {
          return y(d.y1);
        })
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
          return y(d.y0) - y(d.y1);
        });

    country.selectAll("rect")
        .on("mousemove", (d) => {
          const delta = d.y1 - d.y0;
          // Tooltip
          div.transition()
              .style("opacity", .9);
          div.html(
              `<b> ${d.loac} </b><br><br>
                <table>
                  <tr>
                    <td><b>${globalSettings.formatNum(delta)} </td>
                    <td> ${i18next.t("units", {ns: "constants"})} </td>
                  </tr>
                </table>`
          )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - yshiftTooltip) + "px");
        })
        .on("mouseout", () => {
          div.transition()
              .style("opacity", 0);
        });

    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
  }

  // -----------------------------------------------------------------------------
  // Initial page load
  i18n.load([`${urlRoot}/src/i18n`], () => {
    d3.queue()
        .defer(d3.json, `${urlRoot}/data/LOAC_budget_TgCyr181113_sankey1.json`)
        .defer(d3.json, `${urlRoot}/data/LOAC_budget_TgCyr181113_sankey2.json`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_SAmer.csv`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_Africa.csv`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_Asia.csv`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_NAmer.csv`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_Oceania.csv`)
        .defer(d3.csv, `${urlRoot}/data/LOAC_budget_TgCyr181113_stackedbar_Europe.csv`)
        .await(function(error, sankeyfile1, sankeyfile2, stackedfileSA, stackedfileAfrica,
            stackedfileAsia, stackedfileNAmer, stackedfileOceania, stackedfileEurope) {
          sankeydata1 = sankeyfile1;
          sankeydata2 = sankeyfile2;

          stackedSA = stackedfileSA;
          stackedAfrica = stackedfileAfrica;
          stackedAsia = stackedfileAsia;
          stackedNAmer = stackedfileNAmer;
          stackedOceania = stackedfileOceania;
          stackedEurope = stackedfileEurope;

          // Page text
          pageText();

          // Draw graphs
          showSankey(1, chartSankey1, settingsSankey, sankeydata1);
          showSankey(2, chartSankey2, settingsSankey, sankeydata2);

          showStackedBar(chartSA, settingsSA, stackedSA);
          showStackedBar(chartAF, settingsAF, stackedAfrica);
          showStackedBar(chartAS, settingsAS, stackedAsia);
          showStackedBar(chartNA, settingsNA, stackedNAmer);
          showStackedBar(chartOC, settingsOC, stackedOceania);
          showStackedBar(chartEU, settingsEU, stackedEurope);
        });
  });
};

if (typeof Drupal !== "undefined") {
  Drupal.behaviors.dv = {
    attach: function(context, settings) {
      init(Drupal.settings.dv && Drupal.settings.dv.urlRoot ? Drupal.settings.dv.urlRoot : "");
    }
  };
} else {
  init(".");
}
