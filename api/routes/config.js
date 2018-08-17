const { Router } = require('express')
const router = Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Base64 = require('js-base64').Base64;

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
    },
    admins: [{ userName: String, passwd: String }]
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
      if (err) res.send(500, err);
      else if (data.length == 0) {
        var newData = new Config({
          lunchBox: req.body.lunchBox || {},
          dinner: req.body.dinner || {},
          lunchBox2: req.body.lunchBox2 || {},
          admins: []
        });
        newData.save(function (err, newData) {
          if (err) res.send(500, err);
          else res.json(newData);
        });
      }
      else {
        Config.findById(data[0]._id, function (err, doc) {
          if (err) res.send(500, err);
          else {
            for (var att in req.body) {
              if (att === 'admins') continue
              doc[att] = req.body[att]
            }
            doc.save(function (err, doc) {
              if (err) res.send(500, err);
              else res.json(doc);
            });
          }
        })
      }
    });
  }
});

router.post('/config/admins', jsonParser, function (req, res) {
  if (!req.body || !req.body.userName || !req.body.passwd) return res.sendStatus(400)
  else {
    console.log(req.body);
    Config.find(function (err, data) {
      if (err) res.send(500, err);
      else {
        Config.findById(data[0]._id, function (err, doc) {
          if (err) res.send(500, err);
          else {
            doc.admins.push({ userName: req.body.userName, passwd: req.body.passwd })
            doc.save(function (err, doc) {
              if (err) res.send(500, err);
              else res.json(doc);
            });
          }
        })
      }
    });
  }
});

router.post('/config/admins/auth', jsonParser, function (req, res) {
  if (!req.body || !req.body.userName || !req.body.passwd) return res.sendStatus(400)
  else {
    console.log(req.body);
    Config.find(function (err, data) {
      if (err) res.send(500, err);
      else {
        Config.findById(data[0]._id, function (err, doc) {
          if (err) res.send(500, err);
          else {
            const user = doc.admins.filter(admin => admin.userName === req.body.userName)
            console.log(user[0])
            if (user.length === 0 || user[0].passwd !== req.body.passwd) res.send(401);
            else res.json({ userName: user[0].userName, accessToken: Base64.encodeURI(user[0].userName + '.' + user[0].passwd) })
          }
        })
      }
    });
  }
});

module.exports = router
