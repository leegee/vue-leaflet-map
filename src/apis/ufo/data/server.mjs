/*

All requests should be to the root URL with a query string having the following params:

    lat_min
    lng_min
    lat_max
    lng_max

*/

import Koa from 'koa';
import getMysql from 'mysql-promise';

const app = new Koa();

const db = getMysql();

import config from '../config.js';

db.configure(config);

app.use(ctx => {
  console.log(this.query);
  ctx.body = 'Hello Koa';
});

app.listen(config.httpPort);