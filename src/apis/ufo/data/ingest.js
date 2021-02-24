const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();

const config = require('../config.js');

const filepaths = [
  // './src/apis/ufo/data/nuforc_reports.csv',
  './src/apis/ufo/data/nuforc_reports_2.csv'
];

let keys;
let sql;

db.configure(config.db);

filepaths.forEach(filepath => {

  fs.createReadStream(filepath)
    .on('error', (e) => {
      console.error(e);
    })

    .on('end', () => {
      console.log('Done', filepath);
    })

    .pipe(csvParser())

    .on('data', async (row) => {

      keys = keys || Object.keys(row);

      sql = sql || 'INSERT IGNORE INTO sightings SET '
        + keys.map(_ => {
          const val =
            _ === 'city_location' ?
              'geomfromtext(?)' : '?';
          return '`' + _ + '` = ' + val;
        }).join(',')

      if (row.city_location) {

        const values = Object.keys(row).map(_ => row[_]);

        try {
          await db.query(
            sql,
            values
          );
        } catch (e) {
          console.error('ERROR ', e, sql);
          process.exit(-1);
        }

        console.warn('OK city_location', row.city, row.state);

      } else {
        console.warn('No city_location', row.city, row.state, row.city_latitude, row.city_longitude);
      }
    });

});
