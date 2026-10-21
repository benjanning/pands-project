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
  function scatter(rows, xKey, yKey) {
    const chart = element("svg", {
      viewBox: "0 0 540 390",
      role: "img",
      "aria-label": `${rows.length} observed rows. ${label(xKey)} horizontally and ${label(yKey)} vertically, in centimetres. Species use circle, triangle and square markers. Exact values are in the source table.`,
    });
    function scale(key, start, end) {
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
    const x = scale(xKey, 65, 515),
      y = scale(yKey, 310, 25);
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
    for (const row of rows) {
      const i = data.species.indexOf(row.variety),
        cx = x.map(row[xKey]),
        cy = y.map(row[yKey]);
      let point;
      if (i === 0) point = element("circle", { cx, cy, r: 4.5 });
      else if (i === 1)
        point = element("polygon", {
          points: `${cx},${cy - 5.5} ${cx + 5},${cy + 4} ${cx - 5},${cy + 4}`,
        });
      else
        point = element("rect", { x: cx - 4, y: cy - 4, width: 8, height: 8 });
      point.setAttribute("class", "point");
      point.setAttribute("fill", colours[i]);
      point.setAttribute("fill-opacity", ".78");
      point.setAttribute("stroke", "#fffef9");
      point.setAttribute("stroke-width", ".6");
      point.append(
        element(
          "title",
          {},
          `Source row ${row.source_row}: ${row.variety}, ${row[xKey]} / ${row[yKey]} cm`,
        ),
      );
      chart.append(point);
    }
    return chart;
  }
  function render() {
    const included = [
        ...$("species-controls").querySelectorAll("input:checked"),
      ].map((input) => input.value),
      x = $("x-feature").value,
      y = $("y-feature").value;
    selectedRows = data.observations.filter((row) =>
      included.includes(row.variety),
    );
    $("selection-status").textContent =
      `${selectedRows.length} of 150 source rows shown · ${included.length} species selected.`;
    $("same-feature").hidden = x !== y;
    $("empty").hidden = selectedRows.length > 0;
    $("download").disabled = !selectedRows.length;
    $("scatter").replaceChildren(
      ...(selectedRows.length ? [scatter(selectedRows, x, y)] : []),
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
      for (const [axis, key] of [
        ["x", x],
        ["y", y],
      ]) {
        const result = IrisLab.summary(rows, key),
          line = document.createElement("p");
        line.dataset.axis = axis;
        line.textContent = `${label(key)}: mean ${result.mean.toFixed(3)} cm · SD ${result.sd.toFixed(3)} cm`;
        card.append(line);
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
  $("receipt").textContent =
    `Source revision: ${data.source_revision}. Dataset SHA-256: ${data.analysis.dataset_sha256}. ${data.analysis.duplicate_rows} repeated measurement row retained. Supplied rows 35 and 38 are documented in the analysis JSON.`;
  render();
  $("results").hidden = false;
}
start().catch(() => {
  $("failure").hidden = false;
});
