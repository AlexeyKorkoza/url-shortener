var express = require('express');
var GoogleUrl = require('google-url');
var _ = require('lodash');
var token = require('../middlewares/token');
var Url = require('../models/url');
var config = require('../config');
var router = express();

router.get('', getUrls);
router.get('/stats', token.required, getStatsByUsername);
router.post('/create', token.required, createShortUrl);
router.put('/count/:id', token.required, updateCountClick);

module.exports = router;

function getUrls(req, res) {

  Url.find({}, function (err, urls) {

    if (err) {
      res.status(500).json(err);
    }

    if (urls.length > 0) {
      res.status(200).json({
        urls: urls
      })
    }

    if (urls.length === 0) {
      res.status(500);
    }

  });
}

function getStatsByUsername(req, res) {

  Url.find({"author": req.payload.username}, function (err, urls) {

    if (err) {
      res.status(500).json(err);
    }

    if (urls.length > 0) {
      var urlsCount = _.reduce(urls, function (current, item) {
        if (item.count_click) {
          current += item.count_click;
        }
        return current;
      }, 0);

      res.status(200).json({
        urls: urls,
        urlsCount: urlsCount
      })
    }

    if (urls.length === 0) {
      res.status(500).json("Urls didn't find");
    }
  })
}

function createShortUrl(req, res) {

  _.trim(req.body.list_tags);
  var tags = _.split(req.body.list_tags, ',');
  tags.splice(tags.length - 1, 1);

  var date = returnDate();
  var time = returnTime();

  var googleUrl = new GoogleUrl({
    "key": config.get('google_key')
  });

  googleUrl.shorten(req.body.full_url, function (err, shortUrl) {

    if (err) {
      res.status(500).json(err);
    }

    var url = new Url({
      "author": req.payload.username,
      "description": req.body.description,
      "full_url": req.body.full_url,
      "short_url": shortUrl,
      "list_tags": [],
      "date": date,
      "time": time
    });

    _.forEach(tags, function (value, i) {
      url.list_tags[i] = {
        "name": value
      };
    });

    url.save(function (err, url) {

      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json("Shortener url is created!");
      }

    });

  });

}

function updateCountClick(req, res) {

  var count_click = req.body.count_click + 1;

  Url.findOneAndUpdate({_id: req.params.id}, {$set: {count_click: count_click}}, {new: true}, function (err, url) {

    if (err) {
      return res.status(500).json(err);
    }

    if (url) {
      return res.status(200).json("Count of the click is updated");
    }

  })
}

function returnDate() {
  var d = new Date();
  var yyyy = d.getFullYear();
  var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
  var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  return dd + "-" + mm + "-" + yyyy;
}

function returnTime() {
  var d = new Date();
  var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
  var ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  return hh + ":" + min + ":" + ss;
}