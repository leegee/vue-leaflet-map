const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('mysql-promise')();

const dbconfig = require('../Api').dbConfig;

const filepath = './src/apis/data-world-ufo-test/data/nuforc_reports.csv';

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

    sql = sql || 'INSERT IGNORE INTO sightings SET '
      + Object.keys(row).map(_ => '`' + _ + '` = ? ').join(',')

    try {
      db.query(
        sql,
        Object.keys(row).map(_ => row[_])
      );
    } catch (e) {
      console.error('ERROR ', sql);
    } finally {
      console.log('x');
    }
  });

