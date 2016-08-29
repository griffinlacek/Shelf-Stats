var env = require('env2')('./.env');
var request = require('request');
var xml2js = require('xml2js');

function search_handler(req, reply) {
  var searchQuery = "";

  if(req.query.hasOwnProperty('q')) {
    searchQuery = req.query.q;
  }

  var searchUri = process.env.GOODREADS_URL + 'search/index.xml?';
  var keyString = 'key=' + process.env.GOODREADS_KEY;
  var queryString = '&q=' + searchQuery;

  var bookSearchUrl = searchUri  + keyString + queryString;

  request(bookSearchUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parseString = xml2js.parseString;

      parseString(body, function(err, result) {
          var searchList = result.GoodreadsResponse.search[0].results[0].work;
          var bookList = {};

          for(var i in searchList) {
            var bookId = searchList[i].best_book[0].id[0]._;
            var bookTitle = searchList[i].best_book[0].title;
            var bookAuthor = searchList[i].best_book[0].author[0].name;
            var bookImage = searchList[i].best_book[0].image_url;
            bookList[i] = { bookId, bookTitle, bookAuthor, bookImage };
          }

          reply(bookList);
      });
    }
  });
}

module.exports = search_handler;
