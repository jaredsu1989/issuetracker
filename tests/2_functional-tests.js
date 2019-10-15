/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.notEqual(res.body.issue_title, "", "issue title field filled in");
          assert.notEqual(res.body.issue_text, "", "issue text field filled in");
          assert.notEqual(res.body.created_by, "", "created by field filled in");
          assert.notEqual(res.body.assigned_to, "", "assigned to field filled in");
          assert.notEqual(res.body.status_text,"", "status text field filled in");          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Sample Title',
            issue_text: 'text',
            created_by: 'Functional Test - Required Field Filled In'
        })
          .end(function(err, res) {         
            assert.equal(res.status, 200);
            assert.exists(res.body.issue_title)
          assert.exists(res.body.issue_text)
          assert.exists(res.body.created_by);            
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
              issue_title: null,
          issue_text: null,
          created_by: null,
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
      })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, null, 'missing required field');
              assert.equal(res.issue_text, null, 'missing required field');
              assert.equal(res.status_text, null, 'missing required field')
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({  
        })
          .end(function(err, res) {
          assert.equal(res.status, 200);      
          assert.isEmpty(res.body);
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
          _id: "5d5cdb2d05d5e74294d307ae",
          issue_title: "Make this a test",
          issue_text: undefined,
          created_by: undefined,
          assigned_to: undefined,
          status_text: undefined
        })
          .end(function(err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.text, 'sucessfully updated 5d5cdb2d05d5e74294d307ae', "Message indicating successful update");        
          
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
          _id: "5d5cdb2d05d5e74294d307ae",
          issue_title: "Make this a test",
          issue_text: "Make this another test",
          created_by: undefined,
          assigned_to: undefined,
          status_text: undefined
        })
          .end(function(err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.text, 'sucessfully updated 5d5cdb2d05d5e74294d307ae', "Message indicating successful update");        
          
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
            issue_title: 'Sample Title'
        })
        .end(function(err, res){
         // console.log(res.body);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.propertyVal(res.body[0], 'issue_title',"Sample Title");         
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
         chai.request(server)
        .get('/api/issues/test')
        .query({
           issue_title: 'Sample Title',
           issue_text: 'text'

        })
        .end(function(err, res){
           //console.log(res.body)
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.propertyVal(res.body[0], 'issue_title', "Sample Title");
          assert.propertyVal(res.body[0], 'issue_text', 'text');          
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');          
          assert.property(res.body[0], 'open');        
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({})
          .end(function(err, res) {
          console.log(res.text)
          assert.equal(res.status, 200);
          assert.equal(res.text, "_id error");
          done();
        });
      });
      
      test('Valid _id', function(done) {
         chai.request(server)
          .delete('/api/issues/test')
          .query({
           _id: "5d5b8645fac10a2bb7228611"
         })
          .end(function(err, res) {
          console.log(res.text)
          assert.equal(res.status, 200);
          assert.equal(res.text, "_id error");
          done();
        });
      });
      
    });

});
