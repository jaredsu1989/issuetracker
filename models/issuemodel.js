//Model and schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({
  
  "project": {type: String, required: true},
  "issue_title": { type: String, required: true },
  "issue_text": { type: String, required: true },
  "created_on": Date,
  "updated_on": Date,
  "created_by": { type: String, required: true },
  "open":  Boolean,
  "assigned_to": String,
  "status_text": String  
});



module.exports = mongoose.model('IssueModel', IssueSchema);