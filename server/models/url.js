var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  author: String,
  description: String,
  list_tags: [{
    "name": String
  }],
  count_click: {
    type: Number,
    default: 0
  },
  full_url: String,
  short_url: String,
  date: String,
  time: String
});

var Url = mongoose.model('Url', UrlSchema);

module.exports = Url;