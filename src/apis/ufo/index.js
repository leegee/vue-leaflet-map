
const REQ_CONTROLLER = new AbortController();
const { signal } = REQ_CONTROLLER;

let RUNNING = false;

import config from './config';

export const initialState = {
  zoom: 8,
  maxZoom: 12,
  minZoom: 9, // Limit amount of data loaded at once
  zoomLevelHideLabels: 10,
  updateMs: 0, // Don't
  center: [37.234332396, -115.80666344], // Area 51 :)
  updateMs: 1000 * 60,
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
export async function getBoundingBox(bounds) {
  let rv = null;

  console.log('ufo.getBoundingBox', bounds.ne, bounds.sw1);

  const params = new URLSearchParams({
    sw_lat: bounds.sw.lat,
    sw_lng: bounds.sw.lng,
    ne_lat: bounds.ne.lat,
    ne_lng: bounds.ne.lng,
  });

  const url = config.http.host + ':' + config.http.port + '?' + params.toString();

  console.debug('ufo.getBoundingBox fetch', url);

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
      console.log('I aborted');
    } else {
      throw new Error(e);
    }
  }

  return rv;
}

function _formatForGetBoundBox(json) {
  console.log('ufo._formatForGetBoundBox', json);

  const rv = {};

  for (let i = 0; i < json.results.length; i++) {
    const id = i;

    rv[id] = {
      lat: json.results[i].city_latitude,
      lng: json.results[i].city_longitude,
      label: json.results[i].shape,
      rotate: 0,
      layer: json.results[i].shape,
      ufo: json.results[i],
      htmlClass: 'ufo_' + json.results[i].shape,
    };
  }

  console.log('OK');
  return rv;
}

/*

city: "Arcade"
city_latitude: "42.3358"
city_location: {x: -8.5962, y: 42.3358}
city_longitude: "-8.5962"
date_time: "2016-12-04T18:10:00.000Z"
duration: "5 minutes"
posted: "2016-12-14T23:00:00.000Z"
report_link: "http://www.nuforc.org/webreports/131/S131633.html"
shape: "circle"
state: "GA"
stats: "Occurred : 12/4/2016 19:10  (Entered as : 12/4/16 19:10) Reported: 12/5/2016 8:02:27 PM 20:02 Posted: 12/15/2016 Location: Arcade, GA Shape: Circle Duration:5 minutes"
summary: "Very strange, very bright, flashing light."
text: "Ver..."

*/