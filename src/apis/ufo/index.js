
const REQ_CONTROLLER = new AbortController();
const { signal } = REQ_CONTROLLER;

let RUNNING = false;

import config from './config';

export const initialState = {
  zoom: 8,
  maxZoom: 12,
  minZoom: 2, // Limit amount of data loaded at once
  zoomLevelHideLabels: 10,
  updateMs: 0, // Don't
  center: [37.234332396, -115.80666344], // Area 51 :)
  useDateFilter: true,
};

/**
 * @returns Promise<[{
 *     lat: Decimal,
 *     lng: Decimal,
 *     label: String,
 *     rotate: Decimal,
 *     layer: String,
 *     htmlClass: String || undefined,
 *     ...
 * }] || null>
 */
export async function getBoundingBox({ bounds, fromDate, toDate, showUndated }) {
  let rv = null;

  console.debug('ufo.getBoundingBox', bounds.ne, bounds.sw1);
  console.debug('ufo.from/to/undated', fromDate, toDate, showUndated);

  const params = {
    sw_lat: bounds.sw.lat,
    sw_lng: bounds.sw.lng,
    ne_lat: bounds.ne.lat,
    ne_lng: bounds.ne.lng,
  };

  if (toDate && fromDate) {
    params.to_date = toDate;
    params.from_date = fromDate;
  }

  if (showUndated) {
    params.show_undated = showUndated;
  }

  const url = config.http.host + ':' + config.http.port + '?' +
    new URLSearchParams(params).toString();

  console.info('ufo.getBoundingBox fetch', url);

  if (RUNNING) {
    REQ_CONTROLLER.abort();
    RUNNING = false;
  }

  try {
    RUNNING = true;
    console.debug('GET', url);

    const res = await fetch(url, { signal });

    RUNNING = false;
    const json = await res.json();

    if (json && json.results !== null) {
      rv = _formatForGetBoundBox(json);
    } else if (json.results === null) {
      console.error(json);
      throw new Error("The API returned no JSON");
    }
  } catch (e) {
    RUNNING = false;
    if (e.name === "AbortError") {
      console.debug('I aborted');
    } else {
      throw new Error(e);
    }
  }

  return rv;
}

function _formatForGetBoundBox(json) {
  console.debug('ufo._formatForGetBoundBox', json);

  const rv = {};

  for (let i = 0; i < json.results.length; i++) {
    const id = i;
    const klass = 'ufo_' + json.results[i].shape;
    let undated;
    if (json.results[i].date_time === '0000-00-00 00:00:00') {
      klass += ' undated';
      undated = true;
    } else {
      json.results[i].date_time = json.results[i].date_time.replace(/T.+$/, '');
    }

    rv[id] = {
      key: i,
      lat: json.results[i].city_location.y.toFixed(4),
      lng: json.results[i].city_location.x.toFixed(4),
      label: (undated ? 'Undated' : json.results[i].date_time) + ' ' + json.results[i].shape,
      rotate: 0,
      layer: json.results[i].shape,
      ufo: json.results[i],
      htmlClass: klass,
    };
  }

  return rv;
}

