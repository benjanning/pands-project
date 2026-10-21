"""Portable descriptive analysis; preserves the supplied Iris observations."""

from pathlib import Path
import hashlib, json, platform
import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parent
FEATURES = ["sepal.length", "sepal.width", "petal.length", "petal.width"]
LABELS = ["Sepal length", "Sepal width", "Petal length", "Petal width"]
SPECIES = ["Setosa", "Versicolor", "Virginica"]
COLORS = ["#397c65", "#bc8845", "#726aa0"]


def analyze(output=None, figures=True):
    source = ROOT / "iris.csv"
    data = pd.read_csv(source)
    if list(data.columns) != FEATURES + ["variety"] or data.groupby(
        "variety"
    ).size().to_dict() != dict.fromkeys(SPECIES, 50):
        raise ValueError("Expected three species of fifty observations")
    if (
        not np.isfinite(data[FEATURES]).all().all()
        or not (data[FEATURES] > 0).all().all()
    ):
        raise ValueError("Measurements must be positive and finite")
    out = Path(output) if output else ROOT / "results"
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    for species in SPECIES:
        for feature in FEATURES:
            y = data.loc[data.variety == species, feature]
            rows.append(
                dict(
                    species=species,
                    feature=feature,
                    n=len(y),
                    mean=y.mean(),
                    sd=y.std(ddof=1),
                    minimum=y.min(),
                    median=y.median(),
                    maximum=y.max(),
                )
            )
    summary = pd.DataFrame(rows)
    summary.to_csv(out / "species-summary.csv", index=False)
    data[FEATURES].corr().to_csv(out / "pooled-correlations.csv")
    evidence = dict(
        rows=len(data),
        species_counts=data.groupby("variety").size().to_dict(),
        duplicate_rows=int(data.duplicated().sum()),
        duplicate_policy="Retained as supplied observations; identical measurements do not establish duplicate sampling.",
        dataset_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
        units="centimetres",
        source="https://archive.ics.uci.edu/dataset/53/iris",
        variant_note="Supplied CSV preserved unchanged. UCI documents historical corrections to observations 35 and 38; no silent data replacement.",
        observations_35_38=data.iloc[[34, 37]].to_dict(orient="records"),
        python=platform.python_version(),
        numpy=np.__version__,
        pandas=pd.__version__,
        matplotlib=matplotlib.__version__,
    )
    (out / "analysis.json").write_text(
        json.dumps(evidence, indent=2) + "\n", encoding="utf-8"
    )
    report = dict(
        schema_version=1,
        analysis=evidence,
        features=[dict(key=key, label=label) for key, label in zip(FEATURES, LABELS)],
        species=SPECIES,
        observations=data.assign(source_row=np.arange(1, len(data) + 1)).to_dict(
            orient="records"
        ),
        reference_summaries=summary.to_dict(orient="records"),
    )
    (out / "explorer-data.json").write_text(
        json.dumps(report, indent=2, allow_nan=False) + "\n", encoding="utf-8"
    )
    petal = summary[summary.feature == "petal.length"].set_index("species")
    (out / "portfolio-summary.txt").write_text(
        "150 supplied observations, 50 per species. Mean petal lengths: "
        + ", ".join(f'{s} {petal.loc[s,"mean"]:.3f} cm' for s in SPECIES)
        + ". Setosa forms a distinct petal cluster in these observations; Versicolor and Virginica overlap. All four measurements and all species labels are observed data, not model predictions. Repeated measurement rows are retained; this descriptive teaching sample does not establish general classification performance.\n",
        encoding="utf-8",
    )
    if figures:
        plot(data, summary, out)
    return evidence


def plot(data, summary, out):
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 11,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "figure.facecolor": "#faf9f5",
            "axes.facecolor": "#faf9f5",
            "axes.titleweight": "bold",
        }
    )
    fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
    for ax, (x, y, title) in zip(
        axes,
        [
            ("petal.length", "petal.width", "Petals reveal distinct structure"),
            ("sepal.length", "sepal.width", "Sepals overlap more strongly"),
        ],
    ):
        for s, c in zip(SPECIES, COLORS):
            d = data[data.variety == s]
            ax.scatter(
                d[x],
                d[y],
                s=28,
                alpha=0.7,
                label=s,
                c=c,
                edgecolors="white",
                linewidths=0.4,
            )
        ax.set(
            xlabel=x.replace(".", " ").title() + " (cm)",
            ylabel=y.replace(".", " ").title() + " (cm)",
            title=title,
        )
        ax.grid(alpha=0.15)
        ax.set_axisbelow(True)
    axes[0].legend(frameon=False)
    fig.suptitle(
        "Iris / 150 observed flowers", x=0.07, ha="left", fontsize=19, fontweight="bold"
    )
    fig.tight_layout(rect=(0, 0, 1, 0.94))
    fig.savefig(out / "relationships.png", dpi=150)
    plt.close(fig)
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    rng = np.random.default_rng(40)
    for ax, f, label in zip(axes.flat, FEATURES, LABELS):
        values = [data.loc[data.variety == s, f].to_numpy() for s in SPECIES]
        ax.boxplot(
            values,
            positions=range(3),
            widths=0.42,
            showfliers=False,
            medianprops={"color": "#222"},
        )
        for i, (v, c) in enumerate(zip(values, COLORS)):
            ax.scatter(
                i + rng.uniform(-0.16, 0.16, len(v)), v, s=15, color=c, alpha=0.65
            )
        ax.set(xticks=range(3), xticklabels=SPECIES, ylabel="cm", title=label)
        ax.grid(axis="y", alpha=0.15)
    fig.suptitle(
        "Every measurement / 50 observations per species",
        fontsize=18,
        fontweight="bold",
    )
    fig.text(
        0.07,
        0.015,
        "Boxes: median and quartiles. Points: all observations; seed 40 changes only horizontal jitter.",
        fontsize=10,
    )
    fig.tight_layout(rect=(0, 0.04, 1, 0.94))
    fig.savefig(out / "distributions.png", dpi=150)
    plt.close(fig)
    fig, ax = plt.subplots(figsize=(12, 5.8))
    x = np.arange(4)
    for i, (s, c) in enumerate(zip(SPECIES, COLORS)):
        d = summary[summary.species == s].set_index("feature").loc[FEATURES]
        ax.errorbar(
            x + (i - 1) * 0.14,
            d["mean"],
            yerr=d.sd,
            fmt="o",
            capsize=5,
            label=s,
            color=c,
            markersize=7,
        )
    ax.set(
        xticks=x,
        xticklabels=LABELS,
        ylabel="Centimetres",
        title="Species profiles / means and observed spread",
    )
    ax.legend(frameon=False, ncol=3)
    ax.grid(axis="y", alpha=0.15)
    fig.text(
        0.08,
        0.025,
        "Bars show ±1 sample standard deviation, not confidence intervals. Features are separate measurements, not a sequence.",
        fontsize=10,
    )
    fig.tight_layout(rect=(0, 0.06, 1, 1))
    fig.savefig(out / "profiles.png", dpi=150)
    plt.close(fig)


if __name__ == "__main__":
    analyze()
