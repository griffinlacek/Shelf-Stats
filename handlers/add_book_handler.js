var env = require('env2')('./.env');
var request = require('request');
var xml2js = require('xml2js');
var ISBN = require('isbn').ISBN;

function add_book_handler(req, reply) {
  var bookId = req.params.book_id;
  var bookUri = process.env.GOODREADS_URL + 'book/show/' + bookId + '.xml?';
  var keyString = 'key=' + process.env.GOODREADS_KEY;

  var bookInfoUrl = bookUri + keyString;

  request(bookInfoUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parseString = xml2js.parseString;

      parseString(body, function(err, result) {
        var isbn = result.GoodreadsResponse.book[0].isbn;
        var openLibrayBook = 'https://openlibrary.org/api/books?bibkeys=ISBN:' +
          isbn + '&jscmd=data&format=json';

        request(openLibrayBook, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var bookInfo = JSON.parse(body)['ISBN:' + isbn];

            console.log(bookInfo);

            var isbn_10 = isbn;
            var isbn_13 = ISBN.parse(isbn_10).asIsbn13();;
            var bookCover = "";
            var bookTitle = bookInfo.title;
            var pageCount = bookInfo.number_of_pages;
            var bookAuthor = bookInfo.authors[0].name;

            if(bookInfo.hasOwnProperty('cover')) {
              var bookCover = bookInfo.cover.large;
            } else {
              bookCover = 'http://images.amazon.com/images/P/' + isbn_10 + '.jpg';
            }

            var bookInfo = {isbn_10, isbn_13, bookTitle, bookAuthor, bookCover, pageCount};

            reply(bookInfo);
          }
        });
      });
    }
  });
}

module.exports = add_book_handler;
