const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();
const config = require('../config.js');

const filepaths = [
  './src/apis/ufo/data/nuforc_reports.csv',
  // './src/apis/ufo/data/nuforc_reports_2.csv' // No locations
];

let noDate = 0;
let yesDate = 0;
let noLocation = 0;
let yesLocation = 0;
let keys;
let sql;

const COMMIT = true;

if (COMMIT) {
  // createDb(fs.readFileSync('src/apis/ufo/data/schema.sql').toString());
  db.configure(config.db);
}

filepaths.forEach(filepath => {

  fs.createReadStream(filepath)
    .on('error', (e) => {
      console.error(e);
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
        yesLocation++;
        const values = Object.keys(row).map(_ => row[_]);

        if (!row.date_time) {
          const date = row.text.match(/(\d+)\/(\d+)\/(\d+)/);
          if (date) {
            row.date = date[2] + '-' + date[1] + '-' + date[3];
            yesDate++;
          }
          else {
            const year = row.text.match(/(\d{4})/);
            if (year) {
              row.date = '01-01-' + year[1];
              yesDate++;
            }
            else {
              noDate++;
            }
          }
        } else {
          yesDate++;
        }

        if (COMMIT) {
          try {
            await db.query(sql, values);
          } catch (e) {
            console.error('ERROR ', e, sql);
            process.exit(-1);
          }
        }

      } else {
        noLocation++;
      }
    })

    .on('end', () => {
      console.log('Done', filepath, "\n",
        " No location :", noLocation, "\n",
        "Yes location :", yesLocation, "\n",
        " No date     :", noDate, "\n",
        "Yes date     :", yesDate, "\n"
      );
      process.exit();
    });

});

async function createDb(schema) {
  console.log(schema.split(/\n{2,}/).length);

  schema.split(/\n{2,}/).forEach(async (block) => {
    try {
      await db.query(block);
    } catch (e) {
      console.error(e);
    } finally {
      console.log('OK ' + block);
    }
  });
}