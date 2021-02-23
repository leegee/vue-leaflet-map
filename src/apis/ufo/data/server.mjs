/*

All requests should be to the root URL with a query string having the following params:

    lat_min
    lng_min
    lat_max
    lng_max

*/

import Koa from 'koa';
import getMysql from 'mysql-promise';

const db = getMysql();
const app = new Koa();

import config from '../config.js';

db.configure(config.db);

app.use(async (ctx) => {
  const body = {
    status: 200
  };

  const q = ctx.request.query;

  if (q !== null && q.sw_lat !== undefined && !q.sw_lng !== undefined && !q.ne_lat !== undefined && !q.ne_lng !== undefined) {

    try {
      const sql = "SELECT * FROM sightings WHERE MBRContains( GeomFromText( 'POLYGON(("
        + q.sw_lat + ' ' + q.sw_lng + ', '
        + q.sw_lat + ' ' + q.ne_lng + ', '
        + q.ne_lat + ' ' + q.ne_lng + ', '
        + q.ne_lat + ' ' + q.sw_lng + ', '
        + "))' ), sightings.city_location)";

      console.log(sql);
      await db.query(sql).spread(function (rows) {
        body.rows = rows;
      });
    } catch (e) {
      body.status = 500;
      body.msg = JSON.Stringify(e);
    };


  } else {
    body.status = 400;
    body.msg = 'Missing request parameters';
  }

  ctx.body = JSON.stringify(body);
  console.log(ctx.body);
  // db.end();
});

console.log("Listening on", config.http.port);

app.listen(config.http.port);