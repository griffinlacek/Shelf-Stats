var search_handler = require('./handlers/search_handler');
var add_book_handler = require('./handlers/add_book_handler');

module.exports = [
  { method: 'GET', path: '/api/search', handler: search_handler },
  { method: 'GET', path: '/api/add/{book_id}', handler: add_book_handler }
];
