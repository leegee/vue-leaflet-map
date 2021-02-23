USE ufo

DROP TABLE IF EXISTS sightings;

CREATE TABLE sightings (
  summary TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  date_time DATETIME,
  shape VARCHAR(255),
  duration VARCHAR(255),
  stats TEXT,
  report_link VARCHAR(255),
  text TEXT,
  posted DATETIME,
  city_lat_lng POINT NOT NULL,
  city_latitude VARCHAR(10),
  city_longitude VARCHAR(10),
  city_location VARCHAR(255)

  /* v > 5.7 SPATIAL INDEX SPATIAL (city_lat_lng) */

) ENGINE = INNODB CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
