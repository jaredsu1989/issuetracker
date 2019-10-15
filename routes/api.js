/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
var express = require('express');
var expect = require('chai').expect;
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueModel = require('../models/issuemodel');
var app = express();
//Mount Body Parser to get form info/////////////////////////////////////////////////////////
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
const CONNECTION_STRING = process.env.DB; 
/*MongoClient.connect(CONNECTION_STRING, function(err, db) {
  if(err) {console.log(err)}
});*/
//Connecting to MogoDB///////////////////////////////////////////////////////
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false});
module.exports = function (app) {

//Routing////////////////////////////////////////////////////////////////////
  app.route('/api/issues/:project')
  //
    .get(function (req, res){
      var project = req.params.project;
    //Search DB for project with specified name using model.find() to return an array of matches
    //
    let query = req.query;  
    query.project = project;
    //let filter = req.query;
    IssueModel.find(query, function(err, result) {
        if (err) {
          return res.send("Error trying to find the specified project. Please check the project name and try again")
        }
        
      //
        return res.send(result.map((currentIssue) => {          
          return {
            _id: currentIssue._id,
        issue_title: currentIssue.issue_title,
        issue_text: currentIssue.issue_text,
        created_on: currentIssue.created_on,
        updated_on: currentIssue.updated_on,
        created_by: currentIssue.created_by,
        assigned_to: currentIssue.assigned_to,
        open: currentIssue.open,
        status_text: currentIssue.status_text
          }
        })); 
      //
        //return res.send(result);
      });
    //
      //return res.send(req.query);
    })
    //
    .post(function (req, res){
      var project = req.params.project;      
     let saveObj = new IssueModel({
       "project": project,
       "issue_title": req.body.issue_title,
       "issue_text": req.body.issue_text,
       "created_by": req.body.created_by,
       "created_on": new Date(),
       "updated_on": new Date(),
       "open": true,
       "assigned_to": req.body.assigned_to,
       "status_text": req.body.status_text
     });
    
    saveObj.save(function (err, product) {
      if (err) {
        return res.json({error: "Cannot save document."});
      };
      return res.json({
        _id: product._id,
        issue_title: product.issue_title,
        issue_text: product.issue_text,
        created_on: product.created_on,
        updated_on: product.updated_on,
        created_by: product.created_by,
        assigned_to: product.assigned_to,
        open: product.open,
        status_text: product.status_text
      });
    });     
      
   //return res.json({issue_title: req.body.issue_title})
    })
    
    .put(function (req, res){
      var project = req.params.project;
      //let issueId = req.body._id;
      let idQuery =  req.body._id;
      let idQueryObj = {_id: idQuery}
      let updatedField = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: req.body.open
      };
    
    if (idQuery == "" || idQuery == null) {
      return res.send("no updated field sent");
    } else {
         IssueModel.findByIdAndUpdate(idQueryObj, updatedField, {new: true}, function(err, data) {
        if (err || data == null) {
          //return res.send("Error excuting findByIdAndUpdate");
          return res.send("Could not update " + idQuery);
        } else if (
          data.issue_title == null &&
          data.issue_text == null &&
          data.created_by == null &&
          data.assigned_to == null &&
          data.status_text == null
        ) {
          return res.send("no updated field sent");
        } else {
           return res.send("sucessfully updated " + idQuery);   
        }              
      });
    }
      
   
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var idField = req.body._id;
      var id = {_id: idField};
      if (idField == "" || idField == null) {
      return res.send("_id error");
    } else {
              IssueModel.findOneAndDelete(id, function(err){
          if (err) {
            return res.json({failed: 'could not delete ' + id._id });
          }
          return res.json({success: 'deleted ' + id._id});
        });
    }

    }); 
  
};
