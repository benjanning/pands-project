# Observation lab: evidence behind the controls

The challenge is to let a reader explore without silently changing the evidence. Python preserves the supplied CSV, emits the original row order and twelve species/feature reference summaries, and records the input hash and historical rows 35 and 38. Browser arithmetic independently computes means and sample SD (divisor n−1); browser tests reconcile every horizontal/vertical feature combination against Python references.

Species filters include whole supplied groups. They change visible points, summary cards, source-table rows and exported rows together. A fixed axis range per feature prevents filtering from exaggerating separation. Circle, triangle and square symbols supplement colour; native controls and a labelled scrollable table remain usable at narrow widths. Points receive no jitter; overlapping symbols and repeated measurement rows remain present. Source-row numbers identify CSV order, not biological specimens.

CSV export retains all four measurements, the supplied species label and source-row number in source order. The unchanged original CSV is available separately. Empty selection disables filtered export with explicit guidance. Failed loading keeps the result section hidden and offers reload/source recovery.

Verification: five Python regressions, two Node checks and three browser journeys. Browser checks cover all sixteen feature pairs at 1440 and 390 pixels, exact per-species mean/SD, every source-table row, zero/one/all-species selection, downloaded rows, no page overflow and failed loading. Genuine screenshots come from those working journeys. The single existing source workflow runs those checks, deploys Pages and publishes verified assets for central review PRs.

This is descriptive teaching data: no classifier training, clinical use, causal conclusion or population-wide accuracy claim. Sample SD describes observed variation, not uncertainty in a mean. Original coursework and saved figures remain available. Source attribution and variant history: https://archive.ics.uci.edu/dataset/53/iris .
