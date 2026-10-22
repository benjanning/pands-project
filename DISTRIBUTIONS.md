# Single-feature distribution view

The scatter plot remains the default. The distribution view answers a different descriptive question: how does one observed measurement vary within each supplied species?

## Evidence and display

All selected observations remain present, including the repeated measurement row and the supplied historical variant. Each symbol uses its exact feature value horizontally. Deterministic vertical offsets only separate observations and have no numerical meaning. Species occupy fixed rows, and horizontal ranges are computed from all 150 supplied observations so filtering does not rescale the comparison.

Summary strips beneath the points keep Q1, median and Q3 visible. Whiskers use observed minimum and maximum; these are not Tukey fences, confidence intervals or an outlier-removal rule. Summary cards give exact quartiles, range and IQR alongside the existing mean and sample SD.

The browser helper sorts a copy and interpolates at (n-1)*p: Type 7 linear quantiles. For [1,2,3,4], Q1=1.75, median=2.5 and Q3=3.25. Empty input has null statistics; a single observation has that value at each quantile. Non-finite measurements are rejected. Input order is never changed.

## Independent verification

Python adds twelve species/feature reference distributions using NumPy linear quantiles, leaving the existing species-summary CSV schema intact. A separate test reconciles all quartiles with statistics.quantiles(method="inclusive") and medians with statistics.median. Original source rows, duplicate policy and historical rows 35/38 remain independently checked.

Five Node checks cover existing means/SD and CSV semantics plus known quantiles, empty/single/repeated data, invalid values and non-mutation. Five browser journeys include both original scatter workflows and new desktop/mobile distribution workflows. They read the supplied CSV using the standard CSV reader, reconcile every original point's horizontal SVG position, inspect every quartile/range/median coordinate and compare displayed numbers with the independent Python references. Filtering preserves the scale and exact selected rows; downloaded CSV still contains all four features. Empty filters, keyboard mode selection, retained vertical feature and preset return to scatter are checked.

The vertical selector is inactive in distribution mode with an explicit reason. Switching back preserves its value; two-feature presets explicitly return to scatter. Shared scale/marker functions keep the two views consistent. The source table and export use the same selected original rows in either view.

This remains descriptive teaching-data exploration. No classifier is trained, general population performance inferred or biological cause established. The original CSV, coursework and analysis figures remain available. Generated build JSON stays untracked, and the existing single release/export and central review process publishes genuine captures.
