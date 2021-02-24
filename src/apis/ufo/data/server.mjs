/*

All requests should be to the root URL with a query string having the following params:

    lat_min
    lng_min
    lat_max
    lng_max

*/

import Koa from "koa";
import getMysql from "mysql-promise";
import cors from "@koa/cors";

const db = getMysql();

import config from "../config.js";

const app = new Koa();
app.use(cors({ origin: "*" }));

db.configure(config.db);

app.use(async (ctx) => {
  const body = {
    status: 200
  };

  const q = ctx.request.query;

  if (q !== null && q.sw_lat !== undefined && !q.sw_lng !== undefined && !q.ne_lat !== undefined && !q.ne_lng !== undefined) {

    try {
      const sql = "SELECT * FROM sightings WHERE MBRContains( GeomFromText( 'LINESTRING("
        + q.sw_lng + ' ' + q.sw_lat + ', '
        + q.sw_lng + ' ' + q.ne_lat + ', '
        + q.ne_lng + ' ' + q.ne_lat + ', '
        + q.ne_lng + ' ' + q.sw_lat + ', '
        + q.sw_lng + ' ' + q.sw_lat
        + ")' ), sightings.city_location)";

      await db.query(sql).spread(function (rows) {
        body.results = rows.map(_ => {
          if (!_.shape) {
            _.shape = 'unspecified';
          }
          return _;
        });
        console.log('Rows matched:', rows.length);
      });
    }

    catch (e) {
      body.status = 500;
      body.msg = JSON.Stringify(e);
    };

  } else {
    body.status = 400;
    body.msg = 'Missing request parameters';
  }

  ctx.body = JSON.stringify(body);
  // db.end();
});

console.log("Listening on", config.http.port);

app.listen(config.http.port);