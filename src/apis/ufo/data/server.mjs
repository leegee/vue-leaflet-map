/*

All requests should be to the root URL with a query string having the following params:

    lat_min
    lng_min
    lat_max
    lng_max
    to_date
    from_date

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

      let sql = "SELECT * FROM sightings WHERE ";

      if (q.from_date !== undefined && q.to_date !== undefined) {
        sql += "(date_time BETWEEN '1-1-" + q.from_date + "' AND '31-12-" + q.to_date + "') AND ";
      }

      if (!q.show_undated) {
        sql += " date_time != 0 AND ";
      }

      sql += "MBRContains( GeomFromText( 'LINESTRING("
        + q.sw_lng + ' ' + q.sw_lat + ', '
        + q.sw_lng + ' ' + q.ne_lat + ', '
        + q.ne_lng + ' ' + q.ne_lat + ', '
        + q.ne_lng + ' ' + q.sw_lat + ', '
        + q.sw_lng + ' ' + q.sw_lat
        + ")' ), sightings.city_location)";

      console.log(sql);

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
      console.log(e);
      body.status = 500;
      body.msg = e;
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