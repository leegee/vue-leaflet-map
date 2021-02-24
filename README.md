# A Modular Map App

A simple Vue 2.0 / Leaflet map app, to display almost any map data.

In `webpack.common.js`, Set `IMPLEMENTATION` to the name of the sub-directory of `src/apis` containing the data implementation. See `OpenSky` for a definative example.

Currently, search is of visible map and filters on `label`.

## Options

The `AppVue` component will cluster unless initialised with the attribute `clustered=false`.

