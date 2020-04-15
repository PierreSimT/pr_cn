var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var Service = new Schema({
    name: String,
    path: String,
    parameters: [{ name: String, type: {type: String} }],
    results: [{ date: { type: Date, default: Date.now }, vars: [String], result: String }]
});

/**
 * Methods
 */


module.exports = mongoose.model('Service', Service);