const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();

const config = require('../config.js');

const filepath = './src/apis/ufo/data/nuforc_reports.csv';

let keys;
let sql;

db.configure(config);

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
      keys = Object.keys(row).filter(_ => _ !== 'city_latitude' && _ !== 'city_longitude');
    }

    sql = sql || 'INSERT IGNORE INTO sightings SET '
      + keys.map(_ => '`' + _ + '` = ? ').join(',')

    const values = Object.keys(row).map(_ => row[_]);

    try {
      db.query(
        sql,
        values
      );
    } catch (e) {
      console.error('ERROR ', sql);
      process.exit(-1);
    }
  });

