'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var CompanySchema = new Schema({
  ticker: {type: String},
  company:{type: String  }
});

// schema.index({ ticker: 'text', company:'text'})

exports.Company = mongoose.model('Company', CompanySchema);