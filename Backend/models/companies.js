'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var CompanySchema = new Schema({
  ticker: String,
  company: String
});

exports.Company = mongoose.model('Company', CompanySchema);