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

db.configure(config);

app.use(ctx => {
  console.log(this.query);

  try {
    db.query(
      sql,
      values
    );
  } catch (e) {
    console.error('ERROR ', sql);
    process.exit(-1);
  };

  ctx.body = 'Hello Koa';
});

app.listen(config.httpPort);