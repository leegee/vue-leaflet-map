/**
 * Implementation for https://opensky-network.org/apidoc/rest.html
 */

const REQ_CONTROLLER = new AbortController();
const { signal } = REQ_CONTROLLER;

const BASE_URL = 'https://opensky-network.org/api';

const COUNTRY_NAMES = new Map();

COUNTRY_NAMES.set(/China/, 'CCP');
COUNTRY_NAMES.set(/United Arab Emirates/, 'UAE');
COUNTRY_NAMES.set(/Kingdom of the Netherlands/i, 'NL');
COUNTRY_NAMES.set(/United Kingdom/i, 'UK');
COUNTRY_NAMES.set(/Czech Republic/i, 'C zechia');
COUNTRY_NAMES.set(/bosnia and herzegovina/i, 'Bosnia');
COUNTRY_NAMES.set(/Republic of Korea/i, 'S Korea');
COUNTRY_NAMES.set(/The former Yugoslav Republic of Macedonia/i, 'Macedonia');

let RUNNING = false;

export const initialState = {
  zoom: 12,
  zoomLevelHideLabels: 10,
  updateMs: 1000 * 10,
  maxZoom: 12,
  minZoom: 2
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
export async function getBoundingBox({ bounds, _fromDate, _toDate, _showUndated }) {

  let rv = null;

  console.log('Enter OpenSky.getBoundingBox', bounds);

  if (!bounds.sw || !bounds.ne) {
    throw new Error("bounds does not contain sw or ne");
  }

  const params = new URLSearchParams({
    lamin: bounds.sw.lat,
    lomin: bounds.sw.lng,
    lamax: bounds.ne.lat,
    lomax: bounds.ne.lng,
  });

  const url = BASE_URL + '/states/all?' + params.toString();

  console.debug('OpenSky.getBoundingBox fetch', url);

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
      throw new Error(e);
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
    const htmlClass = 'opensky_' + (json.states[i][8] ? '0' : (Math.ceil(json.states[i][13] / 1500) + 1));

    COUNTRY:
    for (let j of COUNTRY_NAMES) {
      if (json.states[i][2].match(j)) {
        json.states[i][2] = COUNTRY_NAMES[j];
        break COUNTRY;
      }
    }

    rv[id] = {
      key: i,
      lat: json.states[i][6],
      lng: json.states[i][5],
      label: id,
      rotate: json.states[i][10],
      layer: json.states[i][2],
      openskyState: json.states[i],
      htmlClass,
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