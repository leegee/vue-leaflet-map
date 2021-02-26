# A Modular Map App

A simple Vue 2.0 / Leaflet map app, to display almost any map data.

In `webpack.common.js`, Set `IMPLEMENTATION` to the name of the sub-directory of `src/apis` containing the data implementation. See `OpenSky` for a definative example.

Currently, search is of visible map and filters on `label`.

## UFOs

To use the UFO data, you'll need to create a datasource. Some rough code is supplied to create a rough MySQL entry and a tiny Koa service.

The Kaggle data is documented in the UFO `Help.vue` - strip the final space from the CSV header

## Options

The `AppVue` component will cluster unless initialised with the attribute `clustered=false`.

