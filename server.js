const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
var models = require('./models/models');
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

app.get('/ping', function (req, res) {
 return res.send('pong');
});

var Contact = models.Contact;

app.post('/contact/create', function(req, res) {
  var newContact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    birthday: req.body.birthday
  })

  newContact.save(function(err) {
    if (err) {
      res.status(400).json({main:"Error updating one! ", err: err});
    } else {
      res.status(200).json({main:"success saving the mongoose contact", body: req.body});
    }

  })
})

app.post('/contact/display', function(req, res) {
  Contact.find({}, function(err, contacts) {
    if (err) {
      console.log("Error finding contacts! ", err);
    } else {
      // console.log("the contacts are found, and are: ", contacts);
      res.json(contacts);
    }
  })
})

app.post('/contact/delete', function(req, res) {
  console.log('delete req.body', req.body)
  Contact.deleteOne({_id: req.body._id}, function(err, contact) {
    if (err) {
      res.status(400).json({main:"Error deleting one! ", err: err});
    } else {
      res.status(200).json({main: "success deleting one!"})
    }
  })
})

app.post('/contact/edit', function(req, res) {
  console.log('edit req.body', req.body)
  console.log('edit req.body[0] is: ', req.body[0]);
  console.log('edit req.body[1] is: ', req.body[1]);
  Contact.findOneAndUpdate({_id: req.body[0]._id}, {
    name: req.body[1].name,
    phone: req.body[1].phone,
    birthday: req.body[1].birthday
  }, function(err) {
    if (err) {
      res.status(400).json({main:"Error updating one! ", err: err});
    } else {
      res.status(200).json({main: "success updating one!"})
    }
  })
})

// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 1337);
