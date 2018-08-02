var mongoose = require('mongoose');

// Create all of your models/schemas here, as properties.
var contactSchema = mongoose.Schema({
  name: String,
  phone: String,
  birthday: String
});

module.exports = {
  Contact: mongoose.model('Contact', contactSchema)
};
