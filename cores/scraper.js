var jsdom = require('jsdom');

function scraper( Nurl, tags, cb ) {
  jsdom.env({
    url: Nurl,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      var $ = window.$;
      var all = $(tags).html();
      cb(all);
    }
  });
}

exports.scraper = scraper