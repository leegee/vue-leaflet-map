const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();

const dbConfig = require('./src/apis/data-world-ufo/Api.mjs').dbConfig;

const filepath = './config/ufo/nuforc_reports.csv';

let keys;
let sql;

db.configure(dbConfig);

fs.createReadStream(filepath)
  .on('error', (e) => {
    console.error(e);
  })

  .on('end', () => {
    console.log('Done');
  })

  .pipe(csvParser())

  .on('data', (row) => {

    if (!keys) {
      keys = Object.keys(rows);
      delete keys.city_latitude;
      delete keys.city_longitude;
      keys.push('city_lat_lng');
    }

    sql = sql || 'INSERT IGNORE INTO sightings SET '
      + Object.keys(keys).map(_ => '`' + _ + '` = ? ').join(',')

    const values = Object.keys(row).map(_ => row[_]);
    values.push(
      POINT(row.city_latitude, city_longitude)
    );

    try {
      db.query(
        sql,
        values
      );
    } catch (e) {
      console.error('ERROR ', sql);
    } finally {
      console.log('x');
    }
  });

