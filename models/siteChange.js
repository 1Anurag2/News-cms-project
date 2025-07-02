const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  website_title: {
    type: String,
    required: true
  },
  website_logo: {
    type: String,
  },
  footer_description: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model('SiteChange', siteSchema);

