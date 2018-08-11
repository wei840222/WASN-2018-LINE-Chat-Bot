const { Router } = require('express')
const router = Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);
var Schema = mongoose.Schema;
mongoose.model('Config', new Schema(
  {
    lunchBox: {
      start: String,
      end: String
    },
    dinner: {
      start: String,
      end: String
    },
    lunchBox2: {
      start: String,
      end: String
    }
  }
));

var Config = mongoose.model('Config');
var jsonParser = bodyParser.json()


// set up dataResource router.
router.get('/config', function (req, res) {
  Config.find(function (err, data) {
    if (err) res.send(500, err);
    else res.json(data);
  });
});

router.post('/config', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  else {
    console.log(req.body);
    Config.find(function (err, data) {
      console.log(err);
      console.log(data);
      if (err) res.send(500, err);
      else if (data.length == 0) {
        var newData = new Config({
          lunchBox: req.body.lunchBox || {},
          dinner: req.body.dinner || {},
          lunchBox2: req.body.lunchBox2 || {}
        });
        newData.save(function (err, newData) {
          if (err) res.send(500, err);
          else res.json(newData);
          console.log(newData);
        });
      }
      else {
        Config.findByIdAndUpdate(data[0]._id, {
          $addToSet: {
            lunchBox: req.body.lunchBox || {},
            dinner: req.body.dinner || {},
            lunchBox2: req.body.lunchBox2 || {}
          }, function(err, model) {
            if (err) res.send(500, err);
            else res.json(model);
            console.log(model);
          }
        })
      }
    });
  }
});

module.exports = router
