<template>
  <div>
    <H2>NUFORC Data</H2>
    <p>
      <a target="_blank" href="https://www.kaggle.com/NUFORC/ufo-sightings"
        >Kaggle</a
      >
    </p>
    <h2>Timothy Renner</h2>
    <p>
      Full text and geocoded UFO sighting reports from the National UFO Research
      Center (NUFORC), processed by
      <a href="https://data.world/timothyrenner/ufo-sightings" target="_blank">
        Timothy Renner
      </a>
      - which I slurped into a MySQL 5.7 geospatial table becuase I had the DB
      around. Despite the claims made below, many entries are lacking
      co-ordinates.
    </p>
    <h3>About</h3>
    <p>
      <a target="_blank" href="http://www.nuforc.org"
        >The National UFO Research Center</a
      >
      collects and serves over 100,000 reports of UFO sightings. \nThis dataset
      contains the report content itself including the time, location duration,
      and other attributes in both the raw form as it is recorded on the NUFORC
      site as well as a refined, standardized form that also contains lat/lon
      coordinates.
    </p>
    <p>
      <img
        src="http://1.bp.blogspot.com/-fOF1t2r7Fgk/TcW01yvCVrI/AAAAAAAAAA0/ttSOxTge3F8/s1600/ufo.jpg"
      />
    </p>
    <h2>Reports</h2>
    <p>
      The raw reports are line-delimited JSON documents that contain the report
      information exactly as it appears on the NUFORC site.\nThis is the
      starting point for the "cleaner" version of the dataset.\nThere are quite
      a few inconsistencies in this dataset in terms of formatting, errors, etc.
    </p>
    <p>
      The CSV reports have cleaned state and city names, standardized dates and
      lat/lon values of the cities in which the sightings occurred.\nIt's easier
      to work with but has some opinions.
    </p>
    <p>
      ## What's Different\n \nThis dataset appears in a couple of different
      places here on data.world so it's worth mentioning what makes this one
      different:
    </p>
    <ol>
      <li>All of the reports are present - this is a complete scrape.</li>
      <li>
        The entire report contents are present, including the full text of the
        report.
      </li>
      <li>
        The reports are geocoded at the city level. It isn't a complete
        geocoding, but about 90k / 110k reports have an associated lat/lon.
      </li>
      <li>
        The "cleaned" version of the dataset has a few key standardizations
        applied like date times, city names, state codes, etc that make it
        easier to work with (though the raw data is still available too).
      </li>
    </ol>
    <p>Other versions of the dataset to check out:</p>
    <ul>
      <li>
        <a
          target="_blank"
          href="https://data.world/khturner/national-ufo-reporting-center-reports"
          >https://data.world/khturner/national-ufo-reporting-center-reports</a
        >
      </li>
      <li>
        <a
          target="_blank"
          href="https://data.world/aarranzlopez/ufo-sights-2016-us-and-canada"
          >https://data.world/aarranzlopez/ufo-sights-2016-us-and-canada</a
        >
      </li>
    </ul>
    <h3>Code</h3>
    <p>
      This dataset was assembled by scraping the reports from the NUFORC site
      (done with <a taget="_blank" href="https://scrapy.org">scrapy</a>), then
      merged with a city location database to perform the geocoding. The code is
      available on
      <a
        target="_blank"
        href="https://github.com/timothyrenner/nuforc_sightings_data"
        >GitHub</a
      >.
    </p>
    <h3>Changelog</h3>
    <p>
      **2020-01-04** Refreshed the dataset. This has removed some records,
      bringing the total number of available sightings down to about 88k. This
      change came from the NUFORC website, which also has a reduced number of
      sightings. The city standardization code for joining to the GeoLite
      database was updated with additional cleaning.
    </p>
    <h3>Inspiration</h3>
    <p>
      For a little inspiration, I made a project that has some basic plots I
      threw together when I was exploring the dataset.
    </p>
    <p>
      <a
        target="_blank"
        href="https://data.world/timothyrenner/ufo-sighting-basics"
        >https://data.world/timothyrenner/ufo-sighting-basics</a
      >
    </p>
    <h3>Other Notes</h3>
    <p>
      The geocoding is possible thanks to MaxMind, who publishes a free database
      of city locations.
    </p>
    <p>
      This product includes GeoLite2 data created by
      <a target="_blank" href="http://www.maxmind.com](http://www.maxmind.com"
        >MaxMind</a
      >.
    </p>
  </div>
</template>

<script type='application/javascript'>
export default {
  name: "Help",
};
</script>


