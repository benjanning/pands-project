import csv, json, statistics, tempfile, unittest
from pathlib import Path
import explore_iris as iris


class ExplorerTests(unittest.TestCase):
    def test_export_preserves_original_rows_and_variant(self):
        with (iris.ROOT / "iris.csv").open(encoding="utf-8-sig") as f:
            original = list(csv.DictReader(f))
        with tempfile.TemporaryDirectory() as tmp:
            iris.analyze(tmp, False)
            report = json.loads((Path(tmp) / "explorer-data.json").read_text("utf8"))
        expected = [
            dict(
                **{k: float(row[k]) for k in iris.FEATURES},
                variety=row["variety"],
                source_row=i
            )
            for i, row in enumerate(original, 1)
        ]
        self.assertEqual(report["observations"], expected)
        self.assertEqual(
            report["analysis"]["observations_35_38"],
            [
                {k: v for k, v in expected[i].items() if k != "source_row"}
                for i in [34, 37]
            ],
        )
        values = [
            tuple(row[k] for k in iris.FEATURES + ["variety"]) for row in expected
        ]
        self.assertEqual(
            report["analysis"]["duplicate_rows"], len(values) - len(set(values))
        )
        self.assertEqual(len(expected), 150)

    def test_reference_summaries_match_independent_statistics(self):
        with tempfile.TemporaryDirectory() as tmp:
            iris.analyze(tmp, False)
            report = json.loads((Path(tmp) / "explorer-data.json").read_text("utf8"))
        self.assertEqual(len(report["reference_summaries"]), 12)
        for item in report["reference_summaries"]:
            values = [
                row[item["feature"]]
                for row in report["observations"]
                if row["variety"] == item["species"]
            ]
            self.assertEqual(item["n"], 50)
            self.assertAlmostEqual(item["mean"], statistics.mean(values))
            self.assertAlmostEqual(item["sd"], statistics.stdev(values))
