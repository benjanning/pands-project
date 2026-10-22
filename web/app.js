"use strict";
const $ = (id) => document.getElementById(id),
  ns = "http://www.w3.org/2000/svg";
function element(name, attrs = {}, text = "") {
  const el = document.createElementNS(ns, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  if (text) el.textContent = text;
  return el;
}
const text = (x, y, value, attrs = {}) =>
  element("text", { x, y, ...attrs }, value);
async function start() {
  const response = await fetch("data.json");
  if (!response.ok) throw Error("Data unavailable");
  const data = await response.json();
  if (data.schema_version !== 1 || data.observations.length !== 150)
    throw Error("Unexpected observations");
  const colours = ["#38745a", "#a36e32", "#75618c"];
  let selectedRows = [];
  for (const [index, species] of data.species.entries()) {
    const label = document.createElement("label"),
      input = document.createElement("input"),
      symbol = document.createElement("span");
    input.type = "checkbox";
    input.value = species;
    input.checked = true;
    symbol.textContent = ["●", "▲", "■"][index];
    symbol.style.color = colours[index];
    symbol.setAttribute("aria-hidden", "true");
    label.append(input, symbol, document.createTextNode(species));
    $("species-controls").append(label);
    input.addEventListener("change", render);
  }
  for (const id of ["x-feature", "y-feature"]) {
    for (const feature of data.features) {
      const option = document.createElement("option");
      option.value = feature.key;
      option.textContent = feature.label + " (cm)";
      $(id).append(option);
    }
    $(id).addEventListener("change", render);
  }
  $("x-feature").value = "petal.length";
  $("y-feature").value = "petal.width";
  const label = (key) => data.features.find((item) => item.key === key).label;
  function featureScale(key, start, end) {
    const values = data.observations.map((row) => row[key]),
      minimum = Math.min(...values),
      maximum = Math.max(...values),
      padding = (maximum - minimum) * 0.06,
      low = Math.max(0, minimum - padding),
      high = maximum + padding;
    return {
      low,
      high,
      map: (value) => start + ((value - low) / (high - low)) * (end - start),
    };
  }

  function marker(row, cx, cy, description) {
    const i = data.species.indexOf(row.variety);
    let point;
    if (i === 0) point = element("circle", { cx, cy, r: 4.5 });
    else if (i === 1)
      point = element("polygon", {
        points: `${cx},${cy - 5.5} ${cx + 5},${cy + 4} ${cx - 5},${cy + 4}`,
      });
    else point = element("rect", { x: cx - 4, y: cy - 4, width: 8, height: 8 });
    point.setAttribute("class", "point");
    point.setAttribute("data-source-row", row.source_row);
    point.setAttribute("fill", colours[i]);
    point.setAttribute("fill-opacity", ".78");
    point.setAttribute("stroke", "#fffef9");
    point.setAttribute("stroke-width", ".6");
    point.append(element("title", {}, description));
    return point;
  }
  function scatter(rows, xKey, yKey) {
    const chart = element("svg", {
      viewBox: "0 0 540 390",
      role: "img",
      "aria-label": `${rows.length} observed rows. ${label(xKey)} horizontally and ${label(yKey)} vertically, in centimetres. Species use circle, triangle and square markers. Exact values are in the source table.`,
    });
    const x = featureScale(xKey, 65, 515),
      y = featureScale(yKey, 310, 25);
    for (let i = 0; i <= 4; i++) {
      const xv = x.low + ((x.high - x.low) * i) / 4,
        yv = y.low + ((y.high - y.low) * i) / 4;
      chart.append(
        element("line", {
          x1: x.map(xv),
          y1: 25,
          x2: x.map(xv),
          y2: 310,
          stroke: "#d4dacd",
        }),
        text(x.map(xv), 335, xv.toFixed(1), { "text-anchor": "middle" }),
        element("line", {
          x1: 65,
          y1: y.map(yv),
          x2: 515,
          y2: y.map(yv),
          stroke: "#d4dacd",
        }),
        text(52, y.map(yv) + 5, yv.toFixed(1), { "text-anchor": "end" }),
      );
    }
    chart.append(
      text(290, 373, label(xKey) + " (cm)", { "text-anchor": "middle" }),
      text(17, 170, label(yKey) + " (cm)", {
        transform: "rotate(-90 17 170)",
        "text-anchor": "middle",
      }),
    );
    for (const row of rows)
      chart.append(
        marker(
          row,
          x.map(row[xKey]),
          y.map(row[yKey]),
          `Source row ${row.source_row}: ${row.variety}, ${row[xKey]} / ${row[yKey]} cm`,
        ),
      );
    return chart;
  }
  function distributionChart(rows, key) {
    const chart = element("svg", {
      viewBox: "0 0 540 390",
      role: "img",
      "aria-label": `${rows.length} original rows. Distribution of ${label(key)} in centimetres by species. Boxes show Q1 to Q3 and the median; whiskers show observed minimum and maximum. Vertical offsets only separate points and have no measurement meaning. Exact summaries are beside the chart.`,
    });
    const x = featureScale(key, 105, 515);
    for (let i = 0; i <= 4; i++) {
      const value = x.low + ((x.high - x.low) * i) / 4;
      chart.append(
        element("line", {
          x1: x.map(value),
          y1: 25,
          x2: x.map(value),
          y2: 310,
          stroke: "#d4dacd",
        }),
        text(x.map(value), 338, value.toFixed(1), { "text-anchor": "middle" }),
      );
    }
    chart.append(
      text(310, 375, label(key) + " (cm)", { "text-anchor": "middle" }),
    );
    for (const [i, species] of data.species.entries()) {
      const observed = rows.filter((row) => row.variety === species);
      if (!observed.length) continue;
      const centre = 70 + i * 95,
        summaryY = centre + 20,
        q = IrisLab.distribution(observed, key);
      chart.append(text(92, centre + 5, species, { "text-anchor": "end" }));
      const range = element("line", {
        x1: x.map(q.minimum),
        x2: x.map(q.maximum),
        y1: summaryY,
        y2: summaryY,
        stroke: colours[i],
        "stroke-width": 2,
        class: "distribution-range",
        "data-species": species,
      });
      const box = element("rect", {
        x: x.map(q.q1),
        y: summaryY - 7,
        width: x.map(q.q3) - x.map(q.q1),
        height: 14,
        fill: colours[i],
        "fill-opacity": 0.16,
        stroke: colours[i],
        class: "distribution-box",
        "data-species": species,
      });
      const median = element("line", {
        x1: x.map(q.median),
        x2: x.map(q.median),
        y1: summaryY - 9,
        y2: summaryY + 9,
        stroke: colours[i],
        "stroke-width": 3,
        class: "distribution-median",
        "data-species": species,
      });
      chart.append(
        range,
        element("line", {
          x1: x.map(q.minimum),
          x2: x.map(q.minimum),
          y1: summaryY - 5,
          y2: summaryY + 5,
          stroke: colours[i],
        }),
        element("line", {
          x1: x.map(q.maximum),
          x2: x.map(q.maximum),
          y1: summaryY - 5,
          y2: summaryY + 5,
          stroke: colours[i],
        }),
        box,
        median,
      );
      observed.forEach((row, j) =>
        chart.append(
          marker(
            row,
            x.map(row[key]),
            centre - 10 + (((j * 17) % 50) - 24.5) * 0.55,
            `Source row ${row.source_row}: ${species}, ${label(key)} ${row[key]} cm. Vertical offset only separates points.`,
          ),
        ),
      );
    }
    return chart;
  }
  function render() {
    const included = [
        ...$("species-controls").querySelectorAll("input:checked"),
      ].map((input) => input.value),
      x = $("x-feature").value,
      y = $("y-feature").value;
    const distributionView = $("chart-view").value === "distribution";
    $("y-feature").disabled = distributionView;
    $("view-help").textContent = distributionView
      ? "Distribution uses the horizontal feature. The vertical control is inactive in this view."
      : "Scatter compares the horizontal and vertical features.";
    $("summary-heading").textContent = distributionView
      ? "Median, quartiles and observed spread"
      : "Means and observed spread";
    $("summary-note").textContent = distributionView
      ? "Quartiles use linear interpolation at (n − 1) × p and are checked against independent Python references. The box spans Q1 to Q3; its line marks the median. Whiskers show the full observed minimum/maximum, not outlier fences or confidence intervals."
      : "Mean and sample SD are computed from the selected rows in your browser and checked against independent Python summaries. SD describes individual variation; it is not a confidence interval.";
    $("plot-note").textContent = distributionView
      ? "Each symbol is an original source row at its exact feature value. Summary strips sit beneath each point row. Vertical offsets only separate points and have no measurement meaning. All repeated rows are retained, and the horizontal scale stays fixed as species are filtered."
      : "Each symbol represents an original source row. Some symbols overlap at exactly the same coordinates; no jitter is added and no repeated row is removed. The axis range stays fixed for each feature when species are filtered.";
    selectedRows = data.observations.filter((row) =>
      included.includes(row.variety),
    );
    $("selection-status").textContent =
      `${selectedRows.length} of 150 source rows shown · ${included.length} species selected · ${distributionView ? "distribution" : "scatter"} view.`;
    $("same-feature").hidden = distributionView || x !== y;
    $("empty").hidden = selectedRows.length > 0;
    $("download").disabled = !selectedRows.length;
    $("scatter").replaceChildren(
      ...(selectedRows.length
        ? [
            distributionView
              ? distributionChart(selectedRows, x)
              : scatter(selectedRows, x, y),
          ]
        : []),
    );
    $("summaries").replaceChildren();
    for (const species of included) {
      const rows = selectedRows.filter((row) => row.variety === species),
        card = document.createElement("section");
      card.className = "species-card";
      card.dataset.species = species;
      const heading = document.createElement("h3");
      heading.textContent = species + " · n = " + rows.length;
      card.append(heading);
      for (const [axis, key] of distributionView
        ? [["x", x]]
        : [
            ["x", x],
            ["y", y],
          ]) {
        const result = IrisLab.summary(rows, key),
          line = document.createElement("p");
        line.dataset.axis = axis;
        line.textContent = `${label(key)}: mean ${result.mean.toFixed(3)} cm · SD ${result.sd.toFixed(3)} cm`;
        card.append(line);
      }
      if (distributionView) {
        const q = IrisLab.distribution(rows, x);
        const quartiles = document.createElement("p"),
          range = document.createElement("p");
        quartiles.dataset.summary = "quartiles";
        range.dataset.summary = "range";
        quartiles.textContent = `Q1 ${q.q1.toFixed(3)} cm · median ${q.median.toFixed(3)} cm · Q3 ${q.q3.toFixed(3)} cm`;
        range.textContent = `Observed range ${q.minimum.toFixed(3)}–${q.maximum.toFixed(3)} cm · IQR ${(q.q3 - q.q1).toFixed(3)} cm`;
        card.append(quartiles, range);
      }
      $("summaries").append(card);
    }
    $("source-table").replaceChildren(
      ...selectedRows.map((row) => {
        const tr = document.createElement("tr");
        for (const value of [
          row.source_row,
          row.variety,
          ...data.features.map((feature) => row[feature.key]),
        ]) {
          const td = document.createElement("td");
          td.textContent = value;
          tr.append(td);
        }
        return tr;
      }),
    );
  }
  function preset(x, y) {
    $("chart-view").value = "scatter";
    $("x-feature").value = x;
    $("y-feature").value = y;
    render();
  }
  $("petals").onclick = () => preset("petal.length", "petal.width");
  $("sepals").onclick = () => preset("sepal.length", "sepal.width");
  $("download").onclick = () => {
    if (!selectedRows.length) return;
    const blob = new Blob(
        [
          IrisLab.csv(
            selectedRows,
            data.features.map((feature) => feature.key),
          ),
        ],
        { type: "text/csv;charset=utf-8" },
      ),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "iris-selected.csv";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $("chart-view").addEventListener("change", render);
  $("receipt").textContent =
    `Source revision: ${data.source_revision}. Dataset SHA-256: ${data.analysis.dataset_sha256}. ${data.analysis.duplicate_rows} repeated measurement row retained. Supplied rows 35 and 38 are documented in the analysis JSON.`;
  render();
  $("results").hidden = false;
}
start().catch(() => {
  $("failure").hidden = false;
});
