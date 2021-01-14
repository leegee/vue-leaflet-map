// https://opensky-network.org/apidoc/rest.html

const baseUrl = 'https://opensky-network.org/api';

/**
 * @returns Promise<[] || null>
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

  const url = baseUrl + '/states/all?' + params.toString();

  console.log('OpenSky.getBoundingBox fetch', url);

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json && json.states !== null) {
      rv = _formatForGetBoundBox(json);
    } else {
      console.error('Nothing in the json', json);
    }
  } catch (e) {
    console.warn(e);
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
    };
  }

  console.log('OpenSky._formatForGetBoundBox', rv);
  return rv;
}

/*
Sample response `state`:
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