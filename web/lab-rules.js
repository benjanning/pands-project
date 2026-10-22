(function (root) {
  "use strict";
  function summary(rows, feature) {
    const values = rows.map((row) => row[feature]);
    if (values.some((value) => !Number.isFinite(value)))
      throw Error("Expected finite observed measurements.");
    if (!values.length) return { n: 0, mean: null, sd: null };
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const sd =
      values.length > 1
        ? Math.sqrt(
            values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
              (values.length - 1),
          )
        : null;
    return { n: values.length, mean, sd };
  }
  function distribution(rows, feature) {
    const values = rows.map((row) => row[feature]);
    if (values.some((value) => !Number.isFinite(value)))
      throw Error("Expected finite observed measurements.");
    if (!values.length)
      return {
        n: 0,
        minimum: null,
        q1: null,
        median: null,
        q3: null,
        maximum: null,
      };
    values.sort((a, b) => a - b);
    const quantile = (p) => {
      const position = (values.length - 1) * p,
        lower = Math.floor(position),
        fraction = position - lower;
      return (
        values[lower] +
        fraction *
          (values[Math.min(lower + 1, values.length - 1)] - values[lower])
      );
    };
    return {
      n: values.length,
      minimum: values[0],
      q1: quantile(0.25),
      median: quantile(0.5),
      q3: quantile(0.75),
      maximum: values.at(-1),
    };
  }
  function csv(rows, features) {
    const columns = ["source_row", ...features, "variety"];
    const cell = (value) => '"' + String(value).replaceAll('"', '""') + '"';
    return (
      [
        columns.map(cell).join(","),
        ...rows.map((row) => columns.map((key) => cell(row[key])).join(",")),
      ].join("\r\n") + "\r\n"
    );
  }
  const api = { summary, csv, distribution };
  if (typeof module !== "undefined") module.exports = api;
  else root.IrisLab = api;
})(typeof window !== "undefined" ? window : globalThis);
