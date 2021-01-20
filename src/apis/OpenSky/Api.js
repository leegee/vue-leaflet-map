// https://opensky-network.org/apidoc/rest.html

const REQ_CONTROLLER = new AbortController();
const { signal } = REQ_CONTROLLER;

const BASE_URL = 'https://opensky-network.org/api';

let RUNNING = false;

export const MAP_ZOOM = 12;
export const UPDATE_MAP_MS = 0; // 1000 * 16;
export const UPDATE_USER_MS = 1000 * 30;

/**
 * @returns Promise<[{
 *     lat: Decimal,
 *     lng: Decimal,
 *     label: String,
 *     rotate: Decimal,
 *     layer: String,
 *     ...
 * }] || null>
 */
export async function getBoundingBox(bounds) {
  let rv = null;

  console.log('OpenSky.getBoundingBox', bounds.ne, bounds.sw1);

  const params = new URLSearchParams({
    lamin: bounds.sw.lat,
    lomin: bounds.sw.lng,
    lamax: bounds.ne.lat,
    lomax: bounds.ne.lng,
  });

  const url = BASE_URL + '/states/all?' + params.toString();

  console.log('OpenSky.getBoundingBox fetch', url);

  if (RUNNING) {
    // REQ_CONTROLLER.abort();
  }

  try {
    RUNNING = true;
    console.debug('GET', url);
    const res = await fetch(url, { signal });
    RUNNING = false;
    const json = await res.json();
    if (json && json.states !== null) {
      rv = _formatForGetBoundBox(json);
    } else if (json.states !== null) {
      console.error(json);
      throw new Error("The API returned no JSON");
    }
  } catch (e) {
    RUNNING = false;
    if (e.name === "AbortError") {
      console.log('I aborted');
    } else {
      throw new Error("The API returned an invalid response");
    }
  }

  return rv;
}


function _formatForGetBoundBox(json) {
  console.log('OpenSky._formatForGetBoundBox', json.states);

  if (json.states === null) {
    return null;
  }

  const rv = {};

  for (let i = 0; i < json.states.length; i++) {
    const id = json.states[i][1].trim();
    rv[id] = {
      lat: json.states[i][6],
      lng: json.states[i][5],
      label: id,
      rotate: json.states[i][10],
      layer: json.states[i][2],
      openskyState: json.states[i],
    };
  }

  return rv;
}

/*
Sample response `state`, added as openskyState
[
  0 "4bc842",      transponder
  1 "PGT1182 ",    callsign
  2 "Turkey",      countryName
  3 1610462739,    timePosition
  4 1610462739,    timeGeneral
  5 18.923,        lngOrNull
  6 46.8895,       latOrNull
  7 11262.36,      altBarometricOrNull
  8 false,         fromSurfaceBool
  9 235.51,        velocityMsOrNull
 10 125.22,        trackingDegreesOrNull
 11 -0.65,         verticalRateMsOrNull
 12 null,          recieverIdsOrNull
 13 11026.14,      altGeometricOrNull
 14 "1160",        squarkOrNull
 15 false,         specialPurposeBool
 16 0              posSource
],
  */