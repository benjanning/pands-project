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
  const api = { summary, csv };
  if (typeof module !== "undefined") module.exports = api;
  else root.IrisLab = api;
})(typeof window !== "undefined" ? window : globalThis);
