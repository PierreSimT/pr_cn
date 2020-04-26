var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var Service = new Schema({
    name: String,
    description: String,
    path: String,
    parameters: [{ name: String, type: {type: String} }],
    results: [{ date: { type: Date, default: Date.now }, vars: [String], result: {console: String, file: String} }]
});

/**
 * Methods
 */


module.exports = mongoose.model('Service', Service);