const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();
const config = require('../config.js');

const TYPE = 'kaggle';
const COMMIT = true;

// const filepath = './src/apis/ufo/data/test.csv';

const filepath =
  TYPE === 'kaggle'
    ? './src/apis/ufo/data/kaggle/scrubbed.csv'
    : './src/apis/ufo/data/nuforc_reports.csv';

const keys = [
  "summary", "city", "state", "date_time", "shape", "duration", "stats", "report_link", "text", "posted", "city_latitude", "city_longitude", "city_location"
];

const sql = 'INSERT INTO sightings ('
  + keys.join(',')
  + ') VALUES ('
  + keys.map(_ => {
    return _ === 'city_location' ? 'GeomFromText(?)' : '?';
  }).join(',')
  + ')';


main();

async function main() {

  if (COMMIT) {
    // createDb(fs.readFileSync('src/apis/ufo/data/schema.sql').toString());
    db.configure(config.db);
    await db.query('DELETE FROM sightings');
  }

  let done = 0;
  let noDate = 0;
  let yesDate = 0;
  let noLocation = 0;
  let yesLocation = 0;

  fs.createReadStream(filepath)
    .on('error', (e) => {
      console.error(e);
    })

    .pipe(csvParser())

    .on('data', async (row) => {
      if (row.city_location || TYPE === 'kaggle') {
        yesLocation++;

        row = rowWithDate(row);
        if (row.date_time && row.date_time != "00-00-0000 00:00:00") {
          yesDate++;
        }

        const values = keys.map(_ => row[_]);

        if (COMMIT) {
          try {
            await db.query(sql, values);
          } catch (e) {
            console.error(e, values);
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
    });
}

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
  let date;
  const dates = [row.stats, row.text];

  while (dates.length) {
    const d = dates.pop();
    if (!d) {
      continue;
    }
    const datetime = d.match(/(\d+)\/(\d+)\/(\d+)/);
    if (datetime) {
      date = datetime[2] + '-' + datetime[1] + '-' + datetime[3];
    }
    else {
      const year = d.match(/(\d{4})/);
      if (year) {
        date = '01-01-' + year[1];
        break;
      }
    }
  }

  return date;
}

function kaggleDate(str) {
  let date;
  const d = str.match(/^\s*(\d+)\/(\d+)\/(\d+)/);

  if (d) {
    date = new Date(d[3], d[2], d[1]);
    date = date.toISOString();
    date = date.substring(0, 16);
  }

  return date;
}

function rowWithDate(row) {
  if (TYPE === "kaggle") {
    row.city_location = 'POINT(' + parseFloat(row.longitude) + ' ' + parseFloat(row.latitude) + ')';
    row.duration = row['duration (seconds)'];
    row.text = row['comments'];
    row.date_time = kaggleDate(row.datetime);
    row.posted = kaggleDate(row["date posted"]);
  } else if (!row.date_time) {
    row.date_time = findDate(row);
  }
  return row;
}

