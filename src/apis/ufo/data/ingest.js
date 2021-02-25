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

const COMMIT = false;

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
          const d = findDate(row);
          if (d) {
            row.date = d;
          }
        }

        if (row.date_time && row.date_time != '00-00-0000 00:00:00') {
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
        " No location       :", noLocation, "\n",
        "Yes location       :", yesLocation, "\n",
        "Location no date   :", noDate, "\n",
        "Location with date :", yesDate, "\n"
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


function findDate(row) {
  const dates = [row.stats, row.text];
  let date;

  while (dates.length) {
    const d = dates.pop();
    if (!d) {
      continue;
    }
    date = d.match(/(\d+)\/(\d+)\/(\d+)/);
    if (date) {
      row.date = date[2] + '-' + date[1] + '-' + date[3];
    }
    else {
      const year = d.match(/(\d{4})/);
      if (year) {
        row.date = '01-01-' + year[1];
      }
    }
  }

  return date;
}

/*

Occurred : 6/1/1953 21:00 (Entered as : 1953 21;00) Reported: 3/26/2008 11:22:41 AM 11:22 Posted: 3/31/2008 Location: Fresno, CA Shape: Duration:5 minutes

I seem to be the only one of my siblings to recall this event. i do not understand why this is. myself and some of my siblings were outside afterdark and i heard this exstremeley

*/