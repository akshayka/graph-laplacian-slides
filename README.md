# The graph Laplacian, as live slides

This repository holds a slide deck about spectral clustering with the graph
Laplacian. The slides are not static. Every figure, equation, and control on
them is computed by a marimo notebook running behind the page.

## How it works

[marimo](https://marimo.io) is a reactive Python notebook. When a value
changes, every cell that depends on it re-runs.
[marimo studio](https://pypi.org/project/marimo-studio/) lets one notebook
back one or more authored web pages. A page is ordinary HTML, CSS, and
JavaScript, and it pulls in live notebook results with tags like
`<marimo-cell name="fiedler_plot">` or `<marimo-output name="n_neighbors>`. This split matters because the notebook
stays the single source of the analysis while the page owns the presentation.
You write the analysis once and present it as a real web page instead of
freezing it into screenshots. In this deck, the dataset dropdown and the
neighbor slider re-run the same computation a reader could inspect in the
notebook, and editing the notebook updates the slides.

## Contents

- `graph_laplacian.py` is the notebook. It builds a nearest-neighbor graph
  over toy datasets and clusters them with the Fiedler eigenvector of the
  graph Laplacian.
- `__marimo__/studio/graph_laplacian/slides/` is the deck. `index.html`
  defines seven slides, `app.css` defines the theme, and `app.js` handles
  keyboard and touch navigation. Studio requires views to live at this path,
  next to the notebook.
- `.github/workflows/deploy.yml` exports the deck to a static WebAssembly
  site and publishes it to GitHub Pages on every push to `main`.

## Run it

Present the deck locally. marimo installs the notebook's inline dependencies
into a sandboxed environment:

```console
uvx marimo run --sandbox graph_laplacian.py
```

Open the authoring workspace, which shows the notebook and the slide source
side by side:

```console
uvx marimo edit --sandbox graph_laplacian.py
```

Build the static WebAssembly site yourself:

```console
uvx marimo-studio export graph_laplacian.py --view slides --output dist
```

The exported site runs the notebook in the browser through Pyodide, so it
needs no Python server.
