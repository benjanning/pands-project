# Iris / three species, four measurements

A clear, reproducible exploration of 150 supplied flower observations, with fifty examples of each species.

![Actual petal and sepal relationships](results/relationships.png)

**Python · pandas · NumPy · Matplotlib · Descriptive analysis**

[Visual case study](https://benjanning.github.io/projects/projects/iris-analysis/) · [Portfolio](https://benjanning.github.io/projects/)

## What the measurements show

Setosa forms a distinct petal cluster in these observations. Versicolor and Virginica overlap; sepal measurements overlap more strongly. Colours are the supplied species labels, not model predictions.

![All four observed feature distributions](results/distributions.png)

Each point is an actual measurement in centimetres. Boxes show medians and quartiles. A fixed seed changes only horizontal point placement, preserving all values and repeated rows.

![Observed species means and spread](results/profiles.png)

Bars show one sample standard deviation on either side of the mean. They describe observed spread and are not confidence intervals. Features are separate measurements, not a sequence.

## Reproduce and inspect

```bash
python -m pip install -r requirements.txt
python explore_iris.py
python -m unittest discover -p "test_*.py" -v
```

The entry point resolves paths independently of the working directory and saves three figures, [twelve species/feature summaries](results/species-summary.csv), [pooled correlations](results/pooled-correlations.csv) and [input provenance and versions](results/analysis.json). Three tests independently reconcile means and standard deviations, validate counts/hash and reproduce numeric files exactly. Source CI regenerates figures and exports a commit-identified verified package for the portfolio's review process.

## Source and interpretation

The preserved [iris.csv](iris.csv) is an Iris teaching dataset variant. [UCI's Iris record](https://archive.ics.uci.edu/dataset/53/iris) documents the four measurements in centimetres, three species and historical corrections to observations 35 and 38. This project records those supplied rows and the file hash rather than silently replacing data. UCI provides the dataset under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); see its record for original attribution to R. A. Fisher and the dataset history.

Identical measurement rows are retained: equal measurements alone do not establish duplicate sampling. Pooled correlations can reflect differences between species; they do not establish causation. This descriptive exploration does not measure general classifier performance. Original educational classifier examples, `analysis.py`, `Project.ipynb`, charts and [coursework documentation](COURSEWORK.md) remain available.

[Visual provenance](assets/PROVENANCE.md)
